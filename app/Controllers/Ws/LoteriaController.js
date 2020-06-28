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
              const idActiveUser = activeUsers.rows[0].id
              console.log(idActiveUser);
              const newBoard = new Board();
              newBoard.user_id = idActiveUser;
              await newBoard.save();

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
<<<<<<< HEAD
    let c1 = 1
    let c2 = 1
    let c3 = 1
    let c4 = 1
    switch(quien.como){
      case 'centro':
        c1 = borcards.rows[5].selected
        c2 = borcards.rows[6].selected
        c3 = borcards.rows[9].selected
        c4 = borcards.rows[10].selected
        this._winner4(c1, c2, c3, c4)
        this._menssagewin(quien.id)
        this.gano = "no"
=======
    switch (quien.como) {
      case 'centro':
        let c1 = borcards.rows[5].selected
        let c2 = borcards.rows[6].selected
        let c3 = borcards.rows[9].selected
        let c4 = borcards.rows[10].selected
        if (c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1) {
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
>>>>>>> 40c123a3753bf33ff74e5a2c0ed544d67190b0c5
        break
      case 'loteria':
        c1 = borcards.rows[0].selected
        c2 = borcards.rows[1].selected
        c3 = borcards.rows[2].selected
        c4 = borcards.rows[3].selected
        this._winner4(c1, c2, c3, c4)
        if(this.gano == "no"){
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
                          if(this.gano == "no"){
                            this._menssagewin(quien.id)
                          }
                        }else{ this._menssagewin(quien.id)}
                      }else{ this._menssagewin(quien.id)}
                    }else{ this._menssagewin(quien.id)}
                  }else{ this._menssagewin(quien.id)}
                }else{ this._menssagewin(quien.id)}
              }else{ this._menssagewin(quien.id)}
            }else{ this._menssagewin(quien.id)}
          }else{ this._menssagewin(quien.id)}
        }else{ this._menssagewin(quien.id)}
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
    const rdmCards = shuffle(cards)
    game.cards().createMany(rdmCards)
  }

  async _winner4(c1, c2, c3, c4){
    if (c1 == 1 && c2 == 1 && c3 == 1 && c4 == 1) {
      this.gano = "si"
    }
  }
  
  async _menssagewin(id){
    if (this.gano == "si") {
      this.socket.broadcastToAll('onWin', {
        user_id: id,
        win: "yes"
      })
    }else{
      this.socket.broadcastToAll('onWin', {
        user_id: id,
        win: "no"
      })
    }
  }
}

module.exports = LoteriaController
