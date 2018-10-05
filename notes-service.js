const axios = require('axios')

const BASE_URL = 'http://localhost:4000/api'
const url = path => BASE_URL + path

axios.interceptors.response.use(res => res.data.data, err => err)

module.exports = {
  create: (content, tags) =>
    axios({
      url: url('/notes'),
      method: 'post',
      data: { note: { content, tags: tags || [] } },
    }),
  list: () =>
    axios({
      url: url('/notes'),
      method: 'get',
    }),
  read: noteId =>
    axios({
      url: url(`/notes/${noteId}`),
      method: 'get',
    }).catch(e => {
      if (e.res) {
        if (e.res.status === 404) return null
        else console.error('Unexpected error!')
      }
    }),
  update: (noteId, content, tags) =>
    axios({
      url: url(`/notes/${noteId}`),
      method: 'patch',
      data: { note: { content, tags } },
    }),
  delete: noteId =>
    axios({
      url: url(`/notes/${noteId}`),
      method: 'delete',
    }),
}
