'use strict'
const User = use('App/Models/User')
const Game = use('App/Models/Game')
const Card = use('App/Models/Card')
//const Board = use('App/Models/BoardHasCards')
const shuffle = require('shuffle-array')
const Board = use('App/Models/Board')

class PruebonController {
  async board() {
    const card = await Card.all()
    const shuffleCards = shuffle(card.rows)
    const extractCards = shuffleCards.pop()
    return extractCards;
  }
  async userBoard(id) {
    const board = new Board();
    let findUser = await board.user().find(id);
    return findUser;
  }
}

module.exports = PruebonController
