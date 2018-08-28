const express = require('express')
const checkLogin = require('../middlewares/check').checkLogin
const router = express.Router()

router.get('/', checkLogin, (req, res, next) => {
  req.session.user = null
  req.flash('success', '登出成功')
  res.redirect('/posts')
})

module.exports = router