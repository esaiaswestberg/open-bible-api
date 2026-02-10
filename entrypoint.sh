#!/bin/bash
set -e

# Default values
TRANSLATIONS_PATH=${TRANSLATIONS_PATH:-./translations}
GH_REPO=${GH_REPO:-esaiaswestberg/open-bible-api}
VERSION=${VERSION:-latest}

# Ensure the parent directory of TRANSLATIONS_PATH exists
mkdir -p "$(dirname "$TRANSLATIONS_PATH")"

# Check if the translations directory is empty or doesn't exist
if [ ! -d "$TRANSLATIONS_PATH" ] || [ -z "$(ls -A "$TRANSLATIONS_PATH")" ]; then
    echo "Translations not found in $TRANSLATIONS_PATH. Downloading..."
    
    if [ "$VERSION" = "latest" ]; then
        URL="https://github.com/${GH_REPO}/releases/latest/download/translations.7z"
    else
        URL="https://github.com/${GH_REPO}/releases/download/${VERSION}/translations.7z"
    fi

    echo "Downloading from $URL..."
    # -L to follow redirects, -f to fail on 404
    if curl -sLf "$URL" -o translations.7z; then
        echo "Extracting translations..."
        # Create a temp directory for extraction
        mkdir -p ./temp_translations
        7z x translations.7z -o./temp_translations -y > /dev/null
        
        # Move the contents of the 'translations' folder from the archive to TRANSLATIONS_PATH
        mkdir -p "$TRANSLATIONS_PATH"
        # Use a subshell with dotglob to move all files including hidden ones
        (
            shopt -s dotglob
            mv ./temp_translations/translations/* "$TRANSLATIONS_PATH/"
        )
        
        echo "Cleaning up..."
        rm -rf translations.7z ./temp_translations
        echo "Translations downloaded and extracted successfully."
    else
        echo "Error: Failed to download translations from $URL"
        echo "The application might fail to start if translations are required."
    fi
else
    echo "Translations already present in $TRANSLATIONS_PATH."
fi

# Execute the main command (passed as arguments to this script)
exec "$@"
