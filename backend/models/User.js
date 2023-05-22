const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Schéma utilisateur
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true}, // unique: true empêche qu'un même email soit utilisé plusieurs fois
    password: {type: String, required: true}
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)