#!/usr/bin/env bash
export NODE_ENV=production
export CONFIG_FILE=test-run.json
node main.mjs --generate --config "$CONFIG_FILE"
