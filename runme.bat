@echo off
setlocal

set "nodeExecutable=node.exe"
set "nodeVersion=14.17.0"  REM Specify the version of Node.js you want to install

REM Check if Node.js is already installed
where /q %nodeExecutable%
if %errorlevel% equ 0 (
    echo Node.js is already installed.
    echo Running runme.js...
    npm init -y
    npm i axios
    node runme.js
) else (
    echo Node.js is not installed. Installing Node.js...

    REM Check if NVM is already installed
    where /q nvm
    if %errorlevel% equ 0 (
        echo NVM is already installed.
    ) else (
        echo Installing NVM...
        powershell -command "iex (iwr https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.ps1)"
        echo NVM installed.
    )

    REM Use NVM to install Node.js
    echo Installing Node.js using NVM...
    call nvm install %nodeVersion%
    call nvm use %nodeVersion%
    echo Node.js installed.

    echo Running runme.js...
    node runme.js
)

endlocal
