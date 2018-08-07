import express from 'express'
import fs from 'fs'

const app= express()
// middlewares
// ---------------------------------------------------------------------------------

// utiliser la finction use() avant les autres fonctions. Sinon fonction get() exécutées en premier et use() pas exécutée.
app.use(function(req, res, next){
    setTimeout(next, 3000)})

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8081");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
})



// const headerMiddlewares = (req, res, next)=>{
//     res.header('Access-Control-Allow-Origin', 'http://localhost:8081')
//     next()
// }




//Routes
app.get('/ping', (req, res)=>res.send("Pong"))
// app.get('/ping', (req,res)=>{
//     res
//     .status(200)
//     .setHeader('content-type', 'application/html')
//     res.send('pong')
// })

// const jsonData= require('./data/movies.json')

// app.get('/data', (req,res)=> res.send(jsonData))


app.get('/data', 
(req,res)=> {
    fs.readFile('src/data/movies.json', 'utf8', function (err,data) {
        res.send(JSON.parse(data));
})
   
})

app.listen(5000, ()=>console.log('started'))