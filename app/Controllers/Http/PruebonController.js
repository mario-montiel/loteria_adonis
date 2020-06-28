'use strict'
const User = use('App/Models/User')
const Game = use('App/Models/Game')
const Card = use('App/Models/Card')
//const Board = use('App/Models/BoardHasCards')
const shuffle = require('shuffle-array')
const Board = require('../../Models/Board')

const card;
class PruebonController {
  async board() {
    const card = await Card.all()
    const shuffleCards = shuffle(card.rows)
    const extractCards = shuffleCards.pop()
    const board = new Board();
    //let findUser = await Board.query().user().find();
    return extractCards;
  }
}

module.exports = PruebonController
