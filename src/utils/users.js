const users = []

//addUser

const addUser = ({ id, nickname, room }) => {
    //cleandata
    nickname = nickname.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate Input
    if (!nickname || !room) {
        return {
            error: 'nickname and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.nickname === nickname
    })

    //Validate Username
    if (existingUser) {
        return {
            error: "Nickname already Taken"
        }
    }

    //store user
    const user = { id, nickname, room }
    users.push(user)
    return { user }
}


//removeUser
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//getUser
const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}


//getUsersinRoom
const getUsersinRoom = (room) => {
    return users.filter((user) => user.room === room )
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}