$projectRoot = Get-Location

$testPath = "$projectRoot/tests/test.ts"

$env:NODE_ENV = "development"

ts-node $testPath
