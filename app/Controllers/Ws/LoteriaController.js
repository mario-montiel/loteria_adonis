'use strict'
const BoardCards = use('App/Models/BoardHasCard')
const Card = use('App/Models/Card')
const Game = use('App/Models/Game')
const User = use('App/Models/User')
const Board = use('App/Models/Board')

const shuffle = require('shuffle-array')

var currentCard = { id: 0, name: 'unknown', path: 'unknown' }

class LoteriaController {
  constructor({ socket, request }) {
    this.socket = socket
    this.request = request
    this.gano = "no"
  }

  async onJoin(id) {
    let user = await User.find(id)
    if (!user) { return }

    user.status = 'active'
    await user.save()

    // BROADCAST connected user
    this.socket.broadcast('connUser', user)

    //CREATE BOARD
    const newBoard = new Board();
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
    }

    await this._broadcastBoards(id)

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

        //await this._runTimer()
        let secs = 3
        let interval = setInterval((socket) => {
          secs--
          let activeUsers = User.connected().getCount()
          if (secs == 0 || activeUsers == 10) {
            // The game status could change if users disconnect letting one conncected
            if (game.status == 'preparing') {
              game.status = 'playing'
              game.save()

              activeUsers = User.connected().fetch()

              socket.broadcastToAll('gameStatus', 'START') // START status is an advice
            }

            clearInterval(interval)
          }
          socket.broadcastToAll('timer', secs)
        }, 1000, this.socket)

        //await this._generateCards(game)
        const cards = await Card.all()
        const rdmCards = await shuffle(cards.rows)
        await game.cards().saveMany(rdmCards)

        let interval2 = setInterval(async (socket, _finishGame) => {
          let game = await Game.first()
          let card = await game.cards().first()

          if (!card) {
            let game = await Game.first()
            if (game.status != 'inactive') {
              _finishGame()
              socket.broadcastToAll('onWin', {
                user_id: 0,
                win: "draw"
              })
            }

            clearInterval(interval2)
          }

          currentCard = card
          await game.cards().detach(card.id)

          socket.broadcastToAll('card', card)
        }, 3000, this.socket, this._finishGame);
        //await this._currCardCycle(game)
      }

      if (status == 'playing') {
        this.socket.broadcastToAll('gameStatus', 'playing')
        return
      }

      if (game.status == 'preparing') {
        this.socket.broadcastToAll('gameStatus', 'preparing')
      }
    } else { this.socket.broadcastToAll('gameStatus', 'inactive') }
  }

  async onCardSelect(data) {
    let correctCard = data.card_id == currentCard.id ? true : false
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
    if (!user) { return }

    user.status = 'inactive'
    await user.save()

    this.socket.broadcastToAll('descUser', user)
  }

  async _broadcastBoards(user_id) {
    let user = await User.find(user_id)
    let board = await user.board().with('cards').fetch()
    this.socket.broadcastToAll('boards', board)
  }

  async _generateCards(game) {
    const cards = await Card.all()
    const rdmCards = await shuffle(cards.rows)

    await game.cards().saveMany(rdmCards)
  }

  // Aquí cambia el ciclo de las cartas de en medio :u
  async _currCardCycle(game) {
    let interval = setInterval(cardCycle, 3000, this.socket, this._finishGame);

    function cardCycle(socket, _finishGame) {
      let card = game.cards().first()

      if (!card) {
        let game = Game.first()
        if (game.status != 'inactive') {
          _finishGame()
          socket.broadcastToAll('onWin', {
            user_id: 0,
            win: "draw"
          })
        }

        clearInterval(interval)
      }

      currentCard = card
      game.cards().detach(currentCard.id)

      socket.broadcastToAll('card', currentCard)
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

    currentCard = { id: null, name: 'unknown', path: 'unknown' }

    await BoardCards.truncate()
    await Board.truncate()
  }
}

module.exports = LoteriaController
