const cheerio = require("cheerio")
const fs = require('fs')

async function parseProducts() {
    try {
        const response = await fetch("https://sergodevlogs.github.io/lab_num_4.github.io/#")
        const html = await response.text()
        const cheriTree = cheerio.load(html)
        const products = []

        const totalCards = cheriTree('.container .card').length

        for (let i = 0; i < totalCards; i++) {
            const card = cheriTree(cheriTree('.container .card')[i])
            
            const price = card.find('.price').text().trim()
            const brand = card.find('.underprice .title').text().trim()
            const description = card.find('.underprice .desc').text().trim()
            const overlayText = card.find('.image-container .overlay .overlay-title').text().trim()
            const overlayTextDesc = card.find('.image-container .overlay .overlay-text').text().trim()
            
            let imagePath = null
            const imageUrl = card.find('img.photo').attr('src')
            
            if (imageUrl) {
                try {
                    let fullImageUrl
                    if (imageUrl.startsWith('/')) {
                        fullImageUrl = 'https://sergodevlogs.github.io' + imageUrl
                    } else if (!imageUrl.startsWith('http')) {
                        fullImageUrl = 'https://sergodevlogs.github.io/lab_num_4.github.io/' + imageUrl
                    } else {
                        fullImageUrl = imageUrl
                    }
                    
                    
                    if (!fs.existsSync('images')) {
                        fs.mkdirSync('images')
                    }
                    
                    const imageResponse = await fetch(fullImageUrl)
                    const arrayBuffer = await imageResponse.arrayBuffer()
                    const imgBuf = Buffer.from(arrayBuffer)
                    
                    const fileName = `images/image${i + 1}.jpg`
                    fs.writeFileSync(fileName, imgBuf)
                    imagePath = fileName 
                } catch (error) {
                    console.log(`Не удалось скачать изображение ${i}: ${error.message}`)
                }
            }
            
            products.push({
                price: price,
                brand: brand,
                description: description,
                imagePath: imagePath,
                imageUrl: imageUrl,
                overlay: overlayText,
                overlayDescription: overlayTextDesc
            })
        }

        fs.writeFileSync('products.json', JSON.stringify(products, null, 2))
        
        return products
        
    } catch (error) {
        console.error('Ошибка парсинга:', error.message)
        return
    }
}

parseProducts()