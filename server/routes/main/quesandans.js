const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Ques = require('../../models/Ques');
const questionValidation = require('../../validation/question');

router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  const {errors, isValid} = questionValidation(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
  console.log(req.body.question, req.body.answer, req.user.handle);
  const newQuestion = new Ques({
    question: req.body.question,
    answer: req.body.answer,
    user: req.user.handle
  })

  newQuestion.save().then(ques => {console.log(ques); res.json(ques)});
})

router.get('/all', passport.authenticate('jwt', {session:false}), (req, res) => {
  
  let errors = {};
  Ques.find()
  .then(quess => {
    if(!quess) {
      errors.noquestion = '제기된 질문이 없습니다.';
      return res.status(400).json(errors);
    }
    var data = [];
    for(var i = quess.length ; i > 0; i--)
    {
      data = [...data, quess[i-1]]
    }
    res.json(data);
    // quess.sort({data:-1}).then(() => res.json(quess));
  })
  .catch(err => res.status(404).json(err));
})

router.post('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  const {errors, isValid} = questionValidation(req.body);
  if(!isValid) {
    return res.status(400).json(errors);
  }
    if(req.user.handle === 'admin') {
      Ques.findById(req.params.id)
    .then(ques => {
      if(ques) {
        const question = {
          question: req.body.question,
          answer: req.body.answer
        }
        Ques.findOneAndUpdate(
          {_id: req.params.id},
          {$set: question},
          {new: true}
        ).then(ques => res.json(ques))
      } else {
        errors.noquestion = "오유입니다."
        return res.status(404).json(errors);
      }
    })
    .catch(err => {
      errors.noquestion = '오유입니다.';
      res.status(404).json(errors);
    });
  } else {
    errors.notAllowed = '권한이 없습니다.'
    return res.status(404).json(errors);
  }
})

router.delete('/:id',passport.authenticate('jwt', {session:false}), (req, res) => {
  // Ques.find()
  // .then(quess => {
  //   quess.map(ques => {
  //     Ques.findOneAndRemove({_id: ques._id});
  //   })
  // }).then(() => res.json("success"));
  // Ques.findOneAndRemove({_id: req.params.id})
  // .then(() => res.json('success'));
  let errors = {};
  if(req.user.handle === 'admin') {
    Ques.findById(req.params.id)
    .then(ques => Ques.findOneAndRemove({_id: req.params.id}));
    res.json(req.params.id);
  } else {
    errors.notAllowed = '권한이 없습니다.'
    return res.status(404).json(errors);
  }
})

module.exports = router;