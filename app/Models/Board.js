'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Board extends Model {
  user () { return this.belongsTo('App/Models/User') }
  boardhascard(){return this.hasMany('App/Models/BoardHasCard')}

	static get createdAtColumn() { return null }
	static get updatedAtColumn() { return null }
}

module.exports = Board
