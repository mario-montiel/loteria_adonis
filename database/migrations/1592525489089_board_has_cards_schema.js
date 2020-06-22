'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardHasCardsSchema extends Schema {
  up () {
    this.create('board_has_cards', (table) => {
      table.integer('board_id').unsigned().references('id').inTable('board')
      table.integer('cards_id').unsigned().references('id').inTable('cards')
      table.integer('selected')
      table.integer('position')
    })
  }

  down () {
    this.drop('board_has_cards')
  }
}

module.exports = BoardHasCardsSchema
