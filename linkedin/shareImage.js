const rp = require('request-promise')
const request = require('request')

const imageUrl = 'https://wallzoe-images.s3-us-west-2.amazonaws.com/post-1571585634782194-tenor.gif'

  ; (async () => {

    const { uploadUrl, asset } = await registerImage()
    await uploadImage(uploadUrl)
    const { id } = await shareImage(asset)
    console.log(id)

  })()


async function registerImage() {
  const body = {
    "registerUploadRequest": {
      "recipes": [
        "urn:li:digitalmediaRecipe:feedshare-image"
      ],
      "owner": `urn:li:person:${process.env.ID}`,
      "serviceRelationships": [
        {
          "relationshipType": "OWNER",
          "identifier": "urn:li:userGeneratedContent"
        }
      ]
    }
  }

  const params = {
    uri: 'https://api.linkedin.com/v2/assets?action=registerUpload',
    method: 'POST',
    json: true,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body
  }
  const response = await rp(params)
  const uploadUrl = response.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl
  const asset = response.value.asset

  return { uploadUrl, asset }
}

function uploadImage(uri) {

  request.get(imageUrl).on('response', async stream => {
    const params = {
      uri,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: stream
    }
    const response = await rp(params)
  })

}

async function shareImage(asset) {
  const body = {
    "author": `urn:li:person:${process.env.ID}`,
    "lifecycleState": "PUBLISHED",
    "specificContent": {
      "com.linkedin.ugc.ShareContent": {
        "shareCommentary": {
          "text": "Sharing Image file to linkedin from Node.js! #sharing"
        },
        "shareMediaCategory": "IMAGE",
        "media": [
          {
            "status": "READY",
            "description": {
              "text": "Center stage!"
            },
            "media": asset,
            "title": {
              "text": "LinkedIn Talent Connect 2018"
            }
          }
        ]
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
  return await rp(params)
}