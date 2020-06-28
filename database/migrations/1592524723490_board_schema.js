'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardSchema extends Schema {
  up () {
    this.create('boards', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
    })
  }

  down () {
    this.drop('boards')
  }
}

module.exports = BoardSchema
