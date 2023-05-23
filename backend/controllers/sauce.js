const fs = require('fs') // package file system de Node permettant de modifier le système de fichiers
const Sauce = require('../models/Sauce')


// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce) // on transforme la chaîne de caractères en objet JS
    delete sauceObject._id // on supprime l'id envoyé par le front-end car il sera créé par le serveur
    const sauce = new Sauce({ // création d'une nouvelle sauce
        ...sauceObject, // ... opérateur spread qui copie tous les éléments de req.body
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce ajoutée avec succès !'}))
        .catch(error => res.status(400).json({ error }))

}

//Récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces)) 
        .catch(error => res.status(400).json({ error }))
}

//Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) 
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
}

//Modification et mise à jour d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce), // on transforme la chaîne de caractères en objet JS
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
    
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
        .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !'}))
        .catch(error => res.status(400).json({ error }))
}

//  Supprimer une bière
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
       .then(beer => {
          const filename = beer.imageUrl.split('/images/')[1]
          fs.unlink(`images/${filename}`, () => {
             Sauce.deleteOne({ _id: req.params.id })
             .then(() => { res.status(200).json({ message: 'Sauce supprimée avec succès !'})})
             .catch(error => res.status(400).json({ error }))
          })
       })
       .catch(error => res.status(500).json({ error }))
  }


  // Gestion des likes et dislikes
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId
    const like = req.body.like
    const sauceId = req.params.id
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            //nouvelle valeurs à ajouter
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked
            }

            // Différents cas
            switch (like) {

                case 1: // cas où l'utilisateur like la sauce
                    newValues.usersLiked.push(userId)
                    break

                case -1: // cas où l'utilisateur dislike la sauce
                    newValues.usersDisliked.push(userId)
                    break

                case 0: // cas où l'utilisateur annule son like ou son dislike

                     if (newValues.usersLiked.includes(userId)) { // si l'utilisateur annule son like
                        const index = newValues.usersLiked.indexOf(userId)
                        newValues.usersLiked.splice(index, 1)  

                     } else { // si l'utilisateur annule son dislike
                        const index = newValues.usersDisliked.indexOf(userId)
                        newValues.usersDisliked.splice(index, 1)
                     }
                     break
            }
            // calcule le nombre de likes et de dislikes
            newValues.likes = newValues.usersLiked.length
            newValues.dislikes = newValues.usersDisliked.length

            // Met à jour la sauce
            Sauce.updateOne({ _id: sauceId }, newValues)
                .then(() => res.status(200).json({ message: 'Sauce notée avec succès !'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}