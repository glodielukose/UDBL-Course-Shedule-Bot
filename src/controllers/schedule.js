const axios = require('axios')
const date = require("../utils/date")
const path = require('path')
const fs = require('fs')


const outputDir = path.join(process.env.HOME, 'Documents', 'Horaires')


exports.downloadShedule = async (url) => {
  try {
    if(!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {recursive: true})
    }
  
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })

    const scheduleName = date.convertDate(response.data.rawHeaders[1])
    const outputShedule = path.join(outputDir, `${scheduleName}.pdf`)
    
    const outputStream = fs.createWriteStream(outputShedule)
    response.data.pipe(outputStream)

    return new Promise ((resolve, reject) => {
      outputStream.on('finish', resolve({
          msg: "the shedule has not downloaded", 
          outputShedule ,
          data: response.data,
          date: response.data.rawHeaders[1]
        })
      )
      outputStream.on('error', reject("the shedule has not downloaded"))
    })

    

  } catch (error) {
    console.log(error.message)
  }
}