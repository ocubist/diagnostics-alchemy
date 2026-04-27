$projectRoot = Get-Location

. "$projectRoot\scripts\helpers\Invoke-Script.ps1"
$distPath = "$projectRoot\dist"
$updateDependenciesPath = "$projectRoot\scripts\updateDependencies.ps1"


Invoke-Script -ScriptPath $updateDependenciesPath


# Remove the dist directory if it exists
if (Test-Path $distPath) {
    Remove-Item -Recurse -Force $distPath
}

# Run the TypeScript compiler
tsc
