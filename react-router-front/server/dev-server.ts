import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const port = Number(process.env.PORT ?? '3000')
const rootDirectory = fileURLToPath(new URL('..', import.meta.url))

async function startServer() {
  const app = express()
  const server = createServer(app)

  const vite = await createViteServer({
    appType: 'custom',
    root: rootDirectory,
    server: {
      hmr: { server },
      middlewareMode: true,
    },
  })

  app.get('/health', (_request, response) => {
    response.json({
      mode: 'development',
      service: 'react-router-front',
      status: 'ok',
    })
  })

  app.use(vite.middlewares)

  app.use(async (request, response, next) => {
    if (request.method !== 'GET') {
      next()
      return
    }

    try {
      const templatePath = path.resolve(rootDirectory, 'index.html')
      const template = await readFile(templatePath, 'utf8')
      const html = await vite.transformIndexHtml(request.originalUrl, template)

      response.status(200).setHeader('Content-Type', 'text/html')
      response.end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error as Error)
      next(error)
    }
  })

  server.listen(port, () => {
    console.log(
      `[react-router-front] dev server ready on http://localhost:${port}`,
    )
  })
}

void startServer()
