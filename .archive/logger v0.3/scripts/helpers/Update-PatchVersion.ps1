function Update-PatchVersion($version) {
  $versionParts = $version.Split('.')
  $versionParts[2] = [int]$versionParts[2] + 1
  return $versionParts -join '.'
}