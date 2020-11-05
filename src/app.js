const path = require('path')
const http = require('http')

const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
const { generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))



let welcmsg = 'Welcome to the Chat!'
let disconnectmsg = 'A user has left'


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ nickname, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage(`Welcome to the chatroom ${room}, ${nickname}`))
        socket.to(room).broadcast.emit('message', generateMessage(`${nickname} has joined`))
    })

    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }

        io.emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage(disconnectmsg))
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))

        callback()
    })
})

server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})