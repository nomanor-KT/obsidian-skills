param(
    [switch]$ForceMonthly,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$statePath = Join-Path $PSScriptRoot ".obsidian-radar-state.json"
$today = Get-Date
$folderDate = $today.ToString("dd - MM - yyyy")
$projectName = "Obsidian Radar"
$artifactDir = Join-Path $root ("Artefakty\{0} - {1}" -f $folderDate, $projectName)
$reportPath = Join-Path $artifactDir "obsidian-radar-report.md"

$desktopReleasesUrl = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/desktop-releases.json"
$pluginsUrl = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json"
$pluginStatsUrl = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json"
$latestReleasePage = "https://github.com/obsidianmd/obsidian-releases/releases/latest"

function Read-State {
    if (Test-Path $statePath) {
        try {
            return Get-Content -Path $statePath -Raw | ConvertFrom-Json
        }
        catch {
            return [pscustomobject]@{
                lastSeenVersion = ""
                lastMonthlyReport = ""
            }
        }
    }

    return [pscustomobject]@{
        lastSeenVersion = ""
        lastMonthlyReport = ""
    }
}

function Write-State($state) {
    $state | ConvertTo-Json | Set-Content -Path $statePath -Encoding UTF8
}

function Get-PluginUpdatedDate($value) {
    if (-not $value) { return $null }

    if ($value -is [int64] -or $value -is [int32] -or $value -is [double]) {
        try {
            return [DateTimeOffset]::FromUnixTimeMilliseconds([int64]$value).DateTime
        }
        catch {
            return $null
        }
    }

    if ($value -is [datetime]) {
        return $value
    }

    try {
        return [datetime]::Parse($value)
    }
    catch {
        return $null
    }
}

function Score-Plugin($plugin, $stat) {
    $text = ("{0} {1}" -f $plugin.name, $plugin.description).ToLowerInvariant()

    $keywords = @(
        "task", "kanban", "calendar", "daily", "journal", "template", "templater",
        "quickadd", "dataview", "todo", "note", "search", "tag", "metadata",
        "knowledge", "graph", "ai", "automation", "workflow", "reader", "readwise"
    )

    $relevance = 0
    foreach ($k in $keywords) {
        if ($text.Contains($k)) {
            $relevance += 1
        }
    }

    $downloads = 0
    if ($stat -and $stat.downloads) {
        $downloads = [int64]$stat.downloads
    }

    $updatedDate = $null
    if ($stat -and $stat.updated) {
        $updatedDate = Get-PluginUpdatedDate $stat.updated
    }

    $daysSinceUpdate = 9999
    if ($updatedDate) {
        $daysSinceUpdate = [math]::Max(0, (($today - $updatedDate).Days))
    }

    $freshnessBonus = [math]::Max(0, 365 - $daysSinceUpdate)

    # Keep scoring simple and explainable: relevance first, then popularity, then freshness.
    $score = ($relevance * 1000000000000) + ($downloads * 1000) + $freshnessBonus

    return [pscustomobject]@{
        relevance = $relevance
        downloads = $downloads
        updated = $updatedDate
        score = $score
    }
}

New-Item -ItemType Directory -Path $artifactDir -Force | Out-Null

$state = Read-State
$desktop = Invoke-RestMethod -Uri $desktopReleasesUrl
$latestVersion = "$($desktop.latestVersion)"
$previousVersion = "$($state.lastSeenVersion)"
$previousVersionDisplay = $previousVersion
if ([string]::IsNullOrWhiteSpace($previousVersionDisplay)) {
    $previousVersionDisplay = "n/a"
}

$isNewVersion = $false
if ([string]::IsNullOrWhiteSpace($previousVersion)) {
    $isNewVersion = $true
}
elseif ($latestVersion -ne $previousVersion) {
    $isNewVersion = $true
}

$monthKey = $today.ToString("yyyy-MM")
$shouldGenerateMonthly = $ForceMonthly -or ($state.lastMonthlyReport -ne $monthKey)

$plugins = @()
$stats = $null
$shortlist = @()

if ($shouldGenerateMonthly) {
    $plugins = Invoke-RestMethod -Uri $pluginsUrl
    $stats = Invoke-RestMethod -Uri $pluginStatsUrl

    $candidates = foreach ($p in $plugins) {
        $statProp = $stats.PSObject.Properties[$p.id]
        $statVal = $null
        if ($statProp) {
            $statVal = $statProp.Value
        }

        $sc = Score-Plugin -plugin $p -stat $statVal

        if ($sc.relevance -gt 0) {
            [pscustomobject]@{
                id = $p.id
                name = $p.name
                author = $p.author
                description = $p.description
                repo = $p.repo
                downloads = $sc.downloads
                updated = $sc.updated
                relevance = $sc.relevance
                score = $sc.score
            }
        }
    }

    $shortlist = $candidates |
        Sort-Object -Property @{ Expression = "score"; Descending = $true } |
        Select-Object -First 5

    if ($shortlist.Count -lt 5) {
        $fallback = foreach ($p in $plugins) {
            $statProp = $stats.PSObject.Properties[$p.id]
            $downloads = 0
            $updated = $null
            if ($statProp) {
                $downloads = [int64]$statProp.Value.downloads
                $updated = Get-PluginUpdatedDate $statProp.Value.updated
            }

            [pscustomobject]@{
                id = $p.id
                name = $p.name
                author = $p.author
                description = $p.description
                repo = $p.repo
                downloads = $downloads
                updated = $updated
                relevance = 0
                score = $downloads
            }
        }

        $need = 5 - $shortlist.Count
        $extra = $fallback |
            Where-Object { $shortlist.id -notcontains $_.id } |
            Sort-Object -Property @{ Expression = "downloads"; Descending = $true } |
            Select-Object -First $need

        $shortlist = @($shortlist + $extra)
    }
}

$lines = @()
$lines += "# Obsidian Radar Report"
$lines += ""
$lines += "Date: $($today.ToString("yyyy-MM-dd HH:mm"))"
$lines += ""
$lines += "## Version Status"
$lines += "- Latest public desktop version: **$latestVersion**"
$lines += "- Previous saved version: **$previousVersionDisplay**"
if ($isNewVersion) {
    $lines += "- Alert: **NEW VERSION DETECTED**"
}
else {
    $lines += "- Alert: No new version since last check"
}
$lines += "- Latest release page: $latestReleasePage"
$lines += ""

if ($shouldGenerateMonthly) {
    $lines += "## Monthly Plugin Shortlist (Top 5)"
    $index = 1
    foreach ($item in $shortlist) {
        $updatedText = "unknown"
        if ($item.updated) {
            $updatedText = $item.updated.ToString("yyyy-MM-dd")
        }

        $lines += "### $index. $($item.name) (id: $($item.id))"
        $lines += "- Author: $($item.author)"
        $lines += "- Downloads: $($item.downloads)"
        $lines += "- Last update (from stats): $updatedText"
        $lines += "- Repo: https://github.com/$($item.repo)"
        $lines += "- Why useful: $($item.description)"
        $lines += ""
        $index += 1
    }
}
else {
    $lines += "## Monthly Plugin Shortlist"
    $lines += "- Skipped: report already generated for $monthKey"
    $lines += "- Run with -ForceMonthly to regenerate now"
    $lines += ""
}

$lines | Set-Content -Path $reportPath -Encoding UTF8

$state.lastSeenVersion = $latestVersion
if ($shouldGenerateMonthly) {
    $state.lastMonthlyReport = $monthKey
}
Write-State -state $state

if (-not $Quiet) {
    Write-Host "[Obsidian Radar] Version: $latestVersion"
    if ($isNewVersion) {
        Write-Host "[Obsidian Radar] NEW VERSION DETECTED"
    }
    else {
        Write-Host "[Obsidian Radar] No version change"
    }

    if ($shouldGenerateMonthly) {
        Write-Host "[Obsidian Radar] Monthly shortlist generated"
    }
    else {
        Write-Host "[Obsidian Radar] Monthly shortlist skipped (already done this month)"
    }

    Write-Host "[Obsidian Radar] Report: $reportPath"
}
