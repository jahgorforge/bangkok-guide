---
name: powershell-user
description: User runs commands in Windows PowerShell, not bash
metadata:
  type: feedback
---

User is on Windows and runs commands in **PowerShell** (not Git Bash / WSL / Linux).

**Why:** Every time I give bash/Linux commands (`cd path/with/forward/slashes`, `cat file`, `export VAR=value`), they fail in PowerShell (`eval` not recognized, path separators wrong, `export` unknown).

**How to apply:** Always give PowerShell syntax:
- Paths: `C:\Users\...` or forward slashes `C:/Users/...`
- Change directory: `cd d:\wHome\...`  
- Read file: `cat C:\path\to\file` (PowerShell aliases `cat` to `Get-Content`)
- Set env: `$env:VAR_NAME="value"`
- `&&` chaining doesn't work in PS by default — use `;` between commands instead
- No `eval $(...)` — use `& "command"` instead
- SSH agent: use `Start-Service ssh-agent` or manual key path with `$env:GIT_SSH_COMMAND`
