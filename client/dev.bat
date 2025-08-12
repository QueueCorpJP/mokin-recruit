@echo off
set NODE_OPTIONS=--max-old-space-size=4096 --no-compilation-cache --expose-gc
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_SWC_WASM_FALLBACK=1

echo Starting Mokin Recruit development server...
echo Node options: %NODE_OPTIONS%

next dev --hostname 0.0.0.0