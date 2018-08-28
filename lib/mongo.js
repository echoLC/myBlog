const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongoInstance = new Mongolass()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')

mongoInstance.connect(config.mongodb)

// 创建用户collection
exports.User = mongoInstance.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  desc: { type: 'string', required: true }
})

exports.User.index({ name: 1 }, { unique: true }).exec()  // 根据用户名找到用户， 用户名唯一

// 根据id生成创建时间
mongoInstance.plugin('addCreatedAt', {
  afterFind: (results) => {
    return results.forEach(element => {
      element.created_at = moment(objectIdToTimestamp(element._id)).format('YYYY-MM-DD HH:mm')
      return element
    })
  },
  afterFindOne: (result) => {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm')
    }
    return result
  }
})