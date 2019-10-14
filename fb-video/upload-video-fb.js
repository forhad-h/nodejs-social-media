const request = require('request')
const rp = require('request-promise')

  ; (async () => {

    formData = { source: request('https://example.com/image_name.mp4') }

    const apiParams = {
      method: 'POST',
      uri: `https://graph-video.facebook.com/v4.0/${page / group - id}/videos`,
      formData: formData,
      qs: {
        access_token: 'page/group token'
      }
    }
    try {
      console.log(await rp(apiParams))
    }
    catch (err) {
      console.error(err)
    }
  })()
