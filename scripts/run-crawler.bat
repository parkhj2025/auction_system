@echo off
chcp 65001 > nul
cd /d "%~dp0\.."
node --env-file=.env.local scripts/crawler/index.mjs --court incheon --days 14
pause
