import browserSync from 'browser-sync'

const local = browserSync.create('local')
local.init({
  server: './src',
  https: {
    key: './localhost-key.pem',
    cert: './localhost.pem',
  },
  port: 8000,
  ui: false,
  cors: true,
  open: false,
})
