const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')

//Middleware pour l'inscription
router.post('/signup', userCtrl.signup)

//Middleware pour la connexion
router.post('/login', userCtrl.login)

module.exports = router