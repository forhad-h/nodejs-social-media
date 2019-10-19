const Twitter = require('twitter');
const fs = require('fs')
const request = require('request')

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});


// const data = fs.readFileSync('./100x100.png')

const url = 'https://wallzoe-images.s3-us-west-2.amazonaws.com/post-1571143124381575-47843.jpg'

request.get(url).on('response', response => {
  console.log('works now')
  const params = { media: response }
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

})
