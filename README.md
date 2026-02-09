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
The API is fully documented using OpenAPI/Swagger. When the server is running, you can access the interactive documentation at:
**`http://localhost:3000/api-docs`**

## 📂 Translation Schema
The API uses a simple filesystem-based schema for translations. Detailed documentation on the directory structure and metadata requirements will be added soon.

## 📜 Included Translations
Currently includes the **World English Bible (WEB)**, which is in the Public Domain. We welcome Pull Requests for other Public Domain translations!

## ⚖️ License
MIT License.