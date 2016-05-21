require('dotenv').config()

var parse = require('co-body')
var route = require('koa-route')
var koa = require('koa')
var app = koa()

function pullRepo (repoAlias, serviceAlias) {
  var userAlias = process.env.USER_ALIAS
  var remote = 'git@bitbucket.org:' + userAlias + '/' + repoAlias + '.git'
  var branch = process.env.DEFAUsLT_BRANCH
  var deployDir = process.env.DEPLOY_DIR + '/'

  return function (callback) {
    return require('simple-git')(deployDir + serviceAlias)
      .reset('hard', callback)
      .checkout(branch, callback)
      .pull(remote, branch, callback)
  }
}

app.use(route.post('/deploy/:serviceAlias', function * (serviceAlias) {
  try {
    var data = yield parse(this)
    var repoAlias = data.repository.name

    if (process.env.DEFAULT_GROUP) process.setgid(process.env.DEFAULT_GROUP)
    if (process.env.DEFAULT_USER) process.setuid(process.env.DEFAULT_USER)
    process.umask(0o002)

    yield pullRepo(repoAlias, serviceAlias)

    this.status = 200
    this.type = 'application/json'
    this.body = {
      error: false,
      message: 'Worktree updated.'
    }
  } catch (e) {
    this.status = 500
    this.type = 'application/json'
    this.body = {
      error: true,
      message: 'An error has occurred.'
    }
  }
}))

app.listen(process.env.APPLICATION_PORT)
