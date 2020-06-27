'use strict'
const User = use('App/Models/User')
//const Game = use('App/Models/Game')

class LoteriaController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  async onJoin(id) {
    let user = await User.find(id)
    if (!user) { return }

    user.status = 'active'
    await user.save()

    // BROADCAST connected user
    this.socket.broadcast('connUser', user)

    let game = await Game.first()
    if (game) {
      let activeUsers = await User.query().where('status', 'active').getCount()

      switch(game.status) {
        // in case the game is waiting for users
        case 'inactive':
          if (activeUsers > 1) {
            game.status = 'preparing'
            game.save()

            this._runTimer(game.id)

            // The game status could change if users disconnect letting one conncected
            game = game.find(game.id)
            if (game.status == 'preparing') {
              game.status = 'playing'
              await game.status()

              activeUsers = await User.query().where('status', 'active').fetch()

              this.socket.broadcastToAll('gameStatus', 'START') // START status is an advice

              // GENERATING GAME NECESSARY DATA
            }
          }
          break
        // the game has already started
        case 'playing':
          this.socket.broadcast('gameStatus', 'playing')
          break
        // the game is waiting for users before it can start
        case 'preparing':
          // I don't know what to do here :c It's Mario's fault
          break
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
    let user = await User.find(id)
    if (!user) { return }

    user.status = 'inactive'
    await user.save()
  }

  async _runTimer(game_id) {
    let sec = 30, timer = 0
    function timerBroadcast() {
      game = Game.find(game_id)
      if (game.status == 'inactive') { clearTimeout(timer) }

      sec--
      this.socket.broadcastToAll('timer', sec)
    }

    timer = setTimeout(timerBroadcast, 30000);
  }
}

module.exports = LoteriaController
