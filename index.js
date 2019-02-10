const mesg = require('mesg-js').application();

// limit  - 18 000 tweets per 15 minutes

// !! insert bellow your telegram chat id (number)
const telegramChatId = ;
const SERVICE_TWITTER = 'com.mesg.get_tweets';
const SERVICE_TELEGRAM_BOT = 'telegramBot';
const SERVICE_BINANCE_API = 'binance_api';

// you can add more twitter account in the same format as bellow ( with url, screen_name, symbol)
const TwitterAccountList = [
  {"full_url":  "https://twitter.com/acointeam",  'screen_name':"acointeam", "symbol": "ACOIN" },
  {"full_url":   "https://twitter.com/AdEx_Network",  'screen_name':"AdEx_Network" ,  "symbol": "ADX"},
  {"full_url":  "https://twitter.com/Quark_Chain",  'screen_name':"Quark_Chain", "symbol": "QKC" },
]

console.log('TwitterAccountList.length',TwitterAccountList.length);

// check every 15 minutes = 60 * 15 = 900 - 900 000 miliseconds
// limit  - 18 000 tweets per 15 minutes
const getTweets = () => {
  console.log('start gazzering tweets ...');
  TwitterAccountList.map(twitter => {
    console.log('get tweets for twitter -',twitter.screen_name);
    mesg.executeTask({
      serviceID: SERVICE_TWITTER,
      taskKey: 'getTweets',
      inputData: JSON.stringify({ 
        screen_name: twitter.screen_name, 
        count:5,
        tweet_mode: 'extended'})
    }).catch((err) => {
      console.error(err.message)
    })
  })
  console.log('start waiting...');
}

// start getting tweets every 15 minutes
setInterval(getTweets, 10000);
// setInterval(getTweets, 900000);


const stream = mesg.listenResult({
  serviceID: SERVICE_TWITTER
}).on('data', (result) => {
  console.log('result recieved')
  let dateNow = Date.now();
  let tweetsArray = JSON.parse(result.outputData).tweetsArray
  tweetsArray.map(tweet => {

    let tweetId = tweet.id;
    let created_at = tweet.created_at;
    let tweetDate = parseTwitterDate(created_at);
    let difference = (dateNow - tweetDate.getTime()) / 60000;
    // console.log('difference',difference);
    if (difference < 2000){
      // console.log(JSON.stringify(tweet, null, 4));
      let sendMessage = true;
      let full_text = tweet.full_text;

      if (sendMessage == true){


        let symbol;
        TwitterAccountList.map(coinInfo => {
          if (coinInfo.screen_name == tweet.user.screen_name){
            symbol = coinInfo.symbol
          }
        })

        mesg.executeTaskAndWaitResult({
          serviceID: SERVICE_BINANCE_API,
          taskKey: 'getCoinPriceChange',
          inputData: JSON.stringify({ 
            "coinpair" : `${symbol}BTC`,
            "interval" : "1h",
            "intervalNum" : 7,
            "messageType" : "simple"
          })
        }).then(res =>{
            console.log(JSON.parse(res.outputData).priceChange);
            let priceChange = JSON.parse(res.outputData).priceChange.map(priceChange => { 
                return Math.round(priceChange * 10) / 10
            })
            let priceStr = priceChange.join(' | ');
            console.log('send telegram message ...');
            mesg.executeTask({
              serviceID: SERVICE_TELEGRAM_BOT,
              taskKey: 'sendMessage',
              inputData: JSON.stringify({ 
                chatId: telegramChatId, 
                text: '****\n' + full_text + `\n https://twitter.com/${tweet.user.screen_name}/status/${tweetId}` + 
                                  `\n ---------------- \n` + 
                                  `${tweet.user.screen_name},\n` + 
                                  `${priceStr}`
              })
            })
        })


      }

    }
  })

  // console.log('a result received:',JSON.parse(result.tweetsArray))
}).on('error', (err) => {
  console.error('an error has occurred:', err.message)
}).on('end', () => {
  console.log('stream closed')
})



function parseTwitterDate(aDate)
{   
  return new Date(Date.parse(aDate.replace(/( \+)/, ' UTC$1')));
  //sample: Wed Mar 13 09:06:07 +0000 2013 
}