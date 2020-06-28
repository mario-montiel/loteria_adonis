'use strict'
const BoardCards = use('App/Models/BoardHasCard')
const Card = use('App/Models/Card')
const Game = use('App/Models/Game')
const User = use('App/Models/User')
const Board = use('App/Models/Board')

const shuffle = require('shuffle-array')

const currentCard = {
  id: 0,
  name: 'unknown',
  path: 'unknown'
}

class LoteriaController {
  constructor({
    socket,
    request
  }) {
    this.socket = socket
    this.request = request
    this.gano = "no"
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
              //SI FUNCIONA COMPROBADO (ESPERO :'V)
              const newBoard = new Board();
              newBoard.user_id = id;
              await newBoard.save();
              //CREATE BOARD WITH CARDS
              

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
    let correctCard = data.card_id == currentCard.id ? true : false
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
    let c1 = 1
    let c2 = 1
    let c3 = 1
    let c4 = 1
    switch (quien.como) {
      case 'centro':
        c1 = borcards.rows[5].selected
        c2 = borcards.rows[6].selected
        c3 = borcards.rows[9].selected
        c4 = borcards.rows[10].selected
        this._winner4(c1, c2, c3, c4)
        this._menssagewin(quien.id)
        this.gano = "no"
        break
      case 'full':
        this.gano = "si"
        for (var i = 0; i < borcards.rows.length; i++) {
          if (borcards.rows[i].selected == 0) {
            this.gano = "no"
          }
        }
        if (this.gano == "si") {
          this.socket.broadcastToAll('onWin', {
            user_id: quien.id,
            win: "yes"
          })
        } else {
          this.socket.broadcastToAll('onWin', {
            user_id: quien.id,
            win: "no"
          })
        }
        break
      case 'loteria':
        c1 = borcards.rows[0].selected
        c2 = borcards.rows[1].selected
        c3 = borcards.rows[2].selected
        c4 = borcards.rows[3].selected
        this._winner4(c1, c2, c3, c4)
        if (this.gano == "no") {
          c1 = borcards.rows[4].selected
          c2 = borcards.rows[5].selected
          c3 = borcards.rows[6].selected
          c4 = borcards.rows[7].selected
          this._winner4(c1, c2, c3, c4)
          if (this.gano == "no") {
            c1 = borcards.rows[8].selected
            c2 = borcards.rows[9].selected
            c3 = borcards.rows[10].selected
            c4 = borcards.rows[11].selected
            this._winner4(c1, c2, c3, c4)
            if (this.gano == "no") {
              c1 = borcards.rows[12].selected
              c2 = borcards.rows[13].selected
              c3 = borcards.rows[14].selected
              c4 = borcards.rows[15].selected
              this._winner4(c1, c2, c3, c4)
              if (this.gano == "no") {
                c1 = borcards.rows[0].selected
                c2 = borcards.rows[4].selected
                c3 = borcards.rows[8].selected
                c4 = borcards.rows[12].selected
                this._winner4(c1, c2, c3, c4)
                if (this.gano == "no") {
                  c1 = borcards.rows[1].selected
                  c2 = borcards.rows[5].selected
                  c3 = borcards.rows[9].selected
                  c4 = borcards.rows[13].selected
                  this._winner4(c1, c2, c3, c4)
                  if (this.gano == "no") {
                    c1 = borcards.rows[2].selected
                    c2 = borcards.rows[6].selected
                    c3 = borcards.rows[10].selected
                    c4 = borcards.rows[14].selected
                    this._winner4(c1, c2, c3, c4)
                    if (this.gano == "no") {
                      c1 = borcards.rows[3].selected
                      c2 = borcards.rows[7].selected
                      c3 = borcards.rows[11].selected
                      c4 = borcards.rows[15].selected
                      this._winner4(c1, c2, c3, c4)
                      if (this.gano == "no") {
                        c1 = borcards.rows[0].selected
                        c2 = borcards.rows[5].selected
                        c3 = borcards.rows[10].selected
                        c4 = borcards.rows[15].selected
                        this._winner4(c1, c2, c3, c4)
                        if (this.gano == "no") {
                          c1 = borcards.rows[3].selected
                          c2 = borcards.rows[6].selected
                          c3 = borcards.rows[9].selected
                          c4 = borcards.rows[12].selected
                          this._winner4(c1, c2, c3, c4)
                          if (this.gano == "no") {
                            this._menssagewin(quien.id)
                          }
                        } else {
                          this._menssagewin(quien.id)
                        }
                      } else {
                        this._menssagewin(quien.id)
                      }
                    } else {
                      this._menssagewin(quien.id)
                    }
                  } else {
                    this._menssagewin(quien.id)
                  }
                } else {
                  this._menssagewin(quien.id)
                }
              } else {
                this._menssagewin(quien.id)
              }
            } else {
              this._menssagewin(quien.id)
            }
          } else {
            this._menssagewin(quien.id)
          }
        } else {
          this._menssagewin(quien.id)
        }
        this.gano = "no"
        break
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
    const rdmCards = await shuffle(cards.rows)

    await game.cards().saveMany(rdmCards)
  }

  // Aquí cambia el ciclo de las cartas de en medio :u
  async _currCardCycle(game) {
    let interval = setInterval(cardCycle, 3000);

    function cardCycle() {
      let cards = game.cards().fetch()

      if (!cards) {
        this.socket.broadcastToAll('onWin', {
          user_id: 0,
          win: "draw"
        })
        clearInterval(interval)
      }

      this.currentCard = cards.first()
      game.cards().detach(this.currentCard.id)

      this.socket.broadcastToAll('card', this.currentCard)
    }
  }

  async _winner4(c1, c2, c3, c4) {
    if (c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1) {
      this.gano = "si"
    }
  }

  async _menssagewin(id) {
    if (this.gano == "si") {
      this.socket.broadcastToAll('onWin', {
        user_id: id,
        win: "yes"
      })
    } else {
      this.socket.broadcastToAll('onWin', {
        user_id: id,
        win: "no"
      })
    }
  }
}

module.exports = LoteriaController
