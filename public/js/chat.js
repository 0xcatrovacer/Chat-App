const socket = io()

//Elements
const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#sendLoc')
const $messages = document.querySelector('#messages')


//Templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML

const locationTemplate = document.querySelector('#locationTemplate').innerHTML


//Options
const { nickname, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location) => {
    console.log(location)
    const locHTML = Mustache.render(locationTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format('hh:mm:a')
    })
    $messages.insertAdjacentHTML('beforeend', locHTML)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message Delivered!')
    })
})


$sendLocationButton.addEventListener('click', () => {

    $sendLocationButton.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation) {
        return alert('Geolocation is not Supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {

        let locationmsg = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', locationmsg, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})

socket.emit('join', { nickname, room })