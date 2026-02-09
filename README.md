# 📖 Open Bible API

A performant, self-hosted Bible API built with **Bun** and **Express**. Open Bible API allows anyone to host their own Bible database with a structured, easy-to-query REST interface.

[![Docker Build](https://github.com/esaiaswestberg/open-bible-api/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/esaiaswestberg/open-bible-api/actions/workflows/docker-publish.yml)

## ✨ Features
- **🚀 High Performance**: Built on Bun for minimal latency.
- **🐳 Docker Ready**: Multi-arch support (AMD64/ARM64).
- **📝 Swagger Docs**: Interactive API documentation built-in.
- **🛡️ Secure**: Helmet and configurable CORS support.
- **📂 Simple Storage**: Uses a transparent filesystem-based schema.

---

## 🚀 Quick Start

### Using Docker Compose
```yaml
services:
  open-bible-api:
    image: ghcr.io/esaiaswestberg/open-bible-api:latest
    ports:
      - "3000:3000"
    volumes:
      - ./translations:/app/translations
      - ./logs:/app/logs
```
Run with: `docker-compose up -d`

### Local Development
1. Install dependencies: `bun install`
2. Start development server: `bun run dev`
3. Access API at `http://localhost:3000/api`
4. Access Docs at `http://localhost:3000/api-docs`

---

## 🛠️ Configuration (.env)
| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port the server listens on |
| `LOG_LEVEL` | `info` | Minimum log level (pino) |
| `CORS_ENABLED` | `true` | Enable/Disable CORS |
| `CORS_ORIGIN` | `*` | Allowed CORS origins |

---

## 📖 Documentation
The API is fully documented using OpenAPI/Swagger.
- **[Live Documentation](https://esaiaswestberg.github.io/open-bible-api/)** (GitHub Pages)
- **Local:** `http://localhost:3000/api-docs` (when running locally)

## 📂 Translation Schema

The API uses a transparent filesystem-based storage system. Translations are stored in the `translations/` directory with the following structure:

```text
translations/
└── [language]/                 # e.g., 'english'
    ├── metadata.json           # Language metadata
    └── [translation]/          # e.g., 'WEB'
        ├── metadata.json       # Translation metadata
        └── [book]/             # e.g., 'GEN' (standard 3-letter abbreviation)
            ├── metadata.json   # Book metadata
            └── [chapter]/      # e.g., '1'
                ├── metadata.json
                └── text.txt    # Verse content (one verse per line)
```

### 📄 Metadata Requirements

#### **Language** (`translations/[language]/metadata.json`)
```json
{ "displayName": "English", "abbreviation": "en" }
```

#### **Translation** (`translations/[language]/[translation]/metadata.json`)
```json
{
  "name": "World English Bible",
  "abbreviation": "WEB",
  "uid": "eng-WEB",
  "info": "Brief description of the translation..."
}
```

#### **Book** (`translations/.../[book]/metadata.json`)
```json
{ "name": "Genesis", "abbreviation": "GEN" }
```

#### **Chapter** (`translations/.../[chapter]/metadata.json`)
```json
{ "name": "Genesis 1", "number": 1 }
```

### 📖 Verse Content (`text.txt`)
Verses should be placed in `text.txt` inside each chapter folder. **Each verse must be on its own line.** Empty lines are ignored.

---

## 📜 Included Translations
Currently includes the **World English Bible (WEB)**, which is in the Public Domain. We welcome Pull Requests for other Public Domain translations!

## ⚖️ License
MIT License.