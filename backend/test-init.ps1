# ================================================================
# 백엔드 프로젝트 초기화 테스트 스크립트 (PowerShell)
# 목적: Issue #6 백엔드 초기화 작업의 완료 여부를 검증
# 실행: .\backend\test-init.ps1
# ================================================================

# 색상 설정
$SuccessColor = "Green"
$FailColor = "Red"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

# 테스트 결과 변수
$TotalTests = 0
$PassedTests = 0
$FailedTests = 0

# 헤더 출력
Write-Host ""
Write-Host "================================================================" -ForegroundColor $InfoColor
Write-Host "  백엔드 프로젝트 초기화 테스트 시작" -ForegroundColor $InfoColor
Write-Host "================================================================" -ForegroundColor $InfoColor
Write-Host ""

# 테스트 함수
function Test-Condition {
    param(
        [string]$TestName,
        [bool]$Condition,
        [string]$ErrorMessage = ""
    )

    $script:TotalTests++

    if ($Condition) {
        Write-Host "[PASS] $TestName" -ForegroundColor $SuccessColor
        $script:PassedTests++
        return $true
    } else {
        Write-Host "[FAIL] $TestName" -ForegroundColor $FailColor
        if ($ErrorMessage) {
            Write-Host "       → $ErrorMessage" -ForegroundColor $WarningColor
        }
        $script:FailedTests++
        return $false
    }
}

# 작업 디렉토리 설정
$BackendDir = Join-Path $PSScriptRoot ""
$ProjectRoot = Split-Path -Parent $BackendDir

Write-Host "테스트 대상 디렉토리: $BackendDir" -ForegroundColor $InfoColor
Write-Host ""

# ================================================================
# 테스트 1: backend 디렉토리 존재 확인
# ================================================================
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 1: 디렉토리 구조 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$backendExists = Test-Path $BackendDir
Test-Condition -TestName "1.1 backend 디렉토리 존재 확인" -Condition $backendExists -ErrorMessage "backend 디렉토리가 존재하지 않습니다."

# ================================================================
# 테스트 2: package.json 파일 존재 및 내용 검증
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 2: package.json 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$packageJsonPath = Join-Path $BackendDir "package.json"
$packageJsonExists = Test-Path $packageJsonPath

if (Test-Condition -TestName "2.1 package.json 파일 존재 확인" -Condition $packageJsonExists -ErrorMessage "package.json 파일이 존재하지 않습니다.") {
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

        # name 필드 확인
        $hasName = $null -ne $packageJson.name
        Test-Condition -TestName "2.2 package.json - name 필드 존재" -Condition $hasName -ErrorMessage "name 필드가 없습니다."

        # version 필드 확인
        $hasVersion = $null -ne $packageJson.version
        Test-Condition -TestName "2.3 package.json - version 필드 존재" -Condition $hasVersion -ErrorMessage "version 필드가 없습니다."

        # main 필드 확인
        $hasMain = $null -ne $packageJson.main
        Test-Condition -TestName "2.4 package.json - main 필드 존재" -Condition $hasMain -ErrorMessage "main 필드가 없습니다."

        # scripts 필드 확인
        $hasScripts = $null -ne $packageJson.scripts
        Test-Condition -TestName "2.5 package.json - scripts 필드 존재" -Condition $hasScripts -ErrorMessage "scripts 필드가 없습니다."

        if ($hasScripts) {
            # dev 스크립트 확인
            $hasDevScript = $null -ne $packageJson.scripts.dev
            Test-Condition -TestName "2.6 package.json - dev 스크립트 존재" -Condition $hasDevScript -ErrorMessage "dev 스크립트가 없습니다."

            # start 스크립트 확인
            $hasStartScript = $null -ne $packageJson.scripts.start
            Test-Condition -TestName "2.7 package.json - start 스크립트 존재" -Condition $hasStartScript -ErrorMessage "start 스크립트가 없습니다."
        } else {
            Test-Condition -TestName "2.6 package.json - dev 스크립트 존재" -Condition $false -ErrorMessage "scripts 필드가 없어 확인 불가"
            Test-Condition -TestName "2.7 package.json - start 스크립트 존재" -Condition $false -ErrorMessage "scripts 필드가 없어 확인 불가"
        }

    } catch {
        Test-Condition -TestName "2.2 package.json - name 필드 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        Test-Condition -TestName "2.3 package.json - version 필드 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        Test-Condition -TestName "2.4 package.json - main 필드 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        Test-Condition -TestName "2.5 package.json - scripts 필드 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        Test-Condition -TestName "2.6 package.json - dev 스크립트 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        Test-Condition -TestName "2.7 package.json - start 스크립트 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
    }
} else {
    Test-Condition -TestName "2.2 package.json - name 필드 존재" -Condition $false -ErrorMessage "package.json 없음"
    Test-Condition -TestName "2.3 package.json - version 필드 존재" -Condition $false -ErrorMessage "package.json 없음"
    Test-Condition -TestName "2.4 package.json - main 필드 존재" -Condition $false -ErrorMessage "package.json 없음"
    Test-Condition -TestName "2.5 package.json - scripts 필드 존재" -Condition $false -ErrorMessage "package.json 없음"
    Test-Condition -TestName "2.6 package.json - dev 스크립트 존재" -Condition $false -ErrorMessage "package.json 없음"
    Test-Condition -TestName "2.7 package.json - start 스크립트 존재" -Condition $false -ErrorMessage "package.json 없음"
}

# ================================================================
# 테스트 3: 필수 dependencies 10개 설치 확인
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 3: 필수 dependencies 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$requiredDependencies = @(
    "express",
    "pg",
    "jsonwebtoken",
    "bcrypt",
    "express-validator",
    "cors",
    "helmet",
    "express-rate-limit",
    "dotenv"
)

if ($packageJsonExists) {
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        $hasDependencies = $null -ne $packageJson.dependencies

        Test-Condition -TestName "3.1 dependencies 필드 존재" -Condition $hasDependencies -ErrorMessage "dependencies 필드가 없습니다."

        if ($hasDependencies) {
            $testNumber = 2
            foreach ($dep in $requiredDependencies) {
                $depExists = $packageJson.dependencies.PSObject.Properties.Name -contains $dep
                Test-Condition -TestName "3.$testNumber dependencies - $dep 존재" -Condition $depExists -ErrorMessage "$dep 패키지가 dependencies에 없습니다."
                $testNumber++
            }
        } else {
            $testNumber = 2
            foreach ($dep in $requiredDependencies) {
                Test-Condition -TestName "3.$testNumber dependencies - $dep 존재" -Condition $false -ErrorMessage "dependencies 필드가 없습니다."
                $testNumber++
            }
        }
    } catch {
        Test-Condition -TestName "3.1 dependencies 필드 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        $testNumber = 2
        foreach ($dep in $requiredDependencies) {
            Test-Condition -TestName "3.$testNumber dependencies - $dep 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
            $testNumber++
        }
    }
} else {
    Test-Condition -TestName "3.1 dependencies 필드 존재" -Condition $false -ErrorMessage "package.json 없음"
    $testNumber = 2
    foreach ($dep in $requiredDependencies) {
        Test-Condition -TestName "3.$testNumber dependencies - $dep 존재" -Condition $false -ErrorMessage "package.json 없음"
        $testNumber++
    }
}

# ================================================================
# 테스트 4: 개발 devDependencies 확인
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 4: devDependencies 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

if ($packageJsonExists) {
    try {
        $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        $hasDevDependencies = $null -ne $packageJson.devDependencies

        Test-Condition -TestName "4.1 devDependencies 필드 존재" -Condition $hasDevDependencies -ErrorMessage "devDependencies 필드가 없습니다."

        if ($hasDevDependencies) {
            $nodemonExists = $packageJson.devDependencies.PSObject.Properties.Name -contains "nodemon"
            Test-Condition -TestName "4.2 devDependencies - nodemon 존재" -Condition $nodemonExists -ErrorMessage "nodemon이 devDependencies에 없습니다."
        } else {
            Test-Condition -TestName "4.2 devDependencies - nodemon 존재" -Condition $false -ErrorMessage "devDependencies 필드가 없습니다."
        }
    } catch {
        Test-Condition -TestName "4.1 devDependencies 필드 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
        Test-Condition -TestName "4.2 devDependencies - nodemon 존재" -Condition $false -ErrorMessage "JSON 파싱 오류"
    }
} else {
    Test-Condition -TestName "4.1 devDependencies 필드 존재" -Condition $false -ErrorMessage "package.json 없음"
    Test-Condition -TestName "4.2 devDependencies - nodemon 존재" -Condition $false -ErrorMessage "package.json 없음"
}

# ================================================================
# 테스트 5: .env 파일 존재 및 필수 환경 변수 확인
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 5: .env 파일 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$envPath = Join-Path $BackendDir ".env"
$envExists = Test-Path $envPath

if (Test-Condition -TestName "5.1 .env 파일 존재 확인" -Condition $envExists -ErrorMessage ".env 파일이 존재하지 않습니다.") {
    try {
        $envContent = Get-Content $envPath -Raw

        # 필수 환경 변수 목록
        $requiredEnvVars = @(
            "DATABASE_URL",
            "JWT_SECRET",
            "JWT_ACCESS_EXPIRATION",
            "JWT_REFRESH_EXPIRATION",
            "PORT",
            "NODE_ENV"
        )

        $testNumber = 2
        foreach ($envVar in $requiredEnvVars) {
            $envVarExists = $envContent -match "^\s*$envVar\s*="
            Test-Condition -TestName "5.$testNumber .env - $envVar 존재" -Condition $envVarExists -ErrorMessage "$envVar 환경 변수가 없습니다."
            $testNumber++
        }

        # JWT_SECRET 길이 검증 (최소 32자)
        if ($envContent -match "JWT_SECRET\s*=\s*(.+)") {
            $jwtSecret = $matches[1].Trim()
            $jwtSecretLength = $jwtSecret.Length
            $jwtSecretValid = $jwtSecretLength -ge 32
            Test-Condition -TestName "5.$testNumber .env - JWT_SECRET 길이 검증 (최소 32자)" -Condition $jwtSecretValid -ErrorMessage "JWT_SECRET 길이가 $jwtSecretLength 자입니다. 최소 32자 이상이어야 합니다."
        } else {
            Test-Condition -TestName "5.$testNumber .env - JWT_SECRET 길이 검증 (최소 32자)" -Condition $false -ErrorMessage "JWT_SECRET을 찾을 수 없습니다."
        }

    } catch {
        $testNumber = 2
        foreach ($envVar in @("DATABASE_URL", "JWT_SECRET", "JWT_ACCESS_EXPIRATION", "JWT_REFRESH_EXPIRATION", "PORT", "NODE_ENV")) {
            Test-Condition -TestName "5.$testNumber .env - $envVar 존재" -Condition $false -ErrorMessage "파일 읽기 오류"
            $testNumber++
        }
        Test-Condition -TestName "5.$testNumber .env - JWT_SECRET 길이 검증 (최소 32자)" -Condition $false -ErrorMessage "파일 읽기 오류"
    }
} else {
    $testNumber = 2
    foreach ($envVar in @("DATABASE_URL", "JWT_SECRET", "JWT_ACCESS_EXPIRATION", "JWT_REFRESH_EXPIRATION", "PORT", "NODE_ENV")) {
        Test-Condition -TestName "5.$testNumber .env - $envVar 존재" -Condition $false -ErrorMessage ".env 파일 없음"
        $testNumber++
    }
    Test-Condition -TestName "5.$testNumber .env - JWT_SECRET 길이 검증 (최소 32자)" -Condition $false -ErrorMessage ".env 파일 없음"
}

# ================================================================
# 테스트 6: .env.example 파일 존재 확인
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 6: .env.example 파일 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$envExamplePath = Join-Path $BackendDir ".env.example"
$envExampleExists = Test-Path $envExamplePath

Test-Condition -TestName "6.1 .env.example 파일 존재 확인" -Condition $envExampleExists -ErrorMessage ".env.example 파일이 존재하지 않습니다."

# ================================================================
# 테스트 7: node_modules 디렉토리 존재 확인
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 7: node_modules 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$nodeModulesPath = Join-Path $BackendDir "node_modules"
$nodeModulesExists = Test-Path $nodeModulesPath

Test-Condition -TestName "7.1 node_modules 디렉토리 존재 확인" -Condition $nodeModulesExists -ErrorMessage "node_modules 디렉토리가 존재하지 않습니다. npm install을 실행하세요."

# ================================================================
# 테스트 8: .gitignore 설정 확인
# ================================================================
Write-Host ""
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor
Write-Host "테스트 그룹 8: .gitignore 검증" -ForegroundColor $InfoColor
Write-Host "─────────────────────────────────────────────────────────────" -ForegroundColor $InfoColor

$gitignorePath = Join-Path $ProjectRoot ".gitignore"
$gitignoreExists = Test-Path $gitignorePath

if (Test-Condition -TestName "8.1 .gitignore 파일 존재 확인" -Condition $gitignoreExists -ErrorMessage ".gitignore 파일이 존재하지 않습니다.") {
    try {
        $gitignoreContent = Get-Content $gitignorePath -Raw

        # node_modules 확인
        $hasNodeModules = $gitignoreContent -match "node_modules"
        Test-Condition -TestName "8.2 .gitignore - node_modules 포함" -Condition $hasNodeModules -ErrorMessage "node_modules가 .gitignore에 없습니다."

        # .env 확인
        $hasEnv = $gitignoreContent -match "\.env"
        Test-Condition -TestName "8.3 .gitignore - .env 포함" -Condition $hasEnv -ErrorMessage ".env가 .gitignore에 없습니다."

    } catch {
        Test-Condition -TestName "8.2 .gitignore - node_modules 포함" -Condition $false -ErrorMessage "파일 읽기 오류"
        Test-Condition -TestName "8.3 .gitignore - .env 포함" -Condition $false -ErrorMessage "파일 읽기 오류"
    }
} else {
    Test-Condition -TestName "8.2 .gitignore - node_modules 포함" -Condition $false -ErrorMessage ".gitignore 파일 없음"
    Test-Condition -TestName "8.3 .gitignore - .env 포함" -Condition $false -ErrorMessage ".gitignore 파일 없음"
}

# ================================================================
# 테스트 결과 요약
# ================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor $InfoColor
Write-Host "  테스트 결과 요약" -ForegroundColor $InfoColor
Write-Host "================================================================" -ForegroundColor $InfoColor
Write-Host ""

$SuccessRate = if ($TotalTests -gt 0) { [math]::Round(($PassedTests / $TotalTests) * 100, 2) } else { 0 }

Write-Host "총 테스트: $TotalTests" -ForegroundColor $InfoColor
Write-Host "통과: $PassedTests" -ForegroundColor $SuccessColor
Write-Host "실패: $FailedTests" -ForegroundColor $FailColor
Write-Host "통과율: $SuccessRate%" -ForegroundColor $(if ($SuccessRate -ge 80) { $SuccessColor } elseif ($SuccessRate -ge 50) { $WarningColor } else { $FailColor })
Write-Host ""

if ($SuccessRate -ge 80) {
    $successMsg = "[SUCCESS] 테스트 통과! 백엔드 초기화가 성공적으로 완료되었습니다."
    Write-Host $successMsg -ForegroundColor $SuccessColor
    exit 0
} else {
    $failMsg1 = "[FAILED] 테스트 실패. 백엔드 초기화를 완료하지 못했습니다."
    $failMsg2 = "        위의 실패한 테스트를 확인하고 수정해주세요."
    Write-Host $failMsg1 -ForegroundColor $FailColor
    Write-Host $failMsg2 -ForegroundColor $WarningColor
    exit 1
}
