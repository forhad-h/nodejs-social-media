require('dotenv').config()

const async = require('async')
const fs = require('fs')

const filePath = 'preview.mp4'
const stats = fs.statSync(filePath)
const bufferLength = 1000000
const theBuffer = new Buffer.alloc(bufferLength)
let offset = 0

require('./twitter/tweetVideo')
