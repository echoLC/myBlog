exports.validateName = function validateName (name) {
  return name.length >= 1 && name.length <= 10
}

exports.validateGender = function validateGender (gender) {
  return ['m', 'f', 'x'].indexOf(gender) === -1
}

exports.validateDesc = function validateDesc (desc) {
  return desc.length >= 1 && desc.length <= 30
}

exports.validateRequired = function validateRequired (string) {
  return string !== false && string != null
}

exports.validatePassword = function validatePassword (password) {
  return password.length < 6
}

exports.validatePasswordSame = function validatePasswordSame (password, repassword) {
  return password !== repassword
}

exports.validateException = function validateException (msg) {
  throw new Error(msg)
}

exports.errorMessage = {
  name: '名字请限制在 1-10 个字符',
  gender: '性别只能是 m、f 或 x',
  desc: '个人简介请限制在 1-30 个字符',
  avatar: '请上传你的头像',
  password: '密码至少 6 个字符',
  samePassword: '两次输入密码不一致'
}