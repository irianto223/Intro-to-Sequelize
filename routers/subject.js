'use strict'
var express = require('express')
var router = express.Router()

var model = require('../models')
var toLetter = require('../helpers/numToLetter')

router.use((req,res,next) => {
  if (req.session.role == 'headmaster' || req.session.role == 'academic') {
    next()
  }
  else {
    res.sendStatus(401)
  }
})

router.get('/', (req,res) => {
  model.Subject.findAll({
    include: model.Teacher
  })
  .then(data => {
    res.render('subject', {dataSubject: data, pageTitle: 'subject page', session: req.session})
  })
})


router.get('/:id/enrolledstudents', (req,res) => {
  model.StudentSubject.findAll({
    include: {all: true},
    where: {SubjectId: req.params.id}
  })
  .then(data => {
    data.forEach(d => {
      d.Letter = toLetter(d.Score)
      // console.log(d.Score);
    })
    res.render('enrolled_students', {dataSS: data, pageTitle: 'enrolled student', session: req.session})
  })
})

router.get('/:id/givescore', (req,res) => {
  model.StudentSubject.findById(req.params.id)
  .then(data => {
    res.render('give_score', {dataSS: data, pageTitle: 'assign score', session: req.session})
  })
})

router.post('/:id/givescore', (req,res) => {
  model.StudentSubject.update({
    Score: req.body.nilai
  },
  {
    include: {all: true},
    where: {id: req.params.id}
  })
  .then(() => {
    res.redirect(`/subjects/${req.body.idSubject}/enrolledstudents`)
  })
})


module.exports = router
