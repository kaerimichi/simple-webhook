'use strict'

require('dotenv').config()

const parse = require('co-body')
const route = require('koa-route')
const koa = require('koa')
const app = koa()
const moment = require('moment')
const gitHelper = require('./src/gitHelper')

app.use(route.get('/', function * () {
  let responseBody = [
    '> Webhook is ready!',
    'Node Version: ' + process.versions.node,
    'Server Time: ' + moment().format('YYYY-MM-DD HH:mm:ss')
  ]
  this.status = 200
  this.type = 'application/json'
  this.body = responseBody.join(' | ')
}))

app.use(route.post('/deploy/:serviceAlias', function * (serviceAlias) {
  this.type = 'application/json'
  try {
    let data = yield parse(this)
    let repoAlias = data.repository.name

    if (process.env.DEFAULT_GROUP) process.setgid(process.env.DEFAULT_GROUP)
    if (process.env.DEFAULT_USER) process.setuid(process.env.DEFAULT_USER)
    process.umask(0o002)

    yield gitHelper.pullRepo(repoAlias, serviceAlias)

    this.status = 200
    this.body = {
      error: false,
      message: 'Worktree updated.'
    }
  } catch (e) {
    this.status = 500
    this.body = {
      error: true,
      message: 'An error has occurred.'
    }
  }
}))

app.listen(process.env.APPLICATION_PORT)
