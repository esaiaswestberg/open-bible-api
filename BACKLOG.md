# Open Bible API - Project Backlog

## Bugs & Critical Fixes
- [x] **Fix Verse Loading Logic**: Currently, empty lines in `text.txt` files (used for paragraph spacing) are indexed as verses, causing incorrect verse numbering and 404 errors for valid verses. Logic should filter out empty or whitespace-only lines.

## New Features
- [ ] **Search Functionality**: Implement a `/search` endpoint to allow full-text search across translations, books, or the entire Bible.
- [ ] **Enhanced Verses Endpoint**: Update the `/:chapter/verses` endpoint to return the actual verse content (optionally) rather than just a count.
- [ ] **Random Verse Endpoint**: Add an endpoint to fetch a random verse (e.g., `/api/random`).
- [ ] **Cross-Translation Support**: Allow comparing verses across different translations in a single request.

## Technical Debt & Infrastructure
- [ ] **Testing Suite**: Implement unit and integration tests using Bun's built-in test runner or Vitest to verify routing and data loading.
- [x] **Environment Configuration**: Add support for `.env` files to configure the port and other environment-specific variables.
- [x] **Structured Logging**: Replace `console.log` with a structured logger like `pino` for better observability.
- [x] **API Documentation**: Integrate Swagger/OpenAPI (e.g., `swagger-jsdoc`) to provide interactive API documentation.
- [ ] **CORS Configuration**: Explicitly configure CORS to allow or restrict access from different origins.
- [ ] **Docker Support**: Create a `Dockerfile` and `docker-compose.yml` for easier deployment and containerized development.
