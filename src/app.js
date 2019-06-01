const express = require('express')
const requireDir = require('require-dir')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

const routes = requireDir('../routers', { recurse: true })
const exception = require('../utils/exception')
const { auth, onlyAdmin} = require('../utils/middleware')

const port = process.env.PORT || '3001' // default to 3001 if port info not set

app.get('/', (req, res) => {
  res.json({
    meta: {
      code: 200,
      error: null,
      message: `Server is running at: http://localhost:${port}`,
    },
  })
})

app.use('/session', routes.session)
app.use('/location', auth, routes.location)
app.use('/user', auth, routes.user)
app.use('/tour', auth, routes.tour)
app.use('/tour-member', auth, routes.tour_member)
app.use('/like', auth, routes.like)
app.use('/like', auth, routes.like)
// app.use('/admin', auth, onlyAdmin, routes.session)

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

const server = app.listen(port, () => {
    console.log(`server running at port ${port}`)
})

// -------------testing---------------
// const io = require('socket.io')(server)
// io.use(function(socket, next) {
//   var handshakeData = socket.request;
//   // make sure the handshake data looks good as before
//   // if error do this:
//     // next(new Error('not authorized'));
//   // else just call next
//   next()
// })
// let user = []
// const chat = io
//   .of('/chat')
//   .on('connection', function (socket) {

//      socket.on('adduser', function (name) {
//        user.push(name)
//        console.log(user)
//        console.log(socket.id)
//        socket.once('disconnect', function () {
//          var pos = users.indexOf(name);
//           console.log('rudi remove')
//          if (pos >= 0)
//            users.splice(pos, 1);
//        })
//   })
//   })

// io.on('connection', (socket) => {
//   console.log('New user connected')
//   // socket.broadcast.emit('great', 'hello friends!')
//   // socket.emit('great', 'hello friends!')
//   socket.on('button-click', (res) => {
//       io.sockets.emit('after-click', 'hello');
//   })

//   socket.on('disconnect', function(){
//     console.log('user disconnected')
//   })
// })