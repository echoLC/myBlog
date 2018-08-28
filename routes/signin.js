const express = require('express')
const router = express.Router()
const sha1  =require('sha1')

const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModel = require('../models/users')

router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin')
})

router.post('/', checkNotLogin, (req, res, next) => {
  const { name, password } = req.fields
  
  try {
    if (!name.length) {
      throw new Error('请填写用户名')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  UserModel.getUserByName(name).then((user) => {
    if (!user) {
      req.flash('error', '用户不存在')
      return res.redirect('back')
    }
    // 检查密码是否匹配
    if (sha1(password) !== user.password) {
      req.flash('error', '用户名或密码错误')
      return res.redirect('back')
    }

    req.flash('success', '登录成功')

    // 将用户信息存入session
    delete user.password
    req.session.user = user

    res.redirect('/posts')
  }).catch(next)
})

module.exports = router