@ECHO OFF
CLS

CALL tns plugin remove nativescript-stringformat
CALL tns plugin add ..\plugin

CALL tns livesync --watch
