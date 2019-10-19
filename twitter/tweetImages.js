const Twitter = require('twitter');
const request = require('request');

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});


// const data = fs.readFileSync('./100x100.png')
const urls = [
  'https://wallzoe-images.s3-us-west-2.amazonaws.com/post-1571244848657534-100x100.png',
  'https://wallzoe-images.s3-us-west-2.amazonaws.com/post-1571244850882676-images.jpeg',
  'https://wallzoe-images.s3-us-west-2.amazonaws.com/post-1571244853324826-inline_image_preview.jpg'
]
const chainUpload = []

for (url of urls) {
  // push media_id_string with promise
  chainUpload.push(new Promise((resolve, reject) => {

    request.get(url).on('response', data => {

      client.post('media/upload', { media: data }, (error, media, response) => {
        if (error) reject(error)
        resolve(media.media_id_string)
      })

    })

  }))
}

// get media_ids array
; (async () => {
  const media_ids = await Promise.all(chainUpload)

  var status = {
    status: "Tweet from Node.js with multiple images",
    media_ids: media_ids.join(',')
  }
  client.post('statuses/update', status, function (error, tweet, response) {
    if (error) return console.error(error)
    console.log('tweet successful')
  })

})()
