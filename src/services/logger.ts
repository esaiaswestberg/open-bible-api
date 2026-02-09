import pino from 'pino'

const targets: any[] = [
  {
    target: process.env.NODE_ENV !== 'production' ? 'pino-pretty' : 'pino/file',
    level: process.env.LOG_LEVEL || 'info',
    options: process.env.NODE_ENV !== 'production' 
      ? {
          colorize: true,
          ignore: 'pid,hostname,responseTime',
          translateTime: 'HH:MM:ss',
        }
      : {},
  },
]

if (process.env.LOG_FILE_PATH) {
  targets.push({
    target: 'pino/file',
    level: process.env.LOG_LEVEL || 'info',
    options: { destination: process.env.LOG_FILE_PATH, mkdir: true },
  })
}

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets,
  },
})

export default logger
