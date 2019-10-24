const http = require('http')

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  if (req.url === '/') {
    const styles = `text-align: center;margin-top:50px;font-size:2rem;display:block`
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=http://127.0.0.1:8000&scope=r_liteprofile%20r_emailaddress%20w_member_social&state=${process.env.STATE}`
    res.write(`<a href="${authUrl}" style="${styles}">Authenticate</a>`)

    /*
        get access token
        # Header
        Content-Type: application/x-www-form-urlencoded
        # URL
        https://www.linkedin.com/oauth/v2/accessToken?client_id=client-id-here&client_secret=client-secret-here&grant_type=authorization_code&redirect_uri=http://127.0.0.1:8000&code=returned-code
    */
  }
  res.end()
}).listen(8000, () => {
  console.log('Server running on http://127.0.0.1:8000')
})