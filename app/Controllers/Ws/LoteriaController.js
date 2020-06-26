'use strict'
const User = use('App/Models/User')

class LoteriaController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onJoin(id) {
    //let user = await User.find('username', data.username)
    //if (user) {

    //}
  }
}

module.exports = LoteriaController
