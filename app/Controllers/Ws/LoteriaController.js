'use strict'
const BoardCards = use('App/Models/BoardHasCard')
const Card = use('App/Models/Card')
const Database = use('Database')
const Game = use('App/Models/Game')
const GameCards = use('App/Models/GamesHasCard')
const User = use('App/Models/User')
const Board = use('App/Models/Board')

const shuffle = require('shuffle-array')

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
    const cards = await Card.all()
    const shuffleCards = shuffle(cards.rows)

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

        const cards = await Card.all()
        const rdmCards = await shuffle(cards.rows)
        await game.cards().saveMany(rdmCards)

        let interval2 = setInterval(async (socket, _finishGame) => {
          let card = await game.cards().wherePivot('status', 'pending').first()

          if (!card) {
            let game = await Game.first()
            if (game.status != 'inactive') {
              _finishGame()
              socket.broadcastToAll('onWin', {
                user_id: 0,
                win: "draw"
              })
            }

            await clearInterval(interval2)
            return
          }

          let gameCard = await GameCards.findBy('card_id', card.id)
          gameCard.status = 'has_passed'
          await gameCard.save()

          socket.broadcastToAll('card', card)
        }, 3000, this.socket, this._finishGame);
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

  async onWin(data) {
    let user = await User.find(data.id)
    let board = await Board.findBy('user_id', user.id)
    let boardCards = await board.boardhascard().whereIn('card_id',
      data.selectedCards).fetch()

    let game = await Game.first()
    let passedCards = await game.cards().wherePivot('status', 'has_passed').fetch()

    let validateCards = false
    data.selectedCards.forEach(userCard => {
      validateCards = false

      passedCards.rows.forEach(card => {
        if (userCard == card.id) {
          validateCards = true
        }
      })
    });

    if (!validateCards) {
      this.socket.broadcastToAll('onWin', {
        user_id: data.id,
        username: user.username,
        win: "no"
      })
      return
    }

    let message = 'no'
    switch (data.como) {
      case 'centro':
        if (await this._winResult([5, 6, 9, 10], boardCards, user)) {
          message = 'yes'
        } else { message = 'no' }
        break
      case 'full':
        if (boardCards.rows.length == 16) { message = 'yes' }
        else { message = 'no' }
        break
      case 'loteria':
        if ( // HORIZONTAL
          await this._winResult([0, 1, 2, 3], boardCards) ||
          await this._winResult([4, 5, 6, 7], boardCards) ||
          await this._winResult([8, 9, 10, 11], boardCards) ||
          await this._winResult([12, 13, 14, 15], boardCards) ||
          // VERTICAL
          await this._winResult([0, 4, 8, 12], boardCards) ||
          await this._winResult([1, 5, 9, 13], boardCards) ||
          await this._winResult([2, 6, 10, 14], boardCards) ||
          await this._winResult([3, 7, 11, 15], boardCards) ||
          // DIAGONAL
          await this._winResult([0, 5, 10, 15], boardCards) ||
          await this._winResult([3, 6, 9, 12], boardCards)
        ) {
          message = 'yes'
        } else { message = 'no' }
        break
    }

    if (message == 'yes') { this._finishGame() }

    this._broadcastResult(user, message)
  }

  async _winResult(positions, boardCards) {
    let validate = 0

    await boardCards.rows.forEach(card => {
      if (positions.includes(card.position)) { validate++ }
    })

    if (validate == 4) { return true }

    return false
  }

  async _broadcastResult(user, message) {
    this.socket.broadcastToAll('onWin', {
      user_id: user.id,
      username: user.username,
      win: message
    })
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

  async _finishGame() {
    let game = await Game.first()
    game.status = 'inactive'
    await game.save()
    await game.cards().detach()

    await Database.delete('*').from('board_has_cards')
    await Database.delete('*').from('boards')
  }
}

module.exports = LoteriaController
