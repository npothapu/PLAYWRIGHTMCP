param(
  [int]$Users = 10,
  [int]$RampUp = 1,
  [int]$Loops = 1,
  [ValidateSet('dev','qa','prod')]
  [string]$Env = 'qa'
)

$ErrorActionPreference = 'Stop'

# PRODUCTION PROTECTION: Prevent JMeter load tests from running against production
if ($Env -eq 'prod') {
  Write-Host "❌ PRODUCTION PROTECTION ENABLED" -ForegroundColor Red
  Write-Host ""
  Write-Host "JMeter load testing is DISABLED for production environment to prevent:" -ForegroundColor Yellow
  Write-Host "  • Unintended load on production systems" -ForegroundColor Yellow
  Write-Host "  • Performance degradation for real users" -ForegroundColor Yellow
  Write-Host "  • Potential service disruption" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "✅ Available environments for load testing:" -ForegroundColor Green
  Write-Host "  • dev  - Development environment (VML)" -ForegroundColor Green
  Write-Host "  • qa   - QA environment (Google)" -ForegroundColor Green
  Write-Host ""
  Write-Host "To run load tests, use:" -ForegroundColor Cyan
  Write-Host "  .\scripts\run-jmeter-docker.ps1 -Env qa" -ForegroundColor Cyan
  Write-Host "  .\scripts\run-jmeter-docker.ps1 -Env dev" -ForegroundColor Cyan
  Write-Host ""
  exit 1
}

$RepoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RepoRoot

Write-Host "🚀 JMeter API Load Test Configuration:" -ForegroundColor Cyan
Write-Host "  • Environment: $Env" -ForegroundColor White
Write-Host "  • API Endpoint: https://reqres.in/api/users?page=2" -ForegroundColor White
Write-Host "  • Users: $Users" -ForegroundColor White
Write-Host "  • RampUp: $RampUp seconds" -ForegroundColor White
Write-Host "  • Loops: $Loops" -ForegroundColor White
Write-Host ""

# Helpful status about report locations (legacy vs active)
$legacyReport = Join-Path $RepoRoot 'jmeter/results/html-report/index.html'
$activeReport = Join-Path $RepoRoot 'perf/jmeter/reports/html-report/index.html'
if (Test-Path $legacyReport) {
  $lt = (Get-Item $legacyReport).LastWriteTime
  Write-Host "Legacy report detected: $legacyReport (LastWriteTime: $lt)"
}
if (Test-Path $activeReport) {
  $at = (Get-Item $activeReport).LastWriteTime
  Write-Host "Active report (perf) detected: $activeReport (LastWriteTime: $at)"
}

function Test-DockerAvailable {
  # Try to find docker in PATH first
  $docker = Get-Command docker -ErrorAction SilentlyContinue
  if (-not $docker) {
    # Try common Docker Desktop install path and add to PATH for this session
    $dockerBinDir = "C:\Program Files\Docker\Docker\resources\bin"
    $dockerExe = Join-Path $dockerBinDir 'docker.exe'
    if (Test-Path $dockerExe) {
      if (-not ($env:PATH -split ';' | Where-Object { $_ -eq $dockerBinDir })) {
        $env:PATH = "$env:PATH;$dockerBinDir"
      }
      $docker = Get-Command docker -ErrorAction SilentlyContinue
    }
  }

  if (-not $docker) {
    Write-Host "Docker CLI not found on PATH. Attempting to start Docker Desktop if installed..."
  }

  # Try to start Docker Desktop if present and not running
  $dockerDesktopExe = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dockerDesktopExe) {
    try {
      # Check if engine is responding; if not, start Desktop and wait
      & docker info *> $null
      $engineUp = ($LASTEXITCODE -eq 0)
      if (-not $engineUp) {
        Write-Host "Starting Docker Desktop..."
        Start-Process -FilePath $dockerDesktopExe | Out-Null
        $maxWait = 120
        $elapsed = 0
        while ($elapsed -lt $maxWait) {
          Start-Sleep -Seconds 5
          & docker info *> $null
          if ($LASTEXITCODE -eq 0) { break }
          $elapsed += 5
        }
      }
    } catch {
      # Ignore start errors; will fall through to final check
    }
  }

  # Final availability check
  & docker version *> $null
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker is required. Please install and start Docker Desktop, then ensure 'docker' is on PATH."
    exit 1
  }
}

Test-DockerAvailable

$resultsDir = Join-Path $RepoRoot 'perf/jmeter/results'
if (-not (Test-Path $resultsDir)) { New-Item -ItemType Directory -Path $resultsDir | Out-Null }
$reportsDir = Join-Path $RepoRoot 'perf/jmeter/reports'
if (-not (Test-Path $reportsDir)) { New-Item -ItemType Directory -Path $reportsDir | Out-Null }

# Build image (once) and run test with parameters
$composeFile = Join-Path $RepoRoot 'perf/docker/docker-compose.yml'
$cmd = @(
  'compose','-f', $composeFile, 'run','--rm','jmeter',
  '-n','-t','/tests/google-loadtest.jmx',
  '-l','/tests/results/results.jtl',
  '-e','-o','/tests/reports/html-report',
  '-q',"/tests/env/$Env.properties",
  "-Jusers=$Users",
  "-JrampUp=$RampUp",
  "-Jloops=$Loops"
)

# Build
& docker compose -f $composeFile build jmeter
if ($LASTEXITCODE -ne 0) { Write-Error "Docker build failed"; exit 1 }

# Run
& docker @cmd
if ($LASTEXITCODE -ne 0) { Write-Error "JMeter docker run failed"; exit 1 }

$outReport = Join-Path $reportsDir 'html-report/index.html'
if (Test-Path $outReport) {
  $ot = (Get-Item $outReport).LastWriteTime
  Write-Host "HTML report generated at: $outReport (LastWriteTime: $ot)"
} else {
  Write-Warning "Expected HTML report not found at $outReport"
}
