var Download = require('download')
var downloadStatus = require('download-status')
var homeOrTmp = require('home-or-tmp')
var pathExists = require('path-exists')
var path = require('path')

var baseUrl = 'http://dynamodb-local.s3-website-us-west-2.amazonaws.com/dynamodb_local_'

// version: "latest" or "2015-07-16_1.0"
module.exports = function(version, callback) {
  if (!version) version = 'latest'

  var dir = path.join(homeOrTmp, '.local-dynamo', version)
  var jar = path.join(dir, 'DynamoDBLocal.jar')

  function done(err) {
    callback(err, {
      dir: dir,
      jar: jar,
      lib: path.join(dir, 'DynamoDBLocal_lib')
    })
  }

  pathExists(jar, function(err, exists){
    if (exists) done()
    else download(version, dir, done)
  })
}

function download(version, dir, done) {
  var url = baseUrl + version + '.zip'
  var dl = new Download({mode: '755', extract: true})

  if (process.stderr.isTTY) {
    dl.use(downloadStatus())
  }

  dl.get(url).dest(dir).run(done)
}
