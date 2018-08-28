const express = require('express')
const checkLogin = require('../middlewares/check').checkLogin
const router = express.Router()

router.post('/', checkLogin, (req, res, next) => {
  res.send('创建留言')
})

router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  res.send('删除留言')
})

module.exports = router