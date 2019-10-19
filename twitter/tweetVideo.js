const Twitter = require('twitter');
const request = require('request');
const fs = require('fs')
const { whilst } = require('async')

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});

const filePath = './sample.mp4'
const mediaType = 'video/mp4'
const mediaSize = fs.statSync(filePath).size
const chunkSize = 1000000
const chunkBuffer = new Buffer.alloc(chunkSize)

fs.open(filePath, 'r', async (err, fd) => {
  if (err) return console.error(err)

  let segment_index = 0
  let offset = 0

  const initUploadRes = await initUpload()


  const chunkUploadRes = whilst(
    cb => cb(null, offset < mediaSize),
    cb => {
      const bytesRead = fs.readSync(fd, chunkBuffer, 0, chunkSize, null)
      const data = bytesRead < chunkSize ? chunkBuffer.slice(0, bytesRead) : chunkBuffer
      console.log('offset', offset)
      appendUpload(initUploadRes, segment_index, data.toString('base64')).then(res => cb(null, res))
      segment_index++
      offset += chunkSize
    }
  )


  const finalizeUploadRes = await finalizeUpload(await chunkUploadRes)

  var status = {
    status: "Tweet from Node.js",
    media_ids: finalizeUploadRes
  }

  client.post('statuses/update', status, function (error, tweet, response) {
    if (error) return console.error(error)
    console.log('tweet successful')
  })

})


// start upload
async function initUpload() {
  const data = await makePost('media/upload', {
    command: 'INIT',
    total_bytes: mediaSize,
    media_type: mediaType
  })
  return data.media_id_string
}


// upload chunk
async function appendUpload(media_id, segment_index, media_data) {

  await makePost('media/upload', {
    command: 'APPEND',
    media_id,
    media_data,
    segment_index
  })

  return media_id
}


// finalize upload
async function finalizeUpload(media_id) {

  await makePost('media/upload', {
    command: 'FINALIZE',
    media_id
  })
  return media_id
}

// base endpoint
function makePost(endpoint, params) {
  return new Promise((resolve, reject) => {
    client.post(endpoint, params, (err, data, response) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}