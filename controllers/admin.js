const EventUserMaster = require('../models/EventUserMaster');
const EventUser = require('../models/EventUser');

const csv = require('fast-csv');
const bcrypt = require('bcrypt-nodejs');

exports.getFileUpload = (req, res) => {
  console.log(req.user);
  if (!req.user || req.user.role!='superadmin') {
    return res.redirect('/');
  }
  res.render('api/upload', {
    title: 'File Upload'
  });
};



exports.postFileUpload = (req, res) => {
  console.log(req.body);
  if (!req.files)
  {
    return res.status(400).send('No files were uploaded.');
  }
  if (!req.user || req.user.role!='superadmin') {
    return res.redirect('/');
  }
     console.log(req.files);
    var authorFile = req.files.file;
    var successCount=0;
    var failCount=0;
    var alreadyExisitingCount=0;
    csv
     .fromString(authorFile.data.toString(), {
         headers: true,
         ignoreEmpty: true
     })
     .on("data", function(data){
       if(req.body['destTable'] && req.body['destTable']=='eventUser')
       {
        var eventUserObj = new EventUser({
          email: data['email'],
          firstName: data['firstName'],
          lastName: data['lastName'],
          birthDay: data['birthDay'],
          gender:data['gender'],
          tShirtSize:data['tShirtSize'],
          foodtype:data['foodtype'],
          jobRole:data['jobRole'],
          phone:data['phone']?data['phone']:'000000000'  
        });
        if(data['birthDay'])
        {
          dateComponets=data['birthDay'].split('/')
          console.log(dateComponets);
          if(dateComponets && dateComponets['length']==3)
          {
            eventUserObj.birthDay=new Date(dateComponets[2], dateComponets[1], dateComponets[0]);
          }

        }
        if(data['uportId'])
        {
          eventUserObj.uportId=data['uportId'];
        }
        if(data['emailhash'])
        {
          eventUserObj.emailHash=data['emailHash'];
        }
         EventUser.findOne({ email:eventUserObj.email }, (err, existingEventUser) => {
          if (!existingEventUser) {
          console.log('User not found');
          eventUserObj.calculateEmailHash(eventUserObj.email,function(hash)
          {
            if(hash)
            {
            eventUserObj.emailHash = hash;
            eventUserObj.save((err) => {
              if(!err)
              {
              successCount++;
              console.log('User saved');
              }
              else{
              failCount++;
              }
              console.log(err);
            });
            }
            else{
            failCount++;
            }           
          });        
          }
          else{
          existingEventUser.compareEmailHash(existingEventUser.email,existingEventUser.emailHash,function(ismatch)
          {
            console.log(err);
            console.log('Validating email hash:'+ismatch);
          });
          console.log('User already exists, updating.');
          console.log(existingEventUser);
          alreadyExisitingCount++;
          }      
        });
       }
       else{
        var eventUserMasterObj = new EventUserMaster({
          email: data['email'],
          firstName: data['firstName'],
          lastName: data['lastName'],
          birthDay: data['birthDay'],
          gender:data['gender'],
          tShirtSize:data['tShirtSize'],
          foodtype:data['foodtype'],
          jobRole:data['jobRole'],
          phone:data['phone'],
          emailHash:''
        });
         EventUserMaster.findOne({ email:eventUserMasterObj.email }, (err, existingEventUser) => {
          if (!existingEventUser) {
            console.log('User not found');
            eventUserMasterObj.calculateEmailHash(eventUserMasterObj.email,function(hash)
            {
              if(hash)
              {
                eventUserMasterObj.emailHash = hash;
                eventUserMasterObj.save((err) => {
                  if(!err)
                  {
                    successCount++;
                    console.log('User saved');
                  }
                  else{
                    failCount++;
                  }
                  console.log(err);
                });
              }
              else{
                failCount++;
              }           
            });        
          }
          else{
            existingEventUser.compareEmailHash(existingEventUser.email,existingEventUser.emailHash,function(ismatch)
            {
              console.log(err);
              console.log('Validating email hash:'+ismatch);
            });
            console.log('User already exists, updating.');
            console.log(existingEventUser);
            alreadyExisitingCount++;
          }      
        });
       }
       
     })
     .on("end", function(){
      req.flash('success', { msg: 'File import complete.'});
      res.redirect('/import');
     });

};



