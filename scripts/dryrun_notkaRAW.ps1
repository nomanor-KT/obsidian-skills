function Remove-Diacritics {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) { return "" }
    $normalized = $Text.Normalize([Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    foreach ($c in $normalized.ToCharArray()) {
        $uc = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($c)
        if ($uc -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($c)
        }
    }
    return $sb.ToString().Normalize([Text.NormalizationForm]::FormC)
}

function Get-Slug {
    param([string]$Text)

    $clean = Remove-Diacritics $Text
    $clean = $clean.ToLowerInvariant()
    $clean = $clean -replace '[^a-z0-9\s-]', ' '
    $clean = $clean -replace '\s+', '-'
    $clean = $clean.Trim('-')
    if ([string]::IsNullOrWhiteSpace($clean)) { return 'note' }
    if ($clean.Length -gt 70) { return $clean.Substring(0, 70).Trim('-') }
    return $clean
}

function Get-DateFromText {
    param(
        [string]$FullText,
        [string]$FileName
    )

    $iso = [regex]::Match($FullText, '\b(20\d{2})-(\d{2})-(\d{2})\b')
    if ($iso.Success) { return $iso.Value }

    $dot = [regex]::Match($FullText, '\b(\d{2})\.(\d{2})\.(20\d{2})\b')
    if ($dot.Success) { return "{0}-{1}-{2}" -f $dot.Groups[3].Value, $dot.Groups[2].Value, $dot.Groups[1].Value }

    $slash = [regex]::Match($FullText, '\b(\d{2})/(\d{2})/(20\d{2})\b')
    if ($slash.Success) { return "{0}-{1}-{2}" -f $slash.Groups[3].Value, $slash.Groups[2].Value, $slash.Groups[1].Value }

    $fromName = [regex]::Match($FileName, '^(20\d{2})-(\d{2})-(\d{2})')
    if ($fromName.Success) { return $fromName.Value }

    return (Get-Date -Format 'yyyy-MM-dd')
}

function Detect-Carrier {
    param([string]$Text)

    if ($Text -match '(?i)\bmaersk\b') { return @{ key = 'maersk'; folder = 'Maersk' } }
    if ($Text -match '(?i)\bcma\b|\bcma cgm\b') { return @{ key = 'cma'; folder = 'CMA' } }
    if ($Text -match '(?i)\bmsc\b') { return @{ key = 'msc'; folder = 'MSC' } }
    if ($Text -match '(?i)\bhapag\b|\bhapag-lloyd\b') { return @{ key = 'hapag'; folder = 'Hapag' } }
    if ($Text -match '(?i)\bsamskip\b') { return @{ key = 'samskip'; folder = 'Samskip' } }
    return $null
}

function Detect-Type {
    param([string]$Text)

    if ($Text -match '(?i)\bmeeting\b|\bspotkanie\b|\bagenda\b|\bminutes\b|\bcall\b') { return 'spotkanie' }
    if ($Text -match '(?i)\bai\b|\bllm\b|\bdashboard\b|\bseatrack\b|\bprojekt\b') { return 'projekt' }
    if ($Text -match '(?i)\bsurcharge\b|\boplat\w*\b|\bpsa notice\b') { return 'operacja-surcharge' }
    if ($Text -match '(?i)\bnewsletter\b|shipcoweekly|sea freight intelligence') { return 'newsletter' }
    if ($Text -match '(?i)google alerts|market intelligence|analysis|analiza') { return 'intel' }
    return 'notatka'
}

function Get-Route {
    param(
        [string]$Type,
        [string]$Text,
        [string]$BaseDir,
        [hashtable]$Carrier
    )

    $sourceBlock
    if ($Type -eq 'kontakt') { return Join-Path $BaseDir 'kontakty' }
    if ($Type -eq 'spotkanie') { return Join-Path $BaseDir 'praca/spotkania' }
    if ($Type -eq 'projekt') { return Join-Path $BaseDir 'praca/ai-projekty' }
    if ($Type -eq 'operacja-surcharge') { return Join-Path $BaseDir 'praca/surcharge' }
    if ($Type -eq 'newsletter' -or $Type -eq 'intel') { return Join-Path $BaseDir 'praca/armatorzy/inne' }

    if ($Carrier -and ($Text -match '(?i)\bmail\b|\bfrom\b|\bnadawca\b|\bsubject\b|\bupdate\b')) {
        return Join-Path $BaseDir ("praca/armatorzy/{0}" -f $Carrier.folder)
    }

    if ($Type -eq 'operacja') { return Join-Path $BaseDir 'praca' }
    return Join-Path $BaseDir 'ja'
}

function Build-Tags {
    param(
        [string]$Type,
        [string]$Text,
        [hashtable]$Carrier
    )

    $tags = New-Object System.Collections.Generic.List[string]

    $mappedType = switch ($Type) {
        'operacja-surcharge' { 'operacja' }
        default { $Type }
    }
    $tags.Add("typ/$mappedType")

    if ($Carrier) { $tags.Add("armator/$($Carrier.key)") }

    if ($Text -match '(?i)\bseatrack\b') { $tags.Add('projekt/seatrack') }
    if ($Text -match '(?i)\bplaner\b') { $tags.Add('projekt/planer') }
    if ($Text -match '(?i)\bdashboard\b') { $tags.Add('projekt/dashboard') }

    if ($Text -match '(?i)\bhormuz\b|\bhormuz\b') { $tags.Add('temat/hormuz') }
    if ($Text -match '(?i)\bstawk\w*\b|\brate\w*\b') { $tags.Add('temat/stawki') }
    if ($Text -match '(?i)\bsurcharge\b|\bpsa notice\b') { $tags.Add('temat/surcharge') }
    if ($Text -match '(?i)\brail\b|\bkolej\b') { $tags.Add('temat/rail') }
    if ($Text -match '(?i)\bams\b') { $tags.Add('temat/ams') }

    return ($tags | Select-Object -Unique)
}

function Get-SubjectLine {
    param(
        [string[]]$Lines,
        [string]$Fallback
    )

    $nonEmpty = $Lines | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    if ($nonEmpty.Count -eq 0) { return $Fallback }

    $subject = $nonEmpty[0].Trim()
    if ($subject.Length -gt 90) { return $subject.Substring(0, 90) }
    return $subject
}

function Get-CleanContentLines {
    param([string[]]$Lines)

    $clean = New-Object System.Collections.Generic.List[string]
    $insideFrontmatter = $false
    $frontmatterClosed = $false

    foreach ($line in $Lines) {
        $trimmed = $line.TrimEnd()

        if (-not $frontmatterClosed -and $trimmed -eq '---') {
            $insideFrontmatter = -not $insideFrontmatter
            if (-not $insideFrontmatter) { $frontmatterClosed = $true }
            continue
        }

        if ($insideFrontmatter) { continue }
        if ([string]::IsNullOrWhiteSpace($trimmed)) { continue }
        if ($trimmed -match '^(?i)(from|to|cc|bcc|subject|date|sent|od|do|temat|data):') { continue }
        if ($trimmed -match '^(?i)(sent from my|wyslane z mojego)') { continue }

        $clean.Add($trimmed)
    }

    return $clean
}

function Get-SummaryBullets {
    param([string[]]$Lines)

    $bullets = New-Object System.Collections.Generic.List[string]

    foreach ($line in $Lines) {
        if ($bullets.Count -ge 8) { break }

        if ($line -match '^[#]{1,6}\s*(.+)$') {
            $heading = $Matches[1].Trim()
            if ($heading.Length -ge 8) { $bullets.Add("- $heading") }
            continue
        }

        if ($line -match '^[-*•]\s*(.+)$') { $bullets.Add("- $($Matches[1].Trim())"); continue }
        if ($line -match '^\d+[.)]\s*(.+)$') { $bullets.Add("- $($Matches[1].Trim())"); continue }
        if ($line.Length -lt 18) { continue }
        if ($line -match '^(?i)(pozdrawiam|best regards|regards|thanks|dzieki|kind regards|cheers)') { continue }
        if ($line -match '^https?://') { continue }

        $bullets.Add("- $line")
    }

    if ($bullets.Count -eq 0) { $bullets.Add('- Brak wyodrebnionych punktow') }
    return $bullets
}

function Get-ActionBullets {
    param([string[]]$Lines)

    $actions = New-Object System.Collections.Generic.List[string]

    foreach ($line in $Lines) {
        if ($actions.Count -ge 5) { break }

        if ($line -match '^(?i)(please|action required|to do|todo|confirm|reply|schedule|send|book|check|review|update|prepare|follow up|prosze|proszę|potwierd[źz]|odpowiedz|wyślij|wyslij|sprawdz|sprawdź|zaplanuj|zarezerwuj|przygotuj|uaktualnij)') {
            $actions.Add("- $line")
            continue
        }

        if ($line -match '^(?i).*\b(must|should|need to|required|required by)\b') {
            $actions.Add("- $line")
            continue
        }
    }

    return $actions
}

function Build-RelatedLinks {
    param(
        [string]$Type,
        [string]$Text,
        [hashtable]$Carrier
    )

    $links = New-Object System.Collections.Generic.List[string]

    if ($Carrier) {
        $links.Add("[[praca/armatorzy/$($Carrier.folder)]]")
    }

    if ($Text -match '(?i)\bhormuz\b') { $links.Add('[[temat/hormuz]]') }
    if ($Text -match '(?i)\bseatrack\b') { $links.Add('[[praca/ai-projekty/seatrack]]') }

    if ($Type -eq 'projekt') {
        $links.Add('[[praca/ai-projekty/MOC-projekty]]')
    } else {
        $links.Add('[[praca/armatorzy/MOC-armatorzy]]')
    }

    return ($links | Select-Object -Unique)
}

function Convert-HashtagToTag {
    param([string]$Hashtag)

    $slug = Get-Slug -Text $Hashtag
    if ([string]::IsNullOrWhiteSpace($slug)) { return $null }
    return "temat/$slug"
}

function Test-ReadyForDelete-FromString {
    param(
        [string]$NoteContent,
        [string[]]$RelatedLinks,
        [string]$ExpectedMoc
    )

    $content = $NoteContent
    if ($content -notmatch '(?ms)^---\s*\r?\n.*?\btyp:\s*.+\r?\n.*?\bdate:\s*\d{4}-\d{2}-\d{2}\r?\n.*?\bsource:\s*RAW\r?\n.*?\btags:\s*\[.+\]\r?\n.*?\bstatus:\s*(aktywny|zamkniety|czekam)\r?\n---') { return $false }

    if ($content -notmatch '(?m)^##\s+Kluczowe punkty\s*$') { return $false }
    if ($content -notmatch '(?m)^##\s+Wymagane dzialania\s*$') { return $false }
    if ($content -notmatch '(?m)^##\s+Powiazane notatki\s*$') { return $false }

    if ($RelatedLinks.Count -lt 1) { return $false }
    if ($content -notmatch [regex]::Escape($ExpectedMoc)) { return $false }

    return $true
}

# Dry-run execution for single file
$rawFile = 'Obsidian/Karol-KB/RAW/The Batch - Issue 349 (17 Apr 2026).md'
if (-not (Test-Path $rawFile)) { Write-Error "File not found: $rawFile"; exit 1 }

$lines = Get-Content -LiteralPath $rawFile -ErrorAction Stop
$fullText = ($lines -join "`n")
$cleanLines = Get-CleanContentLines -Lines $lines

$baseDir = 'Obsidian/Karol-KB'

$sourceDate = Get-DateFromText -FullText $fullText -FileName (Split-Path $rawFile -Leaf)
$carrier = Detect-Carrier -Text $fullText
$detectedType = Detect-Type -Text $fullText
$route = Get-Route -Type $detectedType -Text $fullText -BaseDir $baseDir -Carrier $carrier
$subject = Get-SubjectLine -Lines $cleanLines.ToArray() -Fallback (Split-Path $rawFile -Leaf)
$slug = Get-Slug -Text $subject
$targetFileName = "$sourceDate-$slug.md"
$targetPath = Join-Path $route $targetFileName

$frontType = if ($detectedType -eq 'operacja-surcharge') { 'operacja' } else { $detectedType }
$tags = Build-Tags -Type $detectedType -Text $fullText -Carrier $carrier
$tagsString = ($tags -join ', ')
$status = 'aktywny'

$sender = 'Brak nadawcy'
$firstLine = $cleanLines | Select-Object -First 1
if ($null -ne $firstLine) { $sender = $firstLine.Trim() }

$bodyLines = $cleanLines | Select-Object -Skip 1 -First 40
$bullets = Get-SummaryBullets -Lines $bodyLines
$actions = Get-ActionBullets -Lines $bodyLines
if ($actions.Count -eq 0) { $actions = @('- Brak na ten moment') }

$relatedLinks = Build-RelatedLinks -Type $frontType -Text $fullText -Carrier $carrier
$expectedMoc = if ($frontType -eq 'projekt') { '[[praca/ai-projekty/MOC-projekty]]' } else { '[[praca/armatorzy/MOC-armatorzy]]' }
$relatedText = ($relatedLinks | ForEach-Object { "- $_" }) -join "`n"
# hashtags -> tags
$hashtags = [regex]::Matches(($cleanLines -join "`n"), '(?<!\S)#([A-Za-z0-9_-]+)') | ForEach-Object { $_.Groups[1].Value.ToLower() } | Select-Object -Unique
foreach ($h in $hashtags) {
    $hashtagTag = Convert-HashtagToTag -Hashtag $h
    if ($null -ne $hashtagTag) { $tags += $hashtagTag }
    if ($h -eq 'ai' -or $h -eq 'ml' -or $h -eq 'thebatch') { $relatedLinks += "[[temat/$h]]" }
    if ($h -eq 'newsletter') { $tags += 'typ/newsletter' }
    if ($h -eq 'surcharge') { $tags += 'temat/surcharge' }
}

$sourceBlock = if ($Faithful) {
@"

## Oryginalna tresc
```text
$fullText
```
"@
} else {
    ""
}

$title = "# $subject"
$mailHint = if ($fullText -match '(?i)\bfrom\b|\bnadawca\b|\bsubject\b|\bmail\b') {
    "## Nadawca`n$sender`n"
} else {
    ""
}

$noteContent = @"
---
typ: $frontType
date: $sourceDate
source: RAW
tags: [$tagsString]
status: $status
---

$title

$mailHint## Kluczowe punkty
$($bullets -join "`n")

## Wymagane dzialania
$($actions -join "`n")

## Powiazane notatki
$relatedText
$sourceBlock
"@

$safeToDelete = Test-ReadyForDelete-FromString -NoteContent $noteContent -RelatedLinks $relatedLinks -ExpectedMoc $expectedMoc

$result = [PSCustomObject]@{
    Source = (Split-Path $rawFile -Leaf)
    TargetFileName = $targetFileName
    TargetPath = $targetPath
    Type = $frontType
    Tags = $tags
    RelatedLinks = $relatedLinks
    SafeToDelete = $safeToDelete
    NotePreview = $noteContent
}

$result | ConvertTo-Json -Depth 5
