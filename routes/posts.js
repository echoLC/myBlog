const express = require('express')
const checkLogin = require('../middlewares/check').checkLogin
const router = express.Router()

const postsModel = require('../models/posts')

router.get('/', (req, res) => {
  const author = req.query.author
  postsModel.getPosts(author).then((posts) => {
    res.render('posts', {
      posts
    })
  }).catch(next)
})

router.get('/create', checkLogin, (req, res, next) => {
  res.render('create')
})

router.post('/create', checkLogin, (req, res, next) => {
  const author = req.session.user._id
  const { title, content } = req.fields

  try {
    if (!title) {
      throw new Error('请填写标题')
    }
    if (!content) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('back')
  }

  const post = {
    title,
    content,
    author,
    createDate: +new Date()
  }

  postsModel.create(post).then((result) => {
    const post = result.ops[0]
    req.flash('success', '发表成功')
    res.redirect(`/posts/${post._id}`)
  }).catch(next)
})

router.get('/:postId', (req, res, next) => {
  const postId = req.params.postId

  Promise.all([
    postsModel.getPostById(postId),
    postsModel.countPv(postId)
  ]).then((result) => {
    const post = result[0]
    if (!post) {
      req.flash('error', '该文章不存在')
      res.redirect('back')
    }
    res.render('post', {
      post
    })
  }).catch(next)
})

router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  postsModel.getRawPostById(postId).then((post) => {
    if (!post) {
      throw new Error('该文章不存在')
    }
    if (author.toString() !== post.author._id.toString()) {
      throw new Error('权限不足')
    }
    res.render('edit', {
      post
    })
  }).catch(next)
})

router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const postId = req.params.postId
  const { title, content } = req.fields
  const author = req.session.user._id

  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题')
    }
    if (!content.length) {
      throw new Error('请填写内容')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel.getRawPostById(postId).then((post) => {
    if (!post) {
      throw new Error('文章不存在')
    }
    if (post.author._id.toString() !== author.toString()) {
      throw new Error('权限不足')
    }
    postsModel.updatePost(postId, { title, content }).then(() => {
      req.flash('success', '更新文章成功')
      
      res.redirect('back')
    }).catch(next)
  })
})

router.get(':/postId/remove', checkLogin, (req, res, next) => {
  const postId = req.params.postId

  PostModel.getRawPostById(postId).then((post) => {
    if (!post) {
      throw new Error('文章不存在')
    }
    if (post.author._id.toString() !== author.toString()) {
      throw new Error('权限不足')
    }
    postsModel.deletePost(postId).then(() => {
      req.flash('success', '删除文章成功')
  
      res.redirect('/posts')
    }).catch(next)
  })
})

module.exports = router