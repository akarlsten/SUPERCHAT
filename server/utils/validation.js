var validateString = str => {
  return typeof str === 'string' && str.trim().length > 0 && str.trim().length < 8192
}

module.exports = { validateString }
