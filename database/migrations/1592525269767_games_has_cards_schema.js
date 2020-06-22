'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GamesHasCardsSchema extends Schema {
  up () {
    this.create('games_has_cards', (table) => {
      table.integer('games_id').unsigned().references('id').inTable('games')
      table.integer('cards_id').unsigned().references('id').inTable('cards')
    })
  }

  down () {
    this.drop('games_has_cards')
  }
}

module.exports = GamesHasCardsSchema
