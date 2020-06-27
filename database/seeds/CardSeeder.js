'use strict'

/*
|--------------------------------------------------------------------------
| CardSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const db = use('Database')

class CardSeeder {
  static async run() {
    await db.table('cards').insert([{
      'id': '40',
      'name': 'alacran',
      'path': 'img/cards/alacran.png'
    },
    {
      'id': '38',
      'name': 'apache',
      'path': 'img/cards/apache.png'
    },
    {
      'id': '33',
      'name': 'arania',
      'path': 'img/cards/arania.png'
    },
    {
      'id': '10',
      'name': 'arbol',
      'path': 'img/cards/arbol.png'
    },
    {
      'id': '53',
      'name': 'arpa',
      'path': 'img/cards/arpa.png'
    },
    {
      'id': '16',
      'name': 'bandera',
      'path': 'img/cards/bandera.png'
    },
    {
      'id': '17',
      'name': 'bandolon',
      'path': 'img/cards/bandolon.png'
    },
    {
      'id': '9',
      'name': 'barril',
      'path': 'img/cards/barril.png'
    },
    {
      'id': '25',
      'name': 'borracho',
      'path': 'img/cards/borracho.png'
    },
    {
      'id': '22',
      'name': 'bota',
      'path': 'img/cards/bota.png'
    },
    {
      'id': '8',
      'name': 'botella',
      'path': 'img/cards/botella.png'
    },
    {
      'id': '42',
      'name': 'calavera',
      'path': 'img/cards/calavera.png'
    },
    {
      'id': '30',
      'name': 'camaron',
      'path': 'img/cards/camaron.png'
    },
    {
      'id': '43',
      'name': 'campana',
      'path': 'img/cards/campana.png'
    },
    {
      'id': '4',
      'name': 'catrin',
      'path': 'img/cards/catrin.png'
    },
    {
      'id': '36',
      'name': 'cazo',
      'path': 'img/cards/cazo.png'
    },
    {
      'id': '48',
      'name': 'chalupa',
      'path': 'img/cards/chalupa.png'
    },
    {
      'id': '27',
      'name': 'corazon',
      'path': 'img/cards/corazon.png'
    },
    {
      'id': '47',
      'name': 'corona',
      'path': 'img/cards/corona.png'
    },
    {
      'id': '24',
      'name': 'cotorro',
      'path': 'img/cards/cotorro.png'
    },
    {
      'id': '3',
      'name': 'dama',
      'path': 'img/cards/dama.png'
    },
    {
      'id': '2',
      'name': 'diablo',
      'path': 'img/cards/diablo.png'
    },
    {
      'id': '7',
      'name': 'escalera',
      'path': 'img/cards/escalera.png'
    },
    {
      'id': '35',
      'name': 'estrella',
      'path': 'img/cards/estrella.png'
    },
    {
      'id': '1',
      'name': 'gallo',
      'path': 'img/cards/gallo.png'
    },
    {
      'id': '19',
      'name': 'garza',
      'path': 'img/cards/garza.png'
    },
    {
      'id': '13',
      'name': 'gorrito',
      'path': 'img/cards/gorrito.png'
    },
    {
      'id': '31',
      'name': 'jaras',
      'path': 'img/cards/jaras.png'
    },
    {
      'id': '23',
      'name': 'luna',
      'path': 'img/cards/luna.png'
    },
    {
      'id': '52',
      'name': 'maceta',
      'path': 'img/cards/maceta.png'
    },
    {
      'id': '21',
      'name': 'mano',
      'path': 'img/cards/mano.png'
    },
    {
      'id': '11',
      'name': 'melon',
      'path': 'img/cards/melon.png'
    },
    {
      'id': '14',
      'name': 'muerte',
      'path': 'img/cards/muerte.png'
    },
    {
      'id': '37',
      'name': 'mundo',
      'path': 'img/cards/mundo.png'
    },
    {
      'id': '32',
      'name': 'musico',
      'path': 'img/cards/musico.png'
    },
    {
      'id': '26',
      'name': 'negrito',
      'path': 'img/cards/negrito.png'
    },
    {
      'id': '39',
      'name': 'nopal',
      'path': 'img/cards/nopal.png'
    },
    {
      'id': '20',
      'name': 'pajaro',
      'path': 'img/cards/pajaro.png'
    },
    {
      'id': '51',
      'name': 'palma',
      'path': 'img/cards/palma.png'
    },
    {
      'id': '5',
      'name': 'paraguas',
      'path': 'img/cards/paraguas.png'
    },
    {
      'id': '15',
      'name': 'pera',
      'path': 'img/cards/pera.png'
    },
    {
      'id': '50',
      'name': 'pescado',
      'path': 'img/cards/pescado.png'
    },
    {
      'id': '49',
      'name': 'pino',
      'path': 'img/cards/pino.png'
    },
    {
      'id': '54',
      'name': 'rana',
      'path': 'img/cards/rana.png'
    },
    {
      'id': '41',
      'name': 'rosa',
      'path': 'img/cards/rosa.png'
    },
    {
      'id': '28',
      'name': 'sandia',
      'path': 'img/cards/sandia.png'
    },
    {
      'id': '6',
      'name': 'sirena',
      'path': 'img/cards/sirena.png'
    },
    {
      'id': '46',
      'name': 'sol',
      'path': 'img/cards/sol.png'
    },
    {
      'id': '34',
      'name': 'soldado',
      'path': 'img/cards/soldado.png'
    },
    {
      'id': '29',
      'name': 'tambor',
      'path': 'img/cards/tambor.png'
    },
    {
      'id': '12',
      'name': 'valiente',
      'path': 'img/cards/valiente.png'
    },
    {
      'id': '45',
      'name': 'venado',
      'path': 'img/cards/venado.png'
    },
    {
      'id': '18',
      'name': 'violoncello',
      'path': 'img/cards/violoncello.png'
    },
    ]);
  }
}

module.exports = CardSeeder
