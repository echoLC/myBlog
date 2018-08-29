const marked = require('marked')
const CommentModel = require('../lib/mongo').Comment

CommentModel.plugin('contentToHtml', {
  afterFind: (comments) => {
    return comments.map((comment) => {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

exports.create = function create (comment) {
  return CommentModel.create(comment).exec()
}

exports.getCommentById = function getCommentById (commentId) {
  return CommentModel.findOne({ _id: commentId }).exec()
}

exports.deleteCommentById = function deleteCommentById (commentId) {
  return CommentModel.deleteOne({ _id: commentId }).exec()
}

exports.deleteCommentsByPostId = function deleteCommentsByPostId (postId) {
  return CommentModel.deleteMany({ postId }).exec()
}

exports.getComments = function getComments (postId) {
  return CommentModel.find({ postId })
    .populate({ path: 'author', model: 'User' })
    .sort({ id: 1 })
    .addCreatedAt()
    .contentToHtml()
    .exec()
}

exports.getCommentCount = function getCommentCount (postId) {
  return CommentModel.count({ postId }).exec()
}