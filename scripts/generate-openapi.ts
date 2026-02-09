import { writeFileSync, mkdirSync } from 'fs'
import swaggerSpec from '../src/services/swagger.js'

// Ensure docs directory exists
mkdirSync('./docs', { recursive: true })

// Write the OpenAPI spec to a JSON file
writeFileSync('./docs/openapi.json', JSON.stringify(swaggerSpec, null, 2))

console.log('Successfully generated docs/openapi.json')
