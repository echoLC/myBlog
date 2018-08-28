const User = require('../lib/mongo').User

exports.create = function create (user) {
  return User.create(user).exec()
}

exports.getUserByName = function getUserByName (name) {
  return User.findOne({ name }).addCreatedAt().exec()
}