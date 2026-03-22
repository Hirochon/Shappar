import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const port = Number(process.env.PORT ?? '3000')
const rootDirectory = fileURLToPath(new URL('..', import.meta.url))
const distDirectory = path.resolve(rootDirectory, 'dist')
const indexFile = path.resolve(distDirectory, 'index.html')

const app = express()

app.get('/health', (_request, response) => {
  response.json({
    mode: 'preview',
    service: 'react-router-front',
    status: 'ok',
  })
})

app.use(express.static(distDirectory))

app.use((request, response, next) => {
  if (request.method !== 'GET') {
    next()
    return
  }

  response.sendFile(indexFile)
})

app.listen(port, () => {
  console.log(
    `[react-router-front] preview server ready on http://localhost:${port}`,
  )
})
