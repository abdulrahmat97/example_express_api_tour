const express = require('express')
const requireDir = require('require-dir')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const exception = require('../utils/exception')

const routes = requireDir('../routers', { recurse: true })
const port = 3002
app.get('/', (req, res) => {
    res.json({
      meta: {
        code: 200,
        error: null,
        message: `Server is running at: http://localhost:${port}`,
      },
    })
  })

app.use('/location', routes.location)
app.use('/user', routes.user)
app.use('/tour', routes.tour)
app.use('/tour-member', routes.tour_member)

app.use((err, req, res, next) => {
  if (err) {
    const [error, status] = exception(err)
    if (status === 500) {
      res.status(status).json({
        meta: {
          code: 500,
          message: error.message,
        },
      })
    } else {
      res.status(status).json({ meta: error })
    }
    return
  }
  next()
})

app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ message: 'Sorry can\'t find that!' })
  }
})

app.listen(port, () => {
    console.log(`server running at port ${port}`)
})