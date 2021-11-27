const books = require('google-books-search');
const express = require('express')
const pug = require('pug')

const app = express()
app.set('view engine', 'pug');
app.set('views', 'public/')
app.use(express.static('public/'))

async function searchForBooks(name, page=0) {
    return new Promise((resolve, reject) => {
        var found = []
        var options = {
            offset: page*40,
            limit: 40,
            type: 'books',
            lang: 'fr'
        }
        
        books.search(name, options, (error, results) => {
            if ( ! error ) {
                const list = results.filter(x => x.title.toLowerCase().startsWith(name.toLowerCase()))
                resolve(list)
            } else
                reject()
        })
    })
}

async function getList(name) {
    let items = [], page = 0
    
    do {
        var pageItems = await searchForBooks(name, page)
        items = items.concat(pageItems)
        page++;
    } while(pageItems.length > 0)

    return items.sort((a,b) => a.title.localeCompare(b.title))
}

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/getmanga/:query', async (req, res) => {
    const mangaResults = await getList(req.params.query)
    res.json(mangaResults)//.filter(x => x.categories != undefined))
})

app.listen(3000, () => {
    console.log("app online : http://localhost:3000")
})