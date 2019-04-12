const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) {
  const cpuCount = os.cpus().length
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }
} else {
  require('./app')
}

cluster.on('exit', (worker) => {
  console.log('Initiating exit for', worker.id)
  cluster.fork()
})