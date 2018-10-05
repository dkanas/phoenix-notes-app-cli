const readline = require('readline')
const child_process = require('child_process')
const fs = require('fs')

const config = require('./config')

const spawnEditor = (editorCommand, filePath) =>
  child_process.spawn(editorCommand, [filePath], { stdio: 'inherit' })

const requestContentFromEditor = () =>
  new Promise(resolve => {
    const editor = spawnEditor(config.EDITOR, config.TMP_FILE_PATH)
    editor.on('close', () => {
      const content = fs.readFileSync(config.TMP_FILE_PATH, { encoding: '' })
      resolve(content.toString())
    })
  })

const getNoteExcerpt = content => (content.length <= 140 ? content : content.substring(0, 140))

const clearTmpFile = () => fs.unlinkSync(config.TMP_FILE_PATH)

const populateTmpFile = content => fs.writeFileSync(config.TMP_FILE_PATH, content)

const promptUser = question =>
  new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(question, answer => {
      resolve(answer)
      rl.close()
    })
  })

const parseTags = tagsStr => tagsStr.split(/[^a-zA-Z\- ]+/).map(t => t.trim().replace(' ', '-'))

const prettyPrintNote = note => {
  console.log('ID:', note.id)
  console.log('Tags:', note.tags.join(', '))
  console.log('Content:\n' + note.content)
}

module.exports = {
  getNoteExcerpt,
  promptUser,
  spawnEditor,
  requestContentFromEditor,
  clearTmpFile,
  populateTmpFile,
  parseTags,
  prettyPrintNote,
}
