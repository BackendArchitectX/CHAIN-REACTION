#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
command -v node >/dev/null 2>&1 || { echo '[CHAIN//REACTION] Node.js 22 LTS is required.'; exit 1; }
command -v npm >/dev/null 2>&1 || { echo '[CHAIN//REACTION] npm is required.'; exit 1; }
exec npm start
