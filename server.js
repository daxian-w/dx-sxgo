const http = require('http')
const next = require('next')

const dev = process.env.NODE_ENV === 'development'
const hostname = process.env.BIND_HOST || process.env.HOST || '0.0.0.0'
const port = Number.parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => {
        handle(req, res)
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`)
      })
  })
  .catch((err) => {
    console.error('Failed to start server:', err)
    process.exit(1)
  })
