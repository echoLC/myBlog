const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin
const validator = require('../lib/validator')

router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup')
})

router.post('/', checkNotLogin, (req, res, next) => {
  const { name, gender, desc, password, repassword } = req.fields
  const avatar = req.files.avatar.path.split(path.sep).pop()

  try {
    if (!validator.validateName(name)) {
      validator.validateException(validator.errorMessage('name'))
    }
    if (validator.validateGender(gender)) {
      validator.validateException(validator.errorMessage('gender'))
    }
    if (!validator.validateDesc(desc)) {
      validator.validateException(validator.errorMessage('desc'))
    }
    if (!validator.validateRequired(avatar)) {
      validator.validateException(validator.errorMessage('avatar'))
    }
    if (validator.validatePassword(password)) {
      validator.validateException(validator.errorMessage('password'))
    }
    if (validator.validatePasswordSame(password, repassword)) {
      validator.validateException(validator.errorMessage('password'))
    }
  } catch (e) {
    // 注册失败处理
    fs.unlink(req.files.avatar.path)
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  const newPassword = sha1(password)

  const user = {
    name,
    gender,
    desc,
    avatar,
    password: newPassword
  }

  UserModel.create(user).then((result) => {
    const user = result.ops[0]
    delete user.password
    req.session.user = user
    // 写入flash
    req.flash('success', '注册成功')
    // 注册成功跳转到首页
    res.redirect('/posts')
  }).catch((err) => {
    // 注册失败
    fs.unlink(req.files.avatar.path)
    // 用户名已经存在
    if (e.message.match('duplicate key')) {
      req.flash('error', '用户名已被占用')
      return res.redirect('signup')
    }
    next(e)
  })
})

module.exports = router