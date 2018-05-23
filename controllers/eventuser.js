const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const passport = require('passport');
const EventUser = require('../models/EventUser');
const User = require('../models/User');
const GameData = require('../models/GameModel');

const EventUserMaster=require('../models/EventUserMaster');
const fs = require('fs');
const mnid = require('mnid');

exports.getEventUserEnter = (req, res, next) => {
  req.assert('usercode', 'EventUsercode least 3 characters long').len(3);
  req.assert('codetype', 'Codetype least 1 characters long').len(1);
  const errors = req.validationErrors();

  if (errors) {
    res.status(400).send(errors);
    return;
  }

  let onEventUserFound=function(err, user)
  {
    if (err) { return next(err); }
    if(user)
    {
      console.log('onEventUserFound');
      if (err) { return next(err); }
      res.setHeader('Content-Type', 'application/json');
      let userresult=
      {
        "tShirtSize":user.tShirtSize,
        "gender":user.gender,
        "birthday":user.birthday,
        "lastName":user.lastName,
        "firstName":user.firstName,
        "isEntered":user.isEntered,
        "uportId":user.uportId
      };
      res.send(JSON.stringify(userresult));
    }
    else{
      res.status(400).send('User not found.');
    }
  };

  if(req.query.codetype=='uport')
  {  
    EventUser.findOne({ uportId:req.query.usercode }, (err, user) => {
        onEventUserFound(err, user);
      });
}
else{
  EventUser.findOne({ email:req.query.email }, (err, user) => {
    onEventUserFound(err, user);
  });
}
};


exports.markEventUserEnter = (req, res, next) => {
  req.assert('usercode', 'EventUsercode least 3 characters long').len(3);
  req.assert('codetype', 'Codetype least 1 characters long').len(1);
  const errors = req.validationErrors();

  if (errors) {
    res.status(400).send(errors);
    return;
  }

  let onEventUserFound=function(err, user)
  {
    if (err) { return next(err); }
    if(user)
    {
      console.log('onEventUserFound');
      user.isEntered=true;
      user.save((err) => {
        if (err) { return next(err); }
        res.setHeader('Content-Type', 'application/json');
        let userresult=
        {
          "tShirtSize":user.tShirtSize,
          "gender":user.gender,
          "birthday":user.birthday,
          "lastName":user.lastName,
          "firstName":user.firstName,
          "isEntered":user.isEntered
        };
        res.send(JSON.stringify(userresult));
      });
    }
    else{
      res.status(400).send('User not found.');
    }
  };

  if(req.query.codetype=='uport')
  {  
    EventUser.findOne({ uportId:req.query.usercode }, (err, user) => {
        onEventUserFound(err, user);
      });
}
else{
  EventUser.findOne({ email:req.query.email }, (err, user) => {
    onEventUserFound(err, user);
  });
}
};

exports.getAllUsers = (req, res) => {
  console.log(req.query.userid);
  res.render('admin/userlist', {
    title: 'User List'
  });
};

exports.getAllEventMasterUsers = (req, res, next) => {
  console.log('getAllEventUsers called');
  EventUserMaster.find({}, (err, user) => {
    if (err) { return next(err); }
    if(user)
    {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(user));
    }
    else{
      res.status(400).send('User not found.' );
    }
  });
};



exports.getLeaderboard = (req, res) => {
  console.log(req.query.userid);
  res.render('admin/leaderboard', {
    title: 'Leaderboard'
  });
};

exports.getLeaderboardData = (req, res, next) => {
  console.log('getAllEventUsers called');
  EventUser.find({'userCategory':{ $ne: 'Organizer' },isDeployed:true}, async (err, user) => {
    if (err) { return next(err); }
    let result=[];
    let i=0;
    for(i=0;i<user.length;i++)
    {
      objtoAdd=user[i];
      //console.log('game data')
     // console.log(GameData.find({fromUportId:objtoAdd.uportId,tnxStatus:true}).count());
      objtoAdd.__v= await GameData.find({fromUportId:objtoAdd.uportId,tnxStatus:true}).count()*15
      objtoAdd.gender=objtoAdd.tokenBalance+objtoAdd.gameTokenBalance;
      result.push(objtoAdd)
     
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
};

exports.getAllAttendedUsers = (req, res) => {
  console.log(req.query.userid);
  res.render('admin/attendeduserlist', {
    title: 'Registerd Users'
  });
};

exports.getAllEventUsers = (req, res, next) => {
  console.log('getAllEventUsers called');
  EventUser.find({}, (err, user) => {
    if (err) { return next(err); }
    if(user)
    {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(user));
    }
    else{
      res.status(400).send('User not found.' );
    }
  });
};



exports.postApiCreateEventEventUser = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('first_name', 'First name must be at least 3 characters long').len(3);
  req.assert('last_name', 'Last name must be at least 3 characters long').len(3);
  req.check('birthday', 'Birthday is requred').matches(/(\d{4})-(\d{2})-(\d{2})/, "i");
  req.assert('gender', 'Gender must be 1 character long, (m/f)').len({ min: 1,max:1});
  req.assert('shirt_size', 'TShirt size must be 1-4 characters long').len({ min: 1,max:4 });
  req.assert('category', 'Category must be at least 1 characters long').len({ min: 1});
  req.assert('mobile', 'Mobile no. must be be 9 characters long').len(9);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
   
  const errors = req.validationErrors();

  if (errors) {
    res.status(400).send(errors);
    return;
  }

  const eventUserObj = new EventUser({
  email: req.body.email,
	firstName: req.body.first_name,
	lastName: req.body.last_name,
	birthDay: req.body.birthday,
	gender: req.body.gender,
	tShirtSize: req.body.shirt_size,
	foodtype: req.body['foodtype'],
	category: req.body.category,
	phone: req.body.mobile,
  uportId: '',
  contractHash: ''
  });

  EventUser.findOne({ email: req.body.email }, (err, existingEventUser) => {
    if (err) { return next(err); }
    if (existingEventUser) {
      res.status(400).send( 'Account with that email address already exists.');
        return;
    }
    eventUserObj.save((err) => {
      if (err) { return next(err); }
      req.logIn(EventUser, (err) => {
        if (err) {
          return next(err);
        }
         res.status(200).send('EventUser successfully created.' );
        return;
      });
    });
  });
};


