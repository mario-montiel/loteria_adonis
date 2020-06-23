'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UsersHasGamesSchema extends Schema {
  up () {
    this.create('users_has_games', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('game_id').unsigned().references('id').inTable('games')
      table.integer('board_id').unsigned().references('id').inTable('boards')
    })
  }

  down () {
    this.drop('users_has_games')
  }
}

module.exports = UsersHasGamesSchema
