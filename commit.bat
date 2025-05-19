@echo off
setlocal

:: Solicita a mensagem do commit
set /p commitMsg=Digite a mensagem do commit: 

:: Executa os comandos do Git
git add .
git commit -m "%commitMsg%"
git push origin master

pause
