import express from 'express'
import fs from 'fs'
import config from 'config'

const app = express()
// middlewares
// ---------------------------------------------------------------------------------

// utiliser la fonction use() avant les autres fonctions. Sinon fonction get() exécutées en premier et use() pas exécutée.
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(function (req, res, next) {
//  setTimeout(next, 1000)
// })

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8081");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})
app.use((req,res,next)=> setTimeout(next, config.get('timeout')))

app.use(express.static('public'))

//Routes
let movies
fs.readFile(config.get('data'), 'utf8', function (err, data) {
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

app.get('/movie/:id', (req, res) => {
    const filteredMovie = movies.find(movie => {
        return req.params.id == movie.id
    })
    if(!filteredMovie){
        return res.status(404).send('File not found')
    }
    res.send(filteredMovie)
})

app.get('/data',
    (req, res) => {
        fs.readFile('src/data/movies.json', 'utf8', function (err, data) {
            res.send(JSON.parse(data));
        })
    })

app.post('/addMovie', (req, res) => {
    const errorMessage = []
    const newMovie = {
        id: movies.length,
        title: req.body.title,
        synopsis: req.body.synopsis
    }
    function validateFields(field, msg) {
        if (!field || field.trim().length === 0) {
            errors.push(msg)
        }
    }
    const errors = []
    validateFields(newMovie.title, "Titre obligatoire")
    validateFields(newMovie.synopsis, "Résumé obligatoire")
    if (errors.length > 0) return res.status(400).send(errors)

    movies.push(newMovie)
    fs.writeFile(config.get('data'), JSON.stringify(movies), (err) => {
        if (err) throw err
        console.log('The file has been saved')
    })
    res.send(newMovie)
})

export default app