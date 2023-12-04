############################################################################################
#      NSIS Installation Script created by NSIS Quick Setup Script Generator v1.09.18
#               Entirely Edited with NullSoft Scriptable Installation System                
#              by Vlasis K. Barkas aka Red Wine red_wine@freemail.gr Sep 2006               
############################################################################################

!define APP_NAME "Tally Ninja"
!define COMP_NAME "Max Burgess"
!define WEB_SITE "https://maxstuff.net/tally-ninja"
!define VERSION "00.00.00.00"
!define COPYRIGHT "Max Burgess © 2023"
!define DESCRIPTION "Application"
!define LICENSE_TXT "LICENSE.md"
!define INSTALLER_NAME "TallyNinjaSetup.exe"
!define MAIN_APP_EXE "editor.exe"
!define INSTALL_TYPE "SetShellVarContext all"
!define REG_ROOT "HKLM"
!define REG_APP_PATH "Software\Microsoft\Windows\CurrentVersion\App Paths\${MAIN_APP_EXE}"
!define UNINSTALL_PATH "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"

!define REG_START_MENU "Start Menu Folder"

var SM_Folder

######################################################################

VIProductVersion  "${VERSION}"
VIAddVersionKey "ProductName"  "${APP_NAME}"
VIAddVersionKey "CompanyName"  "${COMP_NAME}"
VIAddVersionKey "LegalCopyright"  "${COPYRIGHT}"
VIAddVersionKey "FileDescription"  "${DESCRIPTION}"
VIAddVersionKey "FileVersion"  "${VERSION}"

######################################################################

SetCompressor LZMA
Name "${APP_NAME}"
Caption "${APP_NAME}"
OutFile "${INSTALLER_NAME}"
BrandingText "${APP_NAME}"
XPStyle on
InstallDirRegKey "${REG_ROOT}" "${REG_APP_PATH}" ""
InstallDir "$PROGRAMFILES\Tally Ninja"

######################################################################

!include "MUI.nsh"

!define MUI_ABORTWARNING
!define MUI_UNABORTWARNING

!insertmacro MUI_PAGE_WELCOME

!ifdef LICENSE_TXT
    !insertmacro MUI_PAGE_LICENSE "${LICENSE_TXT}"
!endif

!ifdef REG_START_MENU
    !define MUI_STARTMENUPAGE_DEFAULTFOLDER "Tally Ninja"
    !define MUI_STARTMENUPAGE_REGISTRY_ROOT "${REG_ROOT}"
    !define MUI_STARTMENUPAGE_REGISTRY_KEY "${UNINSTALL_PATH}"
    !define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "${REG_START_MENU}"
    !insertmacro MUI_PAGE_STARTMENU Application $SM_Folder
!endif

!insertmacro MUI_PAGE_INSTFILES

!define MUI_FINISHPAGE_RUN "$INSTDIR\${MAIN_APP_EXE}"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM

!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

######################################################################

Section -MainProgram
    ${INSTALL_TYPE}
    SetOverwrite ifnewer
    SetOutPath "$INSTDIR"
    File /r "build\staging_main\*"
SectionEnd

######################################################################

Section -Icons_Reg
    SetOutPath "$INSTDIR"
    WriteUninstaller "$INSTDIR\uninstall.exe"

    !ifdef REG_START_MENU
        !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
        CreateDirectory "$SMPROGRAMS\$SM_Folder"
        CreateShortCut "$SMPROGRAMS\$SM_Folder\${APP_NAME}.lnk" "$INSTDIR\${MAIN_APP_EXE}"
        CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${MAIN_APP_EXE}"
        CreateShortCut "$SMPROGRAMS\$SM_Folder\Uninstall ${APP_NAME}.lnk" "$INSTDIR\uninstall.exe"

        !ifdef WEB_SITE
            WriteIniStr "$INSTDIR\${APP_NAME} website.url" "InternetShortcut" "URL" "${WEB_SITE}"
            CreateShortCut "$SMPROGRAMS\$SM_Folder\${APP_NAME} Website.lnk" "$INSTDIR\${APP_NAME} website.url"
        !endif
        !insertmacro MUI_STARTMENU_WRITE_END
    !endif

    !ifndef REG_START_MENU
        CreateDirectory "$SMPROGRAMS\Tally Ninja"
        CreateShortCut "$SMPROGRAMS\Tally Ninja\${APP_NAME}.lnk" "$INSTDIR\${MAIN_APP_EXE}"
        CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${MAIN_APP_EXE}"
        CreateShortCut "$SMPROGRAMS\Tally Ninja\Uninstall ${APP_NAME}.lnk" "$INSTDIR\uninstall.exe"

        !ifdef WEB_SITE
            WriteIniStr "$INSTDIR\${APP_NAME} website.url" "InternetShortcut" "URL" "${WEB_SITE}"
            CreateShortCut "$SMPROGRAMS\Tally Ninja\${APP_NAME} Website.lnk" "$INSTDIR\${APP_NAME} website.url"
        !endif
    !endif

    WriteRegStr ${REG_ROOT} "${REG_APP_PATH}" "" "$INSTDIR\${MAIN_APP_EXE}"
    WriteRegStr ${REG_ROOT} "${UNINSTALL_PATH}"  "DisplayName" "${APP_NAME}"
    WriteRegStr ${REG_ROOT} "${UNINSTALL_PATH}"  "UninstallString" "$INSTDIR\uninstall.exe"
    WriteRegStr ${REG_ROOT} "${UNINSTALL_PATH}"  "DisplayIcon" "$INSTDIR\${MAIN_APP_EXE}"
    WriteRegStr ${REG_ROOT} "${UNINSTALL_PATH}"  "DisplayVersion" "${VERSION}"
    WriteRegStr ${REG_ROOT} "${UNINSTALL_PATH}"  "Publisher" "${COMP_NAME}"

    !ifdef WEB_SITE
        WriteRegStr ${REG_ROOT} "${UNINSTALL_PATH}"  "URLInfoAbout" "${WEB_SITE}"
    !endif
SectionEnd

######################################################################

Section Uninstall
    ${INSTALL_TYPE}
    ; Delete "$INSTDIR\editor.exe"
    ; Delete "$INSTDIR\editor.py"
    ; Delete "$INSTDIR\raceml.py"
    
    
    ; Delete "$INSTDIR\uninstall.exe"
    ; !ifdef WEB_SITE
    ;     Delete "$INSTDIR\${APP_NAME} website.url"
    ; !endif

    RmDir "$INSTDIR"

    !ifdef REG_START_MENU
        !insertmacro MUI_STARTMENU_GETFOLDER "Application" $SM_Folder
        Delete "$SMPROGRAMS\$SM_Folder\${APP_NAME}.lnk"
        Delete "$SMPROGRAMS\$SM_Folder\Uninstall ${APP_NAME}.lnk"
        !ifdef WEB_SITE
            Delete "$SMPROGRAMS\$SM_Folder\${APP_NAME} Website.lnk"
        !endif
        Delete "$DESKTOP\${APP_NAME}.lnk"

        RmDir "$SMPROGRAMS\$SM_Folder"
    !endif

    !ifndef REG_START_MENU
        Delete "$SMPROGRAMS\Tally Ninja\${APP_NAME}.lnk"
        Delete "$SMPROGRAMS\Tally Ninja\Uninstall ${APP_NAME}.lnk"
        !ifdef WEB_SITE
            Delete "$SMPROGRAMS\Tally Ninja\${APP_NAME} Website.lnk"
        !endif
        Delete "$DESKTOP\${APP_NAME}.lnk"

        RmDir "$SMPROGRAMS\Tally Ninja"
    !endif

    DeleteRegKey ${REG_ROOT} "${REG_APP_PATH}"
    DeleteRegKey ${REG_ROOT} "${UNINSTALL_PATH}"
SectionEnd

######################################################################

