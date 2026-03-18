#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VERSION="0.0.1-alpha.0"
DEST="$SCRIPT_DIR/public/wasm/$VERSION"

echo "Building WASM bundle for Azora $VERSION..."
cd "$PROJECT_ROOT"
./gradlew :azora-sdk:script:wasmJsBrowserDistribution

SRC="$PROJECT_ROOT/azora-sdk/script/build/dist/wasmJs/productionExecutable"

if [ ! -d "$SRC" ]; then
    echo "ERROR: Build output not found at $SRC"
    exit 1
fi

echo "Copying WASM bundle to $DEST..."
mkdir -p "$DEST"
cp "$SRC"/* "$DEST"/

echo "WASM bundle built and copied successfully."
ls -la "$DEST"
