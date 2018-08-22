import express from 'express'
import fs from 'fs'

const app = express()
// middlewares
// ---------------------------------------------------------------------------------

// utiliser la fonction use() avant les autres fonctions. Sinon fonction get() exécutées en premier et use() pas exécutée.
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(function(req,res,next){
    setTimeout(next, 1000)
})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8081");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})

app.use(express.static('public'))

//Routes
let movies
fs.readFile('src/data/movies.json', 'utf8', function (err, data) {
    if (err) throw err
    movies = JSON.parse(data)
})

app.get('/movie', (req, res) => {
    res.send(movies.map(movie => {
        return {
            id: movie.id,
            title: movie.title,
            url: movie.url,
            autre: movie.autre
        }
    }))
})

app.get('/movie/:id', (req,res)=>{
  const filteredMovie = movies.find(movie=>{
        return req.params.id == movie.id
    })
    res.send(filteredMovie)
})

app.get('/data',
    (req, res) => {
        fs.readFile('src/data/movies.json', 'utf8', function (err, data) {
            res.send(JSON.parse(data));
        })
    })

app.post('/addMovie', (req,res)=>{
    const newMovie = {
        id: movies.length,
        title: req.body.title,
        synopsis: req.body.synopsis
    }
    movies.push(newMovie)
    fs.writeFile('src/data/movies.json', JSON.stringify(movies), (err)=>{
        if (err) throw err
        console.log('The file has been saved')
    })


})
app.listen(5000, () => console.log('started'))