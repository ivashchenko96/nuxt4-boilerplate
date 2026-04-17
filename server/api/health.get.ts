/**
 * Health check endpoint for container orchestration, load balancers, and uptime monitors.
 *
 * GET /api/health
 *
 * Returns 200 OK when the server is healthy.
 * Returns 503 Service Unavailable when degraded (for future use with real health probes).
 *
 * Used by:
 *  - Docker HEALTHCHECK instruction
 *  - Kubernetes liveness/readiness probes
 *  - Load balancer health checks (Nginx upstream, AWS ALB, etc.)
 *  - Uptime monitors (Better Uptime, UptimeRobot, etc.)
 */
export default defineEventHandler((event) => {
  const uptime = process.uptime()
  const memoryUsage = process.memoryUsage()

  setResponseStatus(event, 200)

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
    },
    version: process.env.npm_package_version ?? '0.0.0',
    environment: process.env.NODE_ENV ?? 'development',
  }
})
