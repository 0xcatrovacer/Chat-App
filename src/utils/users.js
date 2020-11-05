const users = []

//addUser

const addUser = ( { id, nickname, room } ) => {
    //cleandata
    nickname = nickname.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate Input
    if (!nickname || !room) {
        return {
            error: 'Username and room are required'
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
    return {user}
}

addUser({
    id: 0703,
    nickname: 'Erudite',
    room: 'Chengramo'
})

console.log(users)
//removeUser

//getUser

//getUsersinRoom