const generateMessage = (nickname, text) => {
    return {
        nickname: nickname,
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (nickname, url) => {
    return {
        nickname: nickname,
        url: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}