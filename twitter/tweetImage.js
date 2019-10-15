const Twitter = require('twitter');
const fs = require('fs')

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});

const data = fs.readFileSync('./100x100.png')

const params = { media: data }

client.post('media/upload', params, function (error, media, response) {
  if (error) return console.error(error)
  console.log('media uploaded')
  var status = {
    status: "Tweet from Node.js",
    media_ids: media.media_id_string
  }
  client.post('statuses/update', status, function (error, tweet, response) {
    if (error) return console.error(error)
    console.log('tweet successful')
  })
});