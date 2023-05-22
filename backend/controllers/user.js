const bcrypt = require('bcrypt') //hashage du mot de passe
const hashToken = require('jsonwebtoken') //création d'un token d'authentification

const User = require('../models/User')

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // hashage du mot de passe
    .then(hash => {
        const user = new User({ // création d'un nouvel utilisateur
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé avec succès !'}))
        .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}))
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
             if(!user) {
                 return res.status(401).json({ error: "Nom d'utilisateur inconnu !"})
             }
             bcrypt.compare(req.body.password, user.password) // la fonction compare permet de comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
                .then(valid => {
                     if(!valid) {
                         return res.status(401).json({ error: 'Mot de passe incorrect !' })
                     }
                     res.status(200).json({
                         userId: user._id,
                         token: hashToken.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                         )
                     })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error })) 
}