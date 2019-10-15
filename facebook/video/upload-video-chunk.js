const fs = require('fs')
const request = require('request')
const rp = require('request-promise')
const streamToPromise = require('stream-to-promise')
const _ = require('lodash')


// retry 10 times on error
const maxRetry = 10
let retry = 0

const fileUrl = 'https://www.example.com/test.mp4'

const splitUrl = fileUrl.split('/')
const filename = splitUrl[splitUrl.length - 1]
const localDir = `${__dirname}/temp/${filename}`
const access_token = process.env.ACCESS_TOKEN
const uri = `https://graph-video.facebook.com/v4.0/${process.env.ID}/videos`

// download the remote file
const downloadFile = request(fileUrl).pipe(fs.createWriteStream(localDir))
downloadFile.on('finish', async () => {

  const stream = fs.createReadStream(localDir)
  const buffer = await streamToPromise(stream)
  const { start_offset, end_offset, upload_session_id } = await startUpload(buffer.length)

  const { session_id } = await transferChunk(buffer, start_offset, end_offset, upload_session_id)

  if (session_id) {
    const { success } = await finishUpload(session_id)
    if (success) {
      fs.unlink(localDir, err => {
        if (err) return console.error(err)
        console.log(`${filename} has been deleted`)
      })
    }
  }

})

async function startUpload(fileSize) {
  try {
    const response = await rp({
      method: 'POST',
      uri,
      qs: {
        access_token,
        upload_phase: 'start',
        file_size: fileSize
      },
      json: true
    })
    return response
  } catch (err) {
    return console.error(err)
  }
}

async function transferChunk(buffer, start, end, id) {

  if (start === end) return { session_id: id }

  const chunk = buffer.slice(start, end)

  const formData = {
    access_token,
    upload_phase: 'transfer',
    start_offset: start,
    upload_session_id: id,
    video_file_chunk: {
      value: chunk,
      options: {
        filename: 'chunk'
      }
    }
  }

  try {
    const response = await rp({
      method: 'POST',
      uri,
      formData: formData,
      json: true
    })
    console.log(response)
    retry = 0
    return await transferChunk(buffer, response.start_offset, response.end_offset, id)
  } catch (err) {
    if (++retry >= maxRetry) return console.error(err)
    return transferChunk(buffer, start, end, id)
  }
}


async function finishUpload(id) {

  const response = await rp({
    method: 'POST',
    uri,
    qs: {
      access_token,
      upload_phase: 'finish',
      upload_session_id: id
    },
    json: true
  })

  return response

}
