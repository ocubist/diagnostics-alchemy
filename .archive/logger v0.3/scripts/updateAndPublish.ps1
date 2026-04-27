param (
  [string]$version
)

$projectRoot = Get-Location
. "$projectRoot\scripts\helpers\Update-PatchVersion.ps1"
. "$projectRoot\scripts\helpers\Invoke-Script.ps1"

$packageJsonPath = "$projectRoot\package.json"
$packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
$buildPath = "$projectRoot\scripts\build.ps1"

# Check for version argument

if (-not $version) {
  Write-Host "Incrementing patch version in package.json..."
  $newVersion = Update-PatchVersion $packageJson.version
  $packageJson.version = $newVersion
  $packageJson | ConvertTo-Json -Depth 100 | Set-Content $packageJsonPath
  Write-Host "Updated version to $newVersion"
}
else {
  Write-Host "Setting version to $version"
  $packageJson.version = $version
  $packageJson | ConvertTo-Json -Depth 100 | Set-Content $packageJsonPath
}

# Build...
Invoke-Script -ScriptPath $buildPath

# Publish
npm publish --access public
if ($LASTEXITCODE -ne 0) {
  Write-Host "Publish failed. Exiting script."
  exit $LASTEXITCODE
}
