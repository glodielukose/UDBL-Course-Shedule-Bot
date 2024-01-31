const bot = require('./src/configs/telegramBot')
const shedule = require('./src/controllers/schedule')
const fs = require('fs')

const url = process.env.URL_OF_URL

shedule.downloadShedule(url)
.then((res) => {
  console.log(res.msg)

  
  const pdf = fs.ReadStream(res.outputShedule)

  bot.on ('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;
    if (messageText === '/start') {
        bot.sendDocument (chatId, pdf, {caption: `${res.date}`}, {contentType: 'application/pdf'});
        fs.unlinkSync(res.outputShedule)
    }
  })
})
.catch((err) => {
  console.log(err)
})

