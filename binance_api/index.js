const liteflow = new (require('@liteflow/service'))()

liteflow.listenTask({
  getCoinPriceChange: require('./tasks/getCoinPriceChange')
})
  .on('error', (error) => console.error(error))

liteflow.emitEvent('started', { x: true })
  .catch((error) => console.error(error))
