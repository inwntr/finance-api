// src/routes/statusRoutes.js
import { Router } from 'express'
import { prisma } from '../config/prisma.js'

const statusRoutes = Router()

statusRoutes.get('/', async (req, res) => {
  const startedAt = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`

    return res.json({
      status: 'online',
      message: 'All systems operational',
      services: {
        api: 'online',
        database: 'online'
      },
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return res.status(503).json({
      status: 'outage',
      message: 'Database unavailable',
      services: {
        api: 'online',
        database: 'outage'
      },
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    })
  }
})

export default statusRoutes
