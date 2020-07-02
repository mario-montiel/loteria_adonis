'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GamesHasCardsSchema extends Schema {
  up () {
    this.create('games_has_cards', (table) => {
    	table.increments()
    	table.integer('game_id').unsigned().references('id').inTable('games')
      table.integer('card_id').unsigned().references('id').inTable('cards')
      table.string('status', 10).defaultTo('pending') // has_passed | pending | current
    })
  }

  down () {
    this.drop('games_has_cards')
  }
}

module.exports = GamesHasCardsSchema
