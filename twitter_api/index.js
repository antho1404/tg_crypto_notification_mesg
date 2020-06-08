const liteflow = new (require('@liteflow/service'))()
var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);

// params = {
//   screen_name:'Ripple',
//   count: 2,
//   tweet_mode: 'extended'
// }

liteflow.listenTask({
  // handler function of taskX
  getTweets: (inputs, outputs) => {
    console.log('inputs',inputs);
    T.get('statuses/user_timeline', inputs, (err,tweets,response)=>{
      if(!err){
        
        // console.log(tweets)
        outputs.success({
          tweetsArray: tweets
        })

        liteflow.emitEvent({

        })

      } else {
        console.log(err);
      }
    })

  },
})
  .on('error', (error) => {
    console.error(error)
  })
