const emoji = require('markdown-it-emoji')
const twemoji = require('twemoji')
const mila = require('markdown-it-link-attributes')
const mili = require('markdown-it-linkify-images')
const misi = require('markdown-it-imsize')
const md = require('markdown-it')('zero', {
  linkify: true
}).enable(['emphasis', 'linkify', 'image'])

md
  .use(emoji)
  .use(misi, { autofill: true })
  .use(mili, {
    target: '_blank',
    imgClass: 'message-image'
  })
  .use(mila, {
    attrs: {
      target: '_blank',
      rel: 'nooponer'
    }
  })

md.renderer.rules.emoji = function(token, idx) {
  return twemoji.parse(token[idx].content)
}

module.exports = { md }
