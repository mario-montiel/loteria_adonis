'use strict'
const User = use('App/Models/User')
const Game = use('App/Models/Game')
const Card = use('App/Models/Card')
const BoardHasCard = use('App/Models/BoardHasCard')
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
  async userBoard() {
    const activeUsers = await User.query().where('status', 'active').fetch()
    //console.log(activeUsers.rows[0].id)
    const idActiveUser = activeUsers.rows[0].id
    console.log(idActiveUser);
    const newBoard = new Board();
    newBoard.user_id = idActiveUser;
    await newBoard.save();

  }
  //un ciclo con los usuarios
  async boardHasCards() {

    const activeUsers = await User.query().where('status', 'active').fetch()
    //console.log(activeUsers.rows[0].id)
    const idActiveUser = activeUsers.rows[0].id
    const idBoard = await Board.last(); //la última carta
    const aux = await idBoard.id

    for (let i = 0; i <= 15; i++) {
      const card = await Card.all()
      const shuffleCards = shuffle(card.rows)
      const extractCards = shuffleCards.pop()

      const boardHasCards = new BoardHasCard();
      boardHasCards.board_id = aux;
      boardHasCards.card_id = await extractCards.id
      boardHasCards.selected = 0;
      boardHasCards.position = i;
      boardHasCards.save();
    }

  }
}

module.exports = PruebonController
