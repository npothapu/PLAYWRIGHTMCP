param(
  [int]$Users = 10,
  [int]$RampUp = 1,
  [int]$Loops = 1,
  [ValidateSet('dev','qa','prod')]
  [string]$Env = 'qa'
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$ComposeDir = Join-Path $RepoRoot 'perf/docker'
$ResultsDir = Join-Path $RepoRoot 'perf/jmeter/results'
$ReportsDir = Join-Path $RepoRoot 'perf/jmeter/reports'

if (-not (Test-Path $ResultsDir)) { New-Item -ItemType Directory -Path $ResultsDir | Out-Null }
if (-not (Test-Path $ReportsDir)) { New-Item -ItemType Directory -Path $ReportsDir | Out-Null }

function Test-DockerInstalled {
  $docker = Get-Command docker -ErrorAction SilentlyContinue
  if (-not $docker) { Write-Error "Docker is required. Install Docker Desktop and ensure it's on PATH."; exit 1 }
}

Test-DockerInstalled

Push-Location $ComposeDir
try {
  docker compose build jmeter
  if ($LASTEXITCODE -ne 0) { throw "docker compose build failed" }

  $composeArgs = @(
    'run','--rm','jmeter',
    '-n','-t',"/tests/google-loadtest.jmx",
    '-l','/tests/results/results.jtl',
    '-e','-o','/tests/reports/html-report',
    '-q',"/tests/env/$Env.properties",
    "-Jusers=$Users","-JrampUp=$RampUp","-Jloops=$Loops"
  )
  docker compose @composeArgs
  if ($LASTEXITCODE -ne 0) { throw "docker compose run failed" }
} finally {
  Pop-Location
}

Write-Host "Report: $ReportsDir/html-report/index.html"
