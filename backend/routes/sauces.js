const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const sauceCtrl = require('../controllers/sauce')

//CRUD
router.post('/', auth, multer, sauceCtrl.createSauce)
router.get('/', auth, sauceCtrl.getAllSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)

//Gestion des likes et dislikes
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router