const notesService = require('./notes-service')
const {
  getNoteExcerpt,
  promptUser,
  requestContentFromEditor,
  clearTmpFile,
  populateTmpFile,
  parseTags,
  prettyPrintNote,
} = require('./helpers')

const withNoteIdCheck = func => ([noteId]) => {
  if (!noteId) return console.error('You need to pass the note id, i.e. notes read 1')
  else func(noteId)
}

const genericErrorHandler = e => {
  console.log('Something went wrong...')
  if (e.response && e.response.data) console.error(e.response.data.message)
  else console.error(e)
}

const listNotes = async () => {
  const notes = await notesService.list()
  console.log('------------------------------------\n')
  notes.forEach(note => {
    prettyPrintNote(note)
    console.log('====================================\n')
  })
}

const createNote = async () => {
  const content = await requestContentFromEditor()
  const tagsStr = await promptUser('Enter a comma-seperated list of tags: ')
  const tags = parseTags(tagsStr)
  console.log('Creating...')
  try {
    const note = await notesService.create(content, tags)
    console.log('Created successfully!')
    prettyPrintNote(note)
    clearTmpFile()
  } catch (e) {
    genericErrorHandler(e)
  }
}

const readNote = async noteId => {
  const note = await notesService.read(noteId)
  if (!note) return console.error(`Note ID ${noteId} not found!`)
  prettyPrintNote(note)
}

const updateNote = async noteId => {
  const note = await notesService.read(noteId)
  if (!note) return console.error(`Note id ${noteId} not found!`)
  populateTmpFile(note.content)
  const newContent = await requestContentFromEditor()
  const tags = await promptUser('Do you want to update tags? y/n: ').then(answer => {
    if (answer === 'y') return promptUser('Enter new tags: ').then(parseTags)
    else return note.tags
  })

  try {
    const updatedNote = await notesService.update(noteId, newContent, tags)
    console.log('Updated successfully!')
    prettyPrintNote(updatedNote)
  } catch (e) {
    genericErrorHandler(e)
  }
}

const deleteNote = async noteId => {
  const answer = await promptUser(`Do you really want to remove note id ${noteId}? y/n: `)
  if (answer === 'y') {
    console.log('Deleting...')
    try {
      await notesService.delete(noteId)
      console.log(`Note id ${noteId} deleted successfully!`)
    } catch (e) {
      genericErrorHandler(e)
    }
  } else console.log('Deleting cancelled.')
}

module.exports = {
  ls: listNotes,
  create: createNote,
  show: readNote,
  update: updateNote,
  delete: deleteNote,
}
