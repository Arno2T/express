import express from 'express'
import fs from 'fs'

const app= express()

app.get('/ping', (req, res)=>res.send("Pong"))
// app.get('/ping', (req,res)=>{
//     res
//     .status(200)
//     .setHeader('content-type', 'application/html')
//     res.send('pong')
// })

// const jsonData= require('./data/movies.json')

// app.get('/data', (req,res)=> res.send(jsonData))

app.get('/data', (req,res)=> {
    fs.readFile('src/data/movies.json', 'utf8', function (err,data) {
        res.send(JSON.parse(data));
})


    
})

app.listen(5000, ()=>console.log('started'))