const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const token = '7623791947:AAEoluQq-UhHJF0IGj-ew-sXhVMNfHweP2k';

const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(express.json());
app.use(cors())
const webAppurl = 'https://gorgeous-frangipane-afcd68.netlify.app'
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start'){
     await bot.sendMessage(chatId, 'Welcome to my bot!', {
        reply_markup: {
            keyboard: [
                [{text: 'Input a form', web_app: {url: webAppurl + '/form'}}],
            ]
        }
     });
  }
  if (msg?.web_app_data?.data) {
    try {
        const data = JSON.parse(msg.web_app_data.data); // JSON парсинг

        await bot.sendMessage(chatId, 'Thanks!');
        await bot.sendMessage(chatId, 'Your country: ' + data?.country);
        await bot.sendMessage(chatId, 'Your street: ' + data?.street);
    } catch (e) {
        console.error('Error processing web app data:', e); // Логирование ошибок
    }
}
});
app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch{
        console.error('Error processing web app data:', e);
    }
})
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})