const hashToken = require('jsonwebtoken') // importation du package jsonwebtoken

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1] // récupération du token dans le header de la requête entrante
        const decodedToken = hashToken.verify(token, 'RANDOM_TOKEN_SECRET') // vérification du token
        const userId = decodedToken.userId // récupération de l'ID utilisateur

        if (req.body.userId && req.body.userId !== userId) { // si l'ID utilisateur est différent de celui du token
            throw "User ID non valable" // on renvoie une erreur            
        } else {
            next()
        } 
    }catch (error) {
        res.status(401).json({ error })
    }

}