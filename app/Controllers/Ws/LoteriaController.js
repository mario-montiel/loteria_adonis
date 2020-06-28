'use strict'
const BoardCards = use('App/Models/BoardHasCard')
const Card = use('App/Models/Card')
const Game = use('App/Models/Game')
const User = use('App/Models/User')
const Board = use('App/Models/Board')

const currentCardId = 0

class LoteriaController {
  constructor({
    socket,
    request
  }) {
    this.socket = socket
    this.request = request
  }

  async onJoin(id) {
    let user = await User.find(id)
    if (!user) {
      return
    }

    user.status = 'active'
    await user.save()

    // BROADCAST connected user
    this.socket.broadcast('connUser', user)

    let game = await Game.first()
    if (game) {
      let activeUsers = await User.query().where('status', 'active').getCount()

      switch (game.status) {
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
              this._startGame(game)
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
    } else {
      game = new Game()
      game.status = 'preparing'
    }
  }

  async onCardSelect(data) {
    let correctCard = data.card_id == currentCardId ? true : false
    let board = await BoardCards.query().where('board_id', data.board_id)
      .andWhere('card_id'.data.card_id).first().fetch()
    let success = false

    if (board && correctCard) {
      success = true

      board.selected = 1
      board.save()
    }

    this.socket.broadcastToAll('cardSelect', {
      user_id: data.user_id,
      success: success
    })
  }

  async onWin(quien) {
    let user = await User.find(quien.id)
    let board = await Board.findBy('user_id', user.id)
    let borcards = await board.boardhascard().fetch()
    switch (quien.como) {
      case 'centro':
        let gano = "nada"
        let c1 = borcards.rows[5].selected
        let c2 = borcards.rows[6].selected
        let c3 = borcards.rows[9].selected
        let c4 = borcards.rows[10].selected
        if (c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1) {
          this.socket.broadcastToAll('onWin', {
            "todo bien"
          })
        } else {
          this.socket.broadcastToAll("message", "no sea mentiroso we")
        }
        break
      case 'loteria':
    }
  }

  async onClose(id) {
    let user = await User.find(id)
    if (!user) {
      return
    }

    user.status = 'inactive'
    await user.save()
  }

  async _runTimer(game_id) {
    let sec = 30,
      timer = 0

    function timerBroadcast() {
      game = Game.find(game_id)
      if (game.status == 'inactive') {
        clearTimeout(timer)
      }

      sec--
      this.socket.broadcastToAll('timer', sec)
    }

    timer = setTimeout(timerBroadcast, 30000);
  }

  async _startGame(game) {
    const cards = await Card.all()
    const rdmCards = shuffle(cards)
    game.cards().createMany(rdmCards)
  }
}

module.exports = LoteriaController
