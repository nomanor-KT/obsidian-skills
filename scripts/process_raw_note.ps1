$src = 'Obsidian/Karol-KB/RAW/The Batch - Issue 349 (17 Apr 2026).md'
if (-not (Test-Path $src)) { Write-Output (ConvertTo-Json @{ error = 'source missing'; source = $src }) ; exit 0 }
$raw = Get-Content -LiteralPath $src -Raw
# extract date from filename (look for (17 Apr 2026) or (17 Apr 2026))
$fn = (Split-Path $src -Leaf)
$dt = ''
$m = [regex]::Match($fn, '\((\d{1,2})\s+([A-Za-z]{3,}|[A-Za-z]+)\s+(20\d{2})\)')
if ($m.Success) {
    $day = [int]$m.Groups[1].Value
    $monStr = $m.Groups[2].Value.ToLower()
    $year = [int]$m.Groups[3].Value
    $months = @{ 'jan'=1;'feb'=2;'mar'=3;'apr'=4;'may'=5;'jun'=6;'jul'=7;'aug'=8;'sep'=9;'oct'=10;'nov'=11;'dec'=12; 'stycznia'=1; 'lutego'=2; 'marca'=3; 'kwietnia'=4; 'maja'=5; 'czerwca'=6; 'lipca'=7; 'sierpnia'=8; 'wrzesnia'=9; 'pazdziernika'=10; 'października'=10; 'listopada'=11; 'grudnia'=12 }
    if ($months.ContainsKey($monStr.Substring(0,3))) { $mnum = $months[$monStr.Substring(0,3)] } else { $mnum = $months[$monStr] 2>$null }
    if (-not $mnum) { $mnum = 4 }
    $dt = '{0:0000}-{1:00}-{2:00}' -f $year,$mnum,$day
}
if (-not $dt) { $iso = [regex]::Match($raw, '\b(20\d{2})-(\d{2})-(\d{2})\b'); if ($iso.Success) { $dt = $iso.Value } }
if (-not $dt) { $dt = (Get-Date).ToString('yyyy-MM-dd') }

# detect type heuristically
$type = 'notatka'
if ($raw -match '(?i)\bai\b|\bthe batch\b|\bdeeplearning.ai\b|\bnewsletter\b') { $type = 'projekt' }

# extract hashtags
$hashtags = [regex]::Matches($raw, '#([A-Za-z0-9_-]+)') | ForEach-Object { $_.Groups[1].Value.ToLower() } | Select-Object -Unique
$tags = @()
$tags += "typ/$type"
foreach ($h in $hashtags) {
    if ($h -eq 'ai' -or $h -eq 'thebatch') { $tags += "temat/$h" }
    if ($h -eq 'newsletter') { $tags += 'typ/newsletter' }
}
$tags = $tags | Select-Object -Unique

# choose route
$route = 'Obsidian/Karol-KB/ja'
if ($type -eq 'projekt') { $route = 'Obsidian/Karol-KB/praca/ai-projekty' }

# build slug from first header line
$firstLine = ($raw -split "`n" | Where-Object { $_.Trim() -ne '' } | Select-Object -First 1)
$subject = $firstLine -replace '^[#]+\s*','' -replace '[^\p{L}\p{Nd}\s-]','' -replace '\s+','-' ; $subject = $subject.ToLower()
if ($subject.Length -gt 70) { $subject = $subject.Substring(0,70) }
$slug = $subject -replace '--+','-'
$targetFile = "{0}-{1}.md" -f $dt, $slug
$targetPath = Join-Path $route $targetFile
# ensure unique
$i=1
while (Test-Path $targetPath) { $i++; $targetPath = Join-Path $route ("{0}-{1}-v{2}.md" -f $dt,$slug,$i) }
# build frontmatter
$tagsYaml = $tags -join ', '
$front = "---`ntyp: $type`ndate: $dt`nsource: RAW`ntags: [$tagsYaml]`nstatus: aktywny`n---`n`n"
$newContent = $front + $raw
# create target dir
if (-not (Test-Path $route)) { New-Item -ItemType Directory -Path $route -Force | Out-Null }
# write file
Set-Content -LiteralPath $targetPath -Value $newContent -Encoding UTF8
# remove source
Remove-Item -LiteralPath $src -Force
# output summary
$result = @{ source = $src; target = $targetPath; saved = $true; removed = $true; tags = $tags }
Write-Output (ConvertTo-Json $result -Depth 5)
