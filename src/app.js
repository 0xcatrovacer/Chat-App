const path = require('path')
const http = require('http')

const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
const { generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersinRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))



let welcmsg = 'Welcome to the Chat!'
// let disconnectmsg = 'A user has left'


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ nickname, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, nickname, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', generateMessage(`Welcome to the chatroom ${user.room}, ${user.nickname}`))
        socket.to(user.room).broadcast.emit('message', generateMessage(`${user.nickname} has joined`))

        callback()
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
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.nickname} has left the room`))
        }
    })

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${location.latitude},${location.longitude}`))

        callback()
    })
})

server.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})