const mesg = require('mesg-js').service()
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true});

bot.onText(/\/start/, (msg)=>{
  const chatId = msg.chat.id;
  mesg.emitEvent("botStarted", {
    chatId: chatId,
  }).catch((err) => {
    console.error(err)
  })
})

bot.onText('message', (msg)=>{
  const chatId = msg.chat.id;
  
  // TODO
  // you can also add some bot interaction there
})


mesg.listenTask({
  // handler function of sendMessage
  sendMessage: (inputs, outputs) => {

    bot.sendMessage(inputs.chatId, inputs.text);

    outputs.success({
      message:'message sended'
    })
  },
})
  .on('error', (error) => {
    console.error(error)
  })
