const rp = require('request-promise')

  ; (async () => {
    const body = {
      "author": `urn:li:person:${process.env.ID}`,
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": "Sharing Text to linkedin from Node.js!"
          },
          "shareMediaCategory": "NONE"
        }
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    }
    const params = {
      uri: 'https://api.linkedin.com/v2/ugcPosts',
      method: 'POST',
      json: true,
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body
    }
    const { id } = await rp(params)
    if (id) {
      console.log('Sharing success with', id)
    }
  })()