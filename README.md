# tg_crypto_notification_mesg
Mesg application (services) to send telegram notification about cryptocurrency news and price change

![](result.gif])

# HOW TO INSTALL 
!! make sure you have installed mesg-core (see official website) 

## go to binance_api directory 
run
```
npm i
mesg-core service deploy
mesg-core service start binance_api
```

## go to telegram_bot directory

### insert your toket from botFather  

run
```
npm i
mesg-core service deploy
mesg-core service start telegramBot
```

## go to twitter_api dir 

find config.json and insert twitter API data

run
```
npm i
mesg-core service deploy
mesg-core service start com.mesg.get_tweets
```

# and finally 
in the root folder run 

```
node index.js

```
