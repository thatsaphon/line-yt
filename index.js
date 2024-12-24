const express = require('express')
const app = express()
require('dotenv').config()

const line = require('@line/bot-sdk')

const util = require('util')
const fs = require('fs')
const path = require('path')
const { pipeline } = require('stream')

const Tesseract = require('tesseract.js')

app.use(express.static(path.join(__dirname, 'download')))

const config = {
  channelAccessToken: process.env.token,
  channelSecret: process.env.secretcode,
}
app.get('/', (req, res) => res.send('Express on Vercel'))
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all([req.body.events.map(handleEvents)]).then((result) =>
    res.json(result)
  )
})

const client = new line.Client(config)

async function handleEvents(event) {
  console.log(event.type)

  if (event.type == 'message') {
    console.log(event.message.text)
    if (event.message.text == 'getid2') {
      return client.replyMessage(event.replyToken, [
        {
          type: 'text',
          text: `HI YOUUU`,
        },
      ])
    }
  }

  /*if (event.type === 'postback') {

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

                const imagePath = `download/${event.message.id}.jpg`;
                Tesseract.recognize(imagePath, 'tha+eng')
                    .then( ( { data: { text }}) => {
                        //console.log(text);
                        //let thai = text.match(/[ก-๛a-zA-Z ]+/g);
                        let number = text.match(/[0-9]+/g)
                        //console.log(number);

                        return client.replyMessage(event.replyToken, [
                            {
                                "type": "text",
                                "text": `${number}`
                            }
                        ])
                    })
                

                

            }

        } else {

            return client.replyMessage(event.replyToken, [
                {
                    "type": "imagemap",
                    "baseUrl": "https://2323-2403-6200-88a0-a6c6-30af-e42d-eacb-4d5e.ngrok-free.app/476521096787526059.jpg?version=",
                    "altText": "ข้อความที่ต้องการให้แสดงหน้า LINE",
                    "baseSize": {
                      "width": 1040,
                      "height": 1040
                    },
                    "actions": [
                      {
                        "type": "message",
                        "area": {
                          "x": 0,
                          "y": 0,
                          "width": 469,
                          "height": 434
                        },
                        "text": "Click SCB"
                      },
                      {
                        "type": "message",
                        "area": {
                          "x": 494,
                          "y": 0,
                          "width": 546,
                          "height": 453
                        },
                        "text": "Click cardX"
                      },
                      {
                        "type": "message",
                        "area": {
                          "x": 3,
                          "y": 457,
                          "width": 1037,
                          "height": 288
                        },
                        "text": "คลิกตรงกลาง"
                      },
                      {
                        "type": "uri",
                        "area": {
                          "x": 0,
                          "y": 760,
                          "width": 1040,
                          "height": 280
                        },
                        "linkUri": "https://www.google.com"
                      }
                    ]
                  }
            ])
        }
    }
    */
}

async function downloadcontent(mid, downloadpath) {
  const stream = await client.getMessageContent(mid)

  const piplineSync = util.promisify(pipeline)

  const folder_download = fs.createWriteStream(downloadpath)

  await piplineSync(stream, folder_download)
}

app.get('/', (req, res) => {
  res.send('ok')
})

app.listen(8888, () => console.log('start server on port 8888'))
