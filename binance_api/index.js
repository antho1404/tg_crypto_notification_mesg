const mesg = require('mesg-js').service()

mesg.listenTask({
  getCoinPriceChange: require('./tasks/getCoinPriceChange')
})
  .on('error', (error) => console.error(error))

mesg.emitEvent('started', { x: true })
  .catch((error) => console.error(error))
