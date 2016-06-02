'use strict'

module.exports = {

  pullRepo: function (repoAlias, serviceAlias) {
    let userAlias = process.env.USER_ALIAS
    let remote = 'git@bitbucket.org:' + userAlias + '/' + repoAlias + '.git'
    let branch = process.env.DEFAULT_BRANCH
    let deployDir = process.env.DEPLOY_DIR + '/'

    return function (callback) {
      return require('simple-git')(deployDir + serviceAlias)
        .reset('hard', callback)
        .checkout(branch, callback)
        .pull(remote, branch, callback)
    }
  }

}
