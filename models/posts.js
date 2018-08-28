const Post = require('../lib/mongo').Post
const marked = require('marked')

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

exports.create = function create (post) {
  return Post.create(post).exec()
}

exports.getPostById = function getPostById (postId) {
  return Post.findOne({ _id: postId })
    .populate({ path: 'author', model: 'User' })
    .addCreatedAt()
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
    .addCreatedAt()
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

exports.deletePost = function deletePost (postId) {
  return Post.deleteOne({ _id: postId }).exec()
}
