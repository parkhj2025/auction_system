#!/bin/bash
cd "$(dirname "$0")/.."
node --env-file=.env.local scripts/crawler/index.mjs --court incheon --days 14
read -p "종료하려면 Enter..."
