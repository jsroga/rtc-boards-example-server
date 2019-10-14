const ShareDB = require('sharedb')
const WebSocket = require('ws')
const WebSocketJSONStream = require('websocket-json-stream')

const share = new ShareDB()

const connection = share.connect()
const doc = connection.get('project', '0')

const initDoc = () => {
  return new Promise(res => doc.create({
    cards: {},
    lists: {}
  }, res))
}

doc.fetch(async err => {
  if (err) throw err

  if (doc.type === null) {
    await initDoc()
    createServer()
  } else {
    createServer()
  }
})

function createServer () {
  const ws = new WebSocket.Server({
    port: 9515
  })
  ws.on('connection', (ws, req) => {
    doc.del()
    initDoc()
    share.listen(new WebSocketJSONStream(ws))
  })
}