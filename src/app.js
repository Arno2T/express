import express from 'express'
import fs from 'fs'
import config from 'config'
import socketio from 'socket.io'
import { Movie } from './db/movie-model'

// Initialisation de l'application
//======================================================================================================
const app = express()
const io = socketio(5001)
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
    res.header("Access-Control-Allow-Origin", "http://localhost:8081")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    next()
})
app.use((req, res, next) => setTimeout(next, config.get('timeout')))

app.use(express.static('public'))

//Routes
// let movies
// fs.readFile(config.get('data'), 'utf8', function (err, data) {
//     if (err) throw err
//     movies = JSON.parse(data)
// })

app.get('/movie', async (req, res) => {
    const filteredMovie = await Movie.find({}).select('-synopsis')
    res.send(filteredMovie)
    // res.send(movies.map(movie => {
    //     return {
    //         id: movie.id,
    //         title: movie.title,
    //         url: movie.url,
    //         autre: movie.autre
    //     }
    // }))
})

app.get('/movie/:id', async (req, res) => {

    const film = await Movie.findById(parseInt(req.params.id))
    if(!film){
        return res.status(404).send ('Film introuvable')
    }
    res.send(film)
    // const filteredMovie = movies.find(movie => {
    //     return req.params.id == movie.id
    // })
    // if (!filteredMovie) {
    //     return res.status(404).send('File not found')
    // }
    // res.send(filteredMovie)
})

app.get('/data',
    (req, res) => {
        fs.readFile('src/data/movies.json', 'utf8', function (err, data) {
            res.send(JSON.parse(data));
        })
    })

app.post('/addMovie/:id?', async (req, res) => {
    //on valide les champs
    function validateFields(field, msg) {
        if (!field || field.trim().length === 0) {
            errors.push(msg)
        }
    }
    const errors = []
    validateFields(req.body.title, "Titre obligatoire")
    validateFields(req.body.synopsis, "Résumé obligatoire")
    if (errors.length > 0) return res.status(400).send(errors)

    //si ID du film est défini
    if (req.params.id) {
        const oldMovie = await Movie.findById(parseInt(req.params.id))
        // const oldMovie = movies.find(movie => {
        //     return req.params.id == movie.id
        //})
        if (!oldMovie) {
            res.status(404).send('Film introuvable')
        }
        else {
            oldMovie.title = req.body.title
            oldMovie.synopsis = req.body.synopsis
            oldMovie.url = req.body.url
            await oldMovie.save()
            //EMIT IO
            io.emit('update-movie', oldMovie)
            // fs.writeFile(config.get('data'), JSON.stringify(movies), (err) => {
            //     if (err) throw err
            //     console.log('The file has been updated')
            // })
            res.status(200).send(oldMovie)
        }
    }
    //Si pas d'ID on ajoute un nouveau film
    else {
        const newMovie = new Movie({
            title: req.body.title,
            synopsis: req.body.synopsis,
            url: req.body.url
        })
        await newMovie.save()
        //movies.push(newMovie)
        //EMIT IO
        io.emit('insert-movie', newMovie)
        // fs.writeFile(config.get('data'), JSON.stringify(movies), (err) => {
        //     if (err) throw err
        //     console.log('The file has been saved')
        // })
        res.status(200).send(newMovie)
    }
})

app.delete('/movie/:id', async (req, res) => {
     // EMIT IO
     io.emit('delete-movie', deleteMovie)

    const deleteMovie = await Movie.deleteOne({_id: parseInt(req.params.id)})
     res.status(203).end()
    // const movieToDelete = movies.find(movie => {
    //     return req.params.id == movie.id
    // })
    // const deleteMovie = movies.indexOf(movieToDelete)
    // movies.splice(deleteMovie, 1)
    // fs.writeFile(config.get('data'), JSON.stringify(movies), (err) => {
    //     if (err) throw err
    //     console.log('The file has been deleted')
    // })
    // res.status(204).end()

})

export default app