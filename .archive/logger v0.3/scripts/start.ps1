$projectRoot = Get-Location

. "$projectRoot\scripts\helpers\Invoke-Script.ps1"
$buildPath = "$projectRoot\scripts\build.ps1"
$distIndexPath = "$projectRoot\dist\index.js"

# Run build.ps1
Invoke-Script -ScriptPath $buildPath

# Run @/dist/index.js
node $distIndexPath
