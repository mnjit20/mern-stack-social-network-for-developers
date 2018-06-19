const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Validation
const validateProfileInput = require('../../validation/profile');

//Load Profile Model
const Profile = require('../../models/Profile');

//Load User Model
const User = require('../../models/User');

// @route GET api/profile/test
// @desc Test profile route
// @access  Public 
router.get('/test', (req, res) => res.json({
  msg: "Profiles Works!"
}));


// @route GET api/profile
// @dess Get current users profile
// @access Private

router.get('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});


// @route POST api/profile/
// @dess Creat user profile
// @access Private
router.post('/', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  const {
    errors,
    isValid
  } = validateProfileInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  //skills splits as an array comma seprated reciced from user
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(',');
  }
  //Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (profile) {
        //Update profile
        Profile.findOneAndUpdate({
          user: req.user.id
        }, {
          $set: profileFields
        }, {
          new: true
        }).then(profile => res.json(profile));
      } else {
        //Create profile
        //check if handle exists 
        Profile.findOne({
          handle: profileFields.handle
        }).then(proflie => {
          if (profile) {
            errors.handle = "That handle already exist";
            res.status(400).json(errors);
          }
          //Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }

    })
    .catch(err => res.status(400).json(err));
});


// @route GET api/profile/handle/:handle
// @desc  Get profile by handle
// @access Public

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({
      handle: req.params.handle
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// @route GET api/profile/user/:user_id
// @desc  Get profile by user ID
// @access Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({
      user: req.params.user_id
    })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(400).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// @route POST api/profile/handle/:handle
// @desc  Creat user profile
// @access Private


module.exports = router;