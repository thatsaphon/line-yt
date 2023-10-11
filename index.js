const express = require('express');
const app = express();
require('dotenv').config();

const line = require('@line/bot-sdk');

const util = require('util');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

app.use(express.static(path.join(__dirname,'download')));

const config = {
    channelAccessToken: process.env.token,
    channelSecret: process.env.secretcode
}

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all([
            req.body.events.map(handleEvents)
        ])
        .then((result) => res.json(result))
});

const client = new line.Client(config);

async function handleEvents(event) {

    if (event.type === 'postback') {

        if (event.postback.data == 'M') {
            return client.replyMessage(event.replyToken, [
                {
                    "type": "text",
                    "text": `Choose Man`,
                }
            ]);
        } else {
            return client.replyMessage(event.replyToken, [
                {
                    "type": "text",
                    "text": `Choose Woman`,
                }
            ]);

        }


    } else {

        if (event.message.type == 'image') {

            if (event.message.contentProvider.type === 'line') {
                const dlpath = path.join(__dirname, 'download', `${event.message.id}.jpg`)

                await downloadcontent(event.message.id, dlpath);

                return client.replyMessage(event.replyToken, [
                    {
                        "type": "text",
                        "text": `Download เรียบร้อย`,
                        "quoteToken": event.message.quoteToken
                    }
                ])

            }

        } else {

        
            return client.replyMessage(event.replyToken, [
                {
                    "type": "text",
                    "text": `ท่านเป็นเพศใด กรุณาเลือกด้านล่าง`,
                    "quickReply": {
                        "items": [
                            {
                                "type": "action",
                                "action": {
                                    "type": "postback",
                                    "data": "M",
                                    "label": "ชาย",
                                }
                            },
                            {
                                "type": "action",
                                "action": {
                                    "type": "postback",
                                    "data": "W",
                                    "label": "หญิง",
                                }
                            },
                            {
                                "type": "action",
                                "action": {
                                    "type": "camera",
                                    "label": "เปิดกล้อง",
                                }
                            }
                        ]
                    }
                }
            ])
        }
    }

    

}

async function downloadcontent(mid, downloadpath) {
    const stream =  await client.getMessageContent(mid);

    const piplineSync = util.promisify(pipeline);

    const folder_download = fs.createWriteStream(downloadpath);

    await piplineSync(stream, folder_download);



}

app.get('/', (req, res) => {
    res.send('ok');
})

app.listen(8080, () => console.log('start server on port 8080'));