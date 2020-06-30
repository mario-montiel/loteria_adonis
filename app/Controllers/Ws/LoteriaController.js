'use strict'
const BoardCards = use('App/Models/BoardHasCard')
const Card = use('App/Models/Card')
const Game = use('App/Models/Game')
const User = use('App/Models/User')
const Board = use('App/Models/Board')

const shuffle = require('shuffle-array')

class LoteriaController {
  constructor({
    socket,
    request
  }) {
    this.socket = socket
    this.request = request
    this.gano = "no"
    this.currentCard = {
      id: 0,
      name: 'unknown',
      path: 'unknown'
    }
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

    //CREATE BOARD
    /*const newBoard = new Board();
    newBoard.user_id = id;
    await newBoard.save();
    const card = await Card.all()
    const shuffleCards = shuffle(card.rows)

    for (let i = 0; i <= 15; i++) {
      const extractCard = shuffleCards.pop()
      const boardHasCards = new BoardCards();
      boardHasCards.board_id = newBoard.id;
      boardHasCards.card_id = await extractCard.id
      boardHasCards.position = i;
      boardHasCards.save();
    }*/
    let game = await Game.first()

    if (!game) {
      game = await new Game()
      game.status = 'inactive'
      await game.save()
    }

    let activeUsers = await User.connected().getCount()

    if (activeUsers > 1) {
      let status = game.status

      if (status == 'inactive') {
        game.status = 'preparing'
        await game.save()
        let secs = 30
        let interval = setInterval(function (socket) {
          secs--
          if (secs == 0) {
            clearInterval(interval)
            game =  Game.find(game.id)
            if (game.status == 'preparing') {
              game.status = 'playing'
              await game.save()

              activeUsers = await User.connected().fetch()

              this.socket.broadcastToAll('gameStatus', 'START') // START status is an advice

              //await this._generateCards(game)
              //await this._broadcastBoards()
              //await this._currCardCycle(game)
            }
          }
          socket.broadcastToAll('timer', secs)
        }, 1000, this.socket)

        //await this._runTimer()
        let secs = 3
        let interval = setInterval(function (socket) {
          secs--
          let activeUsers = User.connected().getCount()
          if (secs == 0 || activeUsers == 10) {
            // The game status could change if users disconnect letting one conncected
            if (game.status == 'preparing') {
              game.status = 'playing'
              game.save()

              activeUsers = User.connected().fetch()

              socket.broadcastToAll('gameStatus', 'START') // START status is an advice

              //await this._generateCards(game)
              //await this._broadcastBoards()
              //await this._currCardCycle(game)
            }

            clearInterval(interval)
          }
          socket.broadcastToAll('timer', secs)
        }, 1000, this.socket)
      }

      if (status == 'playing') {
        this.socket.broadcastToAll('gameStatus', 'playing')
        return
      }

      if (game.status == 'preparing') {
        this.socket.broadcastToAll('gameStatus', 'preparing')
      }
    } else {
      this.socket.broadcastToAll('gameStatus', 'inactive')
    }
  }

  async onCardSelect(data) {
    let correctCard = data.card_id == this.currentCard.id ? true : false
    let board = await BoardCards.query().where('board_id', data.board_id)
      .andWhere('card_id', data.card_id).first()
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
        this._messagewin(quien.id)
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
          this._finishGame()
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
                            this._messagewin(quien.id)
                          }
                        } else {
                          this._messagewin(quien.id)
                        }
                      } else {
                        this._messagewin(quien.id)
                      }
                    } else {
                      this._messagewin(quien.id)
                    }
                  } else {
                    this._messagewin(quien.id)
                  }
                } else {
                  this._messagewin(quien.id)
                }
              } else {
                this._messagewin(quien.id)
              }
            } else {
              this._messagewin(quien.id)
            }
          } else {
            this._messagewin(quien.id)
          }
        } else {
          this._messagewin(quien.id)
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

    this.socket.broadcastToAll('descUser', user)
  }

  /*async _broadcastBoards(user_id) {
    let user = await User.find(user_id)
    let board = await user.board().with('cards').fetch()
    this.socket.broadcastToAll('boards', board)
  }*/

  /*_runTimer(game_id) {
    let secs = 30
    let interval = setInterval(function (socket) {
      secs--
      if (secs == 0) {
        clearInterval(interval)
      }
      socket.broadcastToAll('timer', secs)
    }, 1000, this.socket)
  }*/

  async _generateCards(game) {
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
        let game = Game.first()
        if (game.status != 'inactive') {
          this._finishGame()
          this.socket.broadcastToAll('onWin', {
            user_id: 0,
            win: "draw"
          })
        }

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

  async _messagewin(id) {
    if (this.gano == "si") {
      this.socket.broadcastToAll('onWin', {
        user_id: id,
        win: "yes"
      })
      this._finishGame()
    } else {
      this.socket.broadcastToAll('onWin', {
        user_id: id,
        win: "no"
      })
    }
  }

  async _finishGame() {
    let game = await Game.first()
    game.status = 'inactive'
    await game.save()
    await game.cards().detach()

    this.currentCard = {
      id: null,
      name: 'unknown',
      path: 'unknown'
    }

    await BoardCards.truncate()
    await Board.truncate()
  }
}

module.exports = LoteriaController
