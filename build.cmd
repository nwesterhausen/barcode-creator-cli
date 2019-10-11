REM Copy executable dependencies to .\dist
robocopy .\node_modules\canvas\build\release\ .\dist
robocopy .\fonts .\dist\fonts
REM Build executable with pkg
pkg . -t latest-win-x64 -o ./dist/barcode-creator.exe