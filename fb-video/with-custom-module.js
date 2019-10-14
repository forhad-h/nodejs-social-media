const fs = require('fs')
const request = require('request')
const fbUpload = require('facebook-api-video-upload')

const stream = request('https://example.com/image_name.mp4').pipe(fs.createWriteStream('image_name.mp4'))


stream.on('finish', () => {
  console.log('finished piping.')
  const args = {
    token: 'page/group token',
    id: 'page/group id',
    stream: fs.createReadStream('./image_name.mp4'),
    title: "test video",
    description: "video upload in FB page"
  }

  fbUpload(args).then(res => {
    console.log('res', res)
  })
    .catch(e => console.log(e))
})