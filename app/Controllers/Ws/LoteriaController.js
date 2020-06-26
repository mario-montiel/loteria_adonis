'use strict'
const User = use('App/Models/User')
const Game = use('App/Models/Game')

class LoteriaController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onJoin(id) {
    let user = await User.find(id)
    if (!user) { return }

    user.status = 'active'
    await user.save()

    // BROADCAST connected user
    this.socket.broadcast('user', user)

    let game = await Game.first()
    if (game) {
      let status = game.status

      // in case the game is waiting for users
      if (status == 'preparing') {
        let activeUsers = await User.query() .where('status', 'active').getCount()
        if (activeUsers > 1) {
          //function myFunc(arg) {
            //console.log(`arg was => ${arg}`);
          //}

          //setTimeout(myFunc, 30000, 'funky');
        }
      }
      // in case the game is in progress
      else if (status == 'playing') {

      }
    }
    else {
      game = new Game()
      game.status = 'preparing'
    }

    //this.socket.broadcast()
  }

  async onCheck() {

  }

  async onClose(id) {

  }
}

module.exports = LoteriaController
