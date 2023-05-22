const express = require('express')
const mongoose = require('mongoose')
const path = require('path') // package natif de node.js qui permet d'accéder au chemin de notre système de fichier

const userRoutes = require('./routes/users')
const sauceRoutes = require('./routes/sauces')


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))  



// Connexion à MongoDB
mongoose.connect('mongodb+srv://piiquanteAdmin:uI7KdvuGQj0art7C@cluster0.l4dolg9.mongodb.net/piiquantedB?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))


// Headers pour éviter les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})




app.use('/images', express.static(path.join(__dirname, 'images'))) // indique à Express qu'il faut gérer la ressource images de manière statique

app.use('/api/auth', userRoutes)
app.use('/api/sauces', sauceRoutes)


module.exports = app