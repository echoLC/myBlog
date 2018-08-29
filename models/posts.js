const marked = require('marked')

const Post = require('../lib/mongo').Post
const CommentModel = require('./comments')

// 将post的content从markdown转换成html
Post.plugin('contentToHtml', {
  afterFind: (posts) => {
    return posts.map((post) => {
      post.content = marked(post.content)
      return post
    })
  },
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content)
    }
    return post
  }
})

Post.plugin('addCommentsCount', {
  afterFind: (posts) => {
    return Promise.all(posts.map((post) => {
      return CommentModel.getCommentCount(post._id).then((count) => {
        post.commentsCount = count
        return post
      })
    }))
  },
  afterFindOne: (post) => {
    if (post) {
      return CommentModel.getCommentCount(post._id).then((count) => {
        post.commentsCount = count
        return post
      })
    }
    return post
  }
})

exports.create = function create (post) {
  return Post.create(post).exec()
}

exports.getPostById = function getPostById (postId) {
  return Post.findOne({ _id: postId })
    .populate({ path: 'author', model: 'User' })
    .addCreatedAt()
    .addCommentsCount()
    .contentToHtml()
    .exec()
}

exports.getPosts = function getPosts (author) {
  const query = {}
  if (author) {
    query.author = author
  }
  return Post.find(query)
    .populate({ path: 'author', model: 'User' })
    .sort({ _id: -1 })
    .addCreatedAt()
    .addCommentsCount()
    .contentToHtml()
    .exec()
}

exports.countPv = function countPv(postId) {
  return Post.update({ _id: postId }, { $inc: { pv: 1 } }).exec()
}

exports.getRawPostById = function getRawPostById (postId) {
  return Post.findOne({ _id: postId }).populate({ path: 'author', model: 'User' }).exec()
}

exports.updatePost = function updatePost (postId, data) {
  return Post.update({ _id: postId }, { $set: data }).exec()
}

exports.deletePost = function deletePost (postId, author) {
  return Post.deleteOne({ _id: postId, author })
    .exec().then((res) => {
      if (res.result.ok && res.result.n > 0) {
        return CommentModel.deleteCommentsByPostId(postId)
      }
    })
}
