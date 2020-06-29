'use strict'
const User = use('App/Models/User')

class UserController {
  async usersActive({}) {
    return User.connected().fetch();
  }
}

module.exports = UserController
