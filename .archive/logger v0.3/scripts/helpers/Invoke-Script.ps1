function Invoke-Script {
  param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptPath
  )

  & $ScriptPath
  if ($LASTEXITCODE -ne 0) {
    Write-Host "$ScriptPath failed with exit code $LASTEXITCODE. Exiting script."
    exit $LASTEXITCODE
  }
}
