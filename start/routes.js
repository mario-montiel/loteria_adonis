'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
| Documentation: http://adonisjs.com/docs/4.1/routing
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('', () => {
  return {
    greeting: "Hello, I'm a loteria API"
  }
})

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('signup', 'AuthController.signup').middleware('auth')
  Route.get('logout', 'AuthController.logout').middleware('auth')

  Route.get('users/active', 'UserController.usersActive')/*.middleware('auth')*/
}).prefix('api')
