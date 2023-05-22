const express = require('express')
const Sauce = require('../models/Sauce')

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = req.body
    const sauce = new Sauce({ // création d'une nouvelle sauce
        ...sauceObject // ... opérateur spread qui copie tous les éléments de req.body
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée avec succès !'}))
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
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) 
        .then(() => res.status(200).json({ message: 'Sauce modifiée avec succès !'}))
        .catch(error => res.status(400).json({ error }))
}

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id }) 
        .then(() => res.status(200).json({ message: 'Sauce supprimée avec succès !'}))
        .catch(error => res.status(400).json({ error }))
}