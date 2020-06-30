'use strict'
const User = use('App/Models/User')
// const BoardHasCard = use('App/Models/BoardHasCard')

class AuthController {
  async login({ request, auth }) {
    const { email, password } = request.all()

    // if (await auth.attempt(email, password)) {
       let user = await User.findBy('email', email)
       let token = await auth.query().withRefreshToken().attempt(email, password)
       //let token = await auth.attempt(email, password)
       return this._user(token, user)

  }

  async logout() { await auth.logout() }

  async _user(token, user) {
    Object.assign(user, token)
    return user
  }

  async signup({ request, auth }) {
    const data = request.only(['username', 'email', 'password'])

    // looking for user in database
    let user = await User.findBy('username', data.username)
    if (user) return { msg: 'username taken' }

    // looking for email in database
    user = await User.findBy('email', data.email)
    if (user) return { msg: 'email taken' }

    user = await User.create(data)
    let token = await auth.generate(user)

    return this._user(token, user)
  }
}

module.exports = AuthController
