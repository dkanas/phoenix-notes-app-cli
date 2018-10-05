const path = require('path')

const EDITOR = process.env.EDITOR || 'vi'
const TMP_FILE_PATH = path.join(__dirname, '.tmp')

module.exports = {
  EDITOR,
  TMP_FILE_PATH,
}
