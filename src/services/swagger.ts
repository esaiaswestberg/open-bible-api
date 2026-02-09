import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Open Bible API',
      version: '1.0.0',
      description: 'A simple API for accessing Bible translations.',
    },
  },
  apis: ['./src/routes/languages/*.ts', './src/routers/*.ts'], // Path to the API docs
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
