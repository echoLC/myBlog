const express = require('express')
const checkLogin = require('../middlewares/check').checkLogin
const router = express.Router()

router.get('/', (req, res) => {
  res.render('posts')
})

router.post('/create', checkLogin, (req, res, next) => {
  res.send('发表文章')
})

router.get('/create', checkLogin, (req, res, next) => {
  res.send('发表文章')
})

router.get('/:postId', (req, res, next) => {
  res.send('文章详情页')
})

router.post('/:postId/edit', checkLogin, (req, res, next) => {
  res.end('更新文章内容')
})

router.get('/:postId/edit', checkLogin, (req, res, next) => {
  res.end('更新文章内容')
})

router.get(':/postId/remove', checkLogin, (req, res, next) => {
  res.send('删除文章')
})

module.exports = router