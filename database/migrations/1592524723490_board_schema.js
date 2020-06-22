'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BoardSchema extends Schema {
  up () {
    this.create('boards', (table) => {
      table.increments()
    })
  }

  down () {
    this.drop('boards')
  }
}

module.exports = BoardSchema
