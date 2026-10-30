# Downloads a portable copy of Node.js (LTS) into the project's .tools\node folder.
# No admin rights needed and nothing is installed system-wide.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$major = 'v24'
$root = Split-Path -Parent $PSScriptRoot
$tools = Join-Path $root '.tools'
$target = Join-Path $tools 'node'
$arch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }

Write-Host "  Finding the latest Node.js $major LTS..."
$all = Invoke-RestMethod 'https://nodejs.org/dist/index.json'
$version = @($all | ForEach-Object { $_ } | Where-Object { $_.lts -and $_.version -like "$major.*" })[0].version
if (-not $version) { throw "Could not find a Node.js $major LTS release." }

$name = "node-$version-win-$arch"
$zip = Join-Path $env:TEMP "$name.zip"
Write-Host "  Downloading Node.js $version ($arch), about 30 MB..."
Invoke-WebRequest "https://nodejs.org/dist/$version/$name.zip" -OutFile $zip -UseBasicParsing

Write-Host '  Verifying download...'
$sums = (Invoke-WebRequest "https://nodejs.org/dist/$version/SHASUMS256.txt" -UseBasicParsing).Content
if ($sums -is [byte[]]) { $sums = [Text.Encoding]::UTF8.GetString($sums) }
$line = ($sums -split "`n") | Where-Object { $_ -match "\s$([regex]::Escape("$name.zip"))\s*$" } | Select-Object -First 1
$expected = ($line -split '\s+')[0]
$fs = [IO.File]::OpenRead($zip)
try { $actual = -join ([Security.Cryptography.SHA256]::Create().ComputeHash($fs) | ForEach-Object { $_.ToString('x2') }) }
finally { $fs.Dispose() }
if (-not $expected -or $expected.ToLower() -ne $actual.ToLower()) {
  Remove-Item $zip -Force
  throw 'Downloaded file is corrupted (checksum mismatch). Please run again.'
}

Write-Host '  Extracting (this can take a minute)...'
New-Item -ItemType Directory -Force $tools | Out-Null
if (Test-Path $target) { Remove-Item $target -Recurse -Force }
$extractTo = Join-Path $tools '_extract'
if (Test-Path $extractTo) { Remove-Item $extractTo -Recurse -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[IO.Compression.ZipFile]::ExtractToDirectory($zip, $extractTo)
Move-Item (Join-Path $extractTo $name) $target
Remove-Item $extractTo -Recurse -Force
Remove-Item $zip -Force

Write-Host "  Node.js $version is ready."
