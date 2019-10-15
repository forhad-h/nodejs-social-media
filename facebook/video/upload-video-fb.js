const request = require('request')
const rp = require('request-promise')

  ; (async () => {
    const fileUrl = 'https://www.example.com/preview.mp4'
    const objectId = process.env.ID
    const accessToken = process.env.ACCESS_TOKEN

    const formData = { source: request(fileUrl) }

    const apiParams = {
      method: 'POST',
      uri: `https://graph-video.facebook.com/v4.0/${objectId}/videos`,
      formData: formData,
      qs: {
        access_token: accessToken,
        title: "Some title here",
        description: "caption of this video"
      }
    }
    try {
      console.log(await rp(apiParams))
    }
    catch (err) {
      console.error(err)
    }
  })()
