'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardHasCardsSchema extends Schema {
  up () {
    this.create('board_has_cards', (table) => {
      table.increments()
      table.integer('board_id').unsigned().references('id').inTable('boards')
      table.integer('card_id').unsigned().references('id').inTable('cards')
      table.string('selected')
      table.string('position')
    })
  }

  down () {
    this.drop('board_has_cards')
  }
}

module.exports = BoardHasCardsSchema
