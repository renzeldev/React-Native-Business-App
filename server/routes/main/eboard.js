const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Eboard = require('../../models/Eboard');
// const EboardDraft = require('../../models/EboardDraft');
const User = require('../../models/User');
const {articleValidation, commentValidation} = require('../../validation/eboard');
const fs = require('fs');
const Validator = require('validator');
const compareString = require('../../config/compareString');
const Favourites = require('../../models/Favourites');

router.get('/test', (req, res) => {
  Eboard.find(null, 'title _id', {sort: 'date'})
  .then(eboards => {
    res.json(eboards);
  })
})

router.get('/test1', (req, res) => {
  Eboard.find()
  .then(eboards => {
    eboards.map(item => {
      item['views'] = 0;
      item.save();
    })
    // res.json(eboards);
    res.json(eboards);
  })
 
})

router.get('/getSortInfo', passport.authenticate('jwt', {session: false}), (req, res) => {
  var data = {};
  Eboard.find(null, 'type')
  .then(eboards => {
    data['all'] = eboards.length;
    data['english'] = eboards.filter( item => item.type == 'English').length;
    data['russian'] = eboards.filter( item => item.type == 'Russian').length;
    data['chinese'] = eboards.filter( item => item.type == 'Chinese').length;
    Favourites.findOne({user: req.user.handle})
    .then(favourite => {
      if(favourite) {
        data['favor'] = favourite.list.length;
        console.log(data);
        res.json(data);
      } else {
        data['favor'] = 0;
        res.json(data);
      }
      
    })
  })
})

router.get('/getMyFavorFiles', passport.authenticate('jwt', {session:false}), (req, res) => {  
  
  Favourites.findOne({user: req.user.handle})
  .then(favourite => {
    if(favourite) {
      if(favourite.list.length == 0) {
        res.json([]);
      } else {
        console.log(favourite.list);
        var filtered_eboards = new Array();
        favourite.list.map(item => {
          Eboard.findById(item)
          .then(eboard => {
            filtered_eboards = [...filtered_eboards, eboard];
            console.log(filtered_eboards);
            if(filtered_eboards.length == favourite.list.length) {
              res.json(filtered_eboards);
            }
          })
        })  
      }
    } else {
      res.json([]);
    }
  })
})

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = articleValidation(req.body);
  if(!isValid) {
    return res.status(404).json(errors);
  }
  if(req.user.handle === 'admin') 
  {
    const neweboard = new Eboard ({
      user: req.user.handle,
      title: req.body.title,
      content: req.body.content,
      type: req.body.type,
    });
    neweboard.save().then(eboard => res.json(eboard));
  } else {
    User.findOne({handle: req.user.handle})
    .then(user => {
      const neweboard = new Eboard ({
        user: user.handle,
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
      });
      neweboard.save().then(eboard => res.json(eboard));
  })
  }
})

router.get('/views/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Eboard.findById(req.params.id)
  .then(eboard => {
    eboard.views += 1;
    eboard.save();
    res.json('success');
  })
})

router.get('/addToMyFavor/:id', passport.authenticate('jwt', { session:false }), (req, res) => {
  Favourites.findOne({ user: req.user.handle })
  .then( favourite => {
    if( favourite ) {
      favourite.list.push(req.params.id);
      favourite.save();
      res.json(req.params.id);
    } else {
      const newFavor = new Favourites({
        user: req.user.handle,
        list: [ req.params.id ]
      })
      newFavor.save();
      res.json(req.params.id);
    }
  })
})

router.get('/getMyFavor', passport.authenticate('jwt', { session: false }), (req, res) => {
  Favourites.findOne({ user: req.user.handle })
  .then( favourite => {
    if( favourite ) {
      res.json(favourite.list);
    } else {
      res.json([]);
    }
  })
})

router.post('/allow/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  let errors = {};
  if(req.user.handle === 'admin') {
    Eboard.findById(req.params.id)
    .then(eboard => {
      const allowed = {
        allowed: true
      }
      Eboard.findOneAndUpdate(
        {_id: req.params.id},
        {$set: allowed},
        {new: true}
      ).then(eboard => res.json(eboard));
    })
  } else {
    errors.notallowed = '접근오유!';
    res.status(404).json(errors);
  }
})

router.post('/comment/:id', passport.authenticate('jwt',{session:false}),(req, res) => {
  const {errors, isValid} = commentValidation(req.body);
  if(!isValid) {
    return res.status(404).json(errors);
  }
  Eboard.findById(req.params.id)
  .then(eboard => {
    const newcomment = {
      handle: req.user.handle,
      text: req.body.text,
      date: Date.now()
    }
    eboard.comments.unshift(newcomment);
    eboard.save().then(eboard => res.json(eboard.comments));
    // eboard.save().then(eboard => res.json(newcomment));
  })
  .catch(err => {
    err.noarticle = '해당한 기사를 찾을수 없습니다.';
    res.status(404).json(err)
  })
  // User.findOne({handle: req.user.handle})
  // .then(user => {
    
  // })
  // .catch(err => {
  //   err.notallowed = '접근오유!';
  //   res.status(404).json(err);
  // })
})

router.post('/agree/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  let errors = {};
  console.log("agreeeee", req.params.id);
  Eboard.findById(req.params.id)
  .then(eboard => {
    for(var i = 0; i<eboard.agree.length;i++) {
      if(eboard.agree[i].user === req.user.handle) {
        errors.notagree = "이 기사에 대하여 추천하였으므로 다시 추천할수 없습니다.";
        return res.status(404).json(errors);
      }
    }
    for(var i = 0; i<eboard.disagree.length;i++) {
      if(eboard.disagree[i].user === req.user.handle) {
        errors.notagree = "이 기사에 대하여 반대하였으므로 추천할수 없습니다.";
        return res.status(404).json(errors);
      }
    }
    if(req.user.handle === eboard.user) {
      errors.notagree = "자기가 쓴 기사에 대하여 추천할수 없습니다.";
      return res.status(404).json(errors);
    }
    // eboard.disagree.findOne({user:req.user.handle}).then(is => {
    //   if(is){
    //     errors.notagree = "이 기사에 대하여 반대하였으므로 추천할수 없습니다.";
    //     return res.status(404).json(errors);
    // }})
    // .catch(err => {});
    // eboard.agree.findOne({user:req.user.handle}).then(is => {
    //   if(is){
    //     errors.notagree = "이 기사에 대하여 추천하였으므로 다시 추천할수 없습니다.";
    //     return res.status(404).json(errors);
    // }})
    // .catch(err => {});
    const newagree = {
      user: req.user.handle
    }
    eboard.agree.unshift(newagree);
    eboard.save().then(eboard => res.json('조작이 성공하였습니다.'))
  })
  .catch(err => {
    err.noarticle = '해당한 기사를 찾을수 없습니다.';
    return res.status(404).json(err);
  })
})

router.post('/disagree/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  let errors = {};
  Eboard.findById(req.params.id)
  .then(eboard => {
    for(var i = 0; i<eboard.agree.length;i++) {
      if(eboard.agree[i].user === req.user.handle) {
        errors.notagree = "이 기사에 대하여 추천하였으므로 반대할수 없습니다.";
        return res.status(404).json(errors);
      }
    }
    for(var i = 0; i<eboard.disagree.length;i++) {
      if(eboard.disagree[i].user === req.user.handle) {
        errors.notagree = "이 기사에 대하여 이미 반대하였으므로 다시 반대할수 없습니다.";
        return res.status(404).json(errors);
      }
    }
    if(req.user.handle === eboard.user) {
      errors.notagree = "자기가 쓴 기사에 대하여 반대할수 없습니다.";
      return res.status(404).json(errors);
    }
    // eboard.disagree.find(req.user.handle).then(is => {
    //   if(is){
    //     errors.notagree = "이 기사에 대하여 이미 반대하였으므로 다시 반대할수 없습니다.";
    //     return res.status(404).json(errors);
    // }})
    // eboard.agree.find(req.user.handle).then(is => {
    //   if(is){
    //     errors.notagree = "이 기사에 대하여 추천하였으므로 반대할수 없습니다.";
    //     return res.status(404).json(errors);
    // }})
    const newdisagree = {
      user: req.user.handle
    }
    eboard.disagree.unshift(newdisagree);
    eboard.save().then(eboard => res.json('조작이 성공하였습니다.'))
  })
  .catch(err => {
    err.noarticle = '해당한 기사를 찾을수 없습니다.';
    return res.status(404).json(err)
  })
})


router.get('/show/:number', passport.authenticate('jwt', {session:false}), (req, res) => {
	
  Eboard.find()
  .then(eboards => {
    const filtered_eboards = eboards.filter(eboard => eboard.allowed === true);
    var data = [];
    var number = req.params.number;
    if(filtered_eboards.length === 0) {
      res.json({data:[], page_number: req.params.number, isSetPopular:false, searchedItem:{handle:'', title:'', content:'', type: ''}});
    }
    if(req.params.number < 1) {
      number = 1;
    }
    if(10*(req.params.number-1) >= filtered_eboards.length) {
      number -= 1;
    }
    for(var i = filtered_eboards.length-10*(number-1); i>filtered_eboards.length-10*number ; i-- ) {
      // filtered_eboards[i-1].date = filtered_eboards[i-1].date.toLocaleString();
       data = [...data, filtered_eboards[i-1]];
       if(i-1 === 0) break;
     }
    // data.map(item => {
    //   item.date = item.date.toLocaleString();
    // })
    console.log(data.length);
    res.json({data:data, page_number: req.params.number, isSetPopular:false, searchedItem:{handle:'', title:'', content:'', type: ''}});
    }
  )
})

router.get('/popular/show/:number', passport.authenticate('jwt', {session:false}), (req, res) => {
	console.log('popularrrrrrrr');
  Eboard.find(null, null, {sort: 'views'})
  .then(eboards => {
    const filtered_eboards = eboards.filter(eboard => eboard.allowed === true);
    var data = [];
    var number = req.params.number;
    if(filtered_eboards.length === 0) {
      res.json({data:[], page_number: req.params.number, isSetPopular:true, searchedItem:{handle:'', title:'', content:'', type: ''}});
    }
    if(req.params.number < 1) {
      number = 1;
    }
    if(10*(req.params.number-1) >= filtered_eboards.length) {
      number -= 1;
    }
    for(var i = filtered_eboards.length-10*(number-1); i>filtered_eboards.length-10*number ; i-- ) {
      // filtered_eboards[i-1].date = filtered_eboards[i-1].date.toLocaleString();
       data = [...data, filtered_eboards[i-1]];
       if(i-1 === 0) break;
     }
    // data.map(item => {
    //   item.date = item.date.toLocaleString();
    // })
    res.json({data:data, page_number: req.params.number, isSetPopular:true, searchedItem:{handle:'', title:'', content:'', type: ''}});
    }
  )
})

router.post('/popular/searched/show/:number', passport.authenticate('jwt', {session:false}), (req, res) => {
  let filtered_eboards;
  console.log('popularrrrrrrr');
  Eboard.find(null, null, {sort:'views'})
  .then(eboards => {
    
    let searched_eboards = [];
    filtered_eboards = eboards.filter(eboard => eboard.allowed);
    if(req.body.type) {
      filtered_eboards = filtered_eboards.filter(eboard => eboard.type == req.body.type);
    } 
    
    
    // [eboards].map(item => {
    //   if(item.allowed) {
    //     filtered_eboards = [item, ...filtered_eboards];  
    //   }
    // })
    if(!req.body.handle && !req.body.title && !req.body.content) {
      searched_eboards = filtered_eboards;
    } else {
      for(var i = 0; i < filtered_eboards.length ; i++) {
        if(req.body.handle.length !== 0 && compareString(filtered_eboards[i].user, req.body.handle)) {
          console.log(searched_eboards, req.body);
          searched_eboards = [...searched_eboards, filtered_eboards[i]];
        } else if( req.body.title.length !== 0 && filterArticlesByString(filtered_eboards[i].title, req.body.title )) {
          searched_eboards = [...searched_eboards, filtered_eboards[i]];
        } else if ( req.body.content.length !== 0 && filterArticlesByString(filtered_eboards[i].content, req.body.content) ) {
          searched_eboards = [...searched_eboards, filtered_eboards[i]];
        } 
      }
    }
    
    
    

    // if( req.body.type.length !== 0 ) {
    //   searched_eboards = searched_eboards.filter(eboard => eboard.type == req.body.type);
    // }

    

    var data = [];
    var number = req.params.number;
    //res.json(searched_eboards.length);
    if(searched_eboards.length === 0) {
      res.json({data:[], page_number: req.params.number, isSetPopular:true, searchedItem:req.body});
    } else {
      if(10*(req.params.number-1) >= searched_eboards.length) {
        number -= 1;
      }
      for(var i = searched_eboards.length-10*(number-1); i>searched_eboards.length-10*number ; i-- ) {
        // searched_eboards[i-1].date = searched_eboards[i-1].date.toLocaleString();
         data = [...data, searched_eboards[i-1]];
         if(i-1 === 0) break;
       }
      //  console.log({data:data, page_number: req.params.number, searchedItem:req.body});
      //  data.map(item => {
      //   item.date = item.date.toLocaleString();
      // })
      console.log(data);
      res.json({data:data, page_number: req.params.number, isSetPopular:true, searchedItem:req.body});
    }
    if(req.params.number < 1) {
      number = 1;
    }
    
  })
})

router.post('/searched/show/:number', passport.authenticate('jwt', {session:false}), (req, res) => {
  let filtered_eboards;
  Eboard.find()
  .then(eboards => {
    
    let searched_eboards = [];
    filtered_eboards = eboards.filter(eboard => eboard.allowed);
    if(req.body.type) {
      filtered_eboards = filtered_eboards.filter(eboard => eboard.type == req.body.type);
    } 
    
    
    // [eboards].map(item => {
    //   if(item.allowed) {
    //     filtered_eboards = [item, ...filtered_eboards];  
    //   }
    // })
    if(!req.body.handle && !req.body.title && !req.body.content) {
      searched_eboards = filtered_eboards;
    } else {
      for(var i = 0; i < filtered_eboards.length ; i++) {
        if(req.body.handle.length !== 0 && compareString(filtered_eboards[i].user, req.body.handle)) {
          console.log(searched_eboards, req.body);
          searched_eboards = [...searched_eboards, filtered_eboards[i]];
        } else if( req.body.title.length !== 0 && filterArticlesByString(filtered_eboards[i].title, req.body.title )) {
          searched_eboards = [...searched_eboards, filtered_eboards[i]];
        } else if ( req.body.content.length !== 0 && filterArticlesByString(filtered_eboards[i].content, req.body.content) ) {
          searched_eboards = [...searched_eboards, filtered_eboards[i]];
        } 
      }
    }
    
    
    

    // if( req.body.type.length !== 0 ) {
    //   searched_eboards = searched_eboards.filter(eboard => eboard.type == req.body.type);
    // }

    

    var data = [];
    var number = req.params.number;
    //res.json(searched_eboards.length);
    if(searched_eboards.length === 0) {
      console.log("wwwwwwww");
      res.json({data:[], page_number: req.params.number, isSetPopular:false, searchedItem:req.body});
    } else {
      if(10*(req.params.number-1) >= searched_eboards.length) {
        number -= 1;
      }
      for(var i = searched_eboards.length-10*(number-1); i>searched_eboards.length-10*number ; i-- ) {
        // searched_eboards[i-1].date = searched_eboards[i-1].date.toLocaleString();
         data = [...data, searched_eboards[i-1]];
         if(i-1 === 0) break;
       }
      //  console.log({data:data, page_number: req.params.number, searchedItem:req.body});
      //  data.map(item => {
      //   item.date = item.date.toLocaleString();
      // })
      console.log(data);
      res.json({data:data, page_number: req.params.number, isSetPopular:false, searchedItem:req.body});
    }
    if(req.params.number < 1) {
      number = 1;
    }
    
  })
})

router.get('/draft', passport.authenticate('jwt', {session:false}), (req, res) => {
  Eboard.find()
  .then(eboards => {
    const unallowed_eboards = eboards.filter(eboard => eboard.allowed === false);
    res.json(unallowed_eboards);
    }
  )
})

router.get('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  Eboard.findById(req.params.id)
  .then(eboard => {
    res.json(eboard)
  })
  .catch(err => {
    err.noarticle = '해당한 기사를 찾을수 없습니다.';
    return res.status(404).json(err);
  })
})

router.get('/count/articles', passport.authenticate('jwt', {session:false}), (req, res) => {
  Eboard.find()
  .then(eboards => {
    const filtered_eboards = eboards.filter(eboard => eboard.allowed === true);
    res.json(filtered_eboards.length);
  })
})

router.post('/searched/count/articles', passport.authenticate('jwt', {session:false}), (req, res) => {
  let filtered_eboards;
  console.log(req.body);
  Eboard.find()
  .then(eboards => {
    let searched_eboards = [];
    filtered_eboards = eboards.filter(eboard => eboard.allowed);
    if( req.body.type ) {
      filtered_eboards = eboards.filter(eboard => eboard.type == req.body.type);
    }
    if(req.body.handle.length == 0 && req.body.title.length == 0 && req.body.content.length == 0) {
      searched_eboards = filtered_eboards;
      console.log('search', searched_eboards.length);
      res.json(searched_eboards.length)
    } else {
      for(var i = 0; i < filtered_eboards.length ; i++) {
        if(req.body.handle.length !== 0 && compareString(filtered_eboards[i].user, req.body.handle)) {
          searched_eboards = [filtered_eboards[i], ...searched_eboards];
        } else {
          if(req.body.title.length !== 0 && filterArticlesByString(filtered_eboards[i].title, req.body.title)) {
            searched_eboards = [filtered_eboards[i], ...searched_eboards];
          } else {
            if(req.body.content.length !== 0 && filterArticlesByString(filtered_eboards[i].content, req.body.content)) {
              searched_eboards = [filtered_eboards[i], ...searched_eboards];
            }
          }
        }
      }
      res.json(searched_eboards.length)
    } 
    
  })
})

router.delete('/:id', passport.authenticate('jwt', {session:false}), (req, res) => {
  let errors = {};
  if(req.user.handle === "admin") {
    Eboard.findById(req.params.id)
    .then(eboard => Eboard.findOneAndRemove({_id:req.params.id}));//무조건 검색하고 삭제,,,
  
    res.json(req.params.id);
  } else {
    errors.notallowed = '접근오유!';
    return res.status(404).json(errors);
  }
})




router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
  Eboard.find()
  .then(eboards => {
    const filterd_eboards = eboards.filter(eboard => eboard.allowed === true);
    res.json(filterd_eboards);
    }
  )
})

router.get('/file/download', (req, res) => {
  var path = __dirname +  '/1.zip';
  fs.exists(path, function(exists) {
    if(exists) {
      res.writeHead(200, {'content-type': 'application/zip'})
			fs.createReadStream(path).pipe(res); // 읽는 차제로 res로 client에 내려보냄.
    } else {
      res.status(400).json({err:'화일이 존재하지 않습니다!'});
    }
  })
})

const compareWord = (data1, data2) => {
  if(data1.length < data2.length) {
    return false;
  } else {
    if(data1.split(data2).length === 1) {
      return false;
    } else {
      return true;
    }
  }
}

const filterArticlesByString = (content, data) => {
  //var contentItem = content.split(' ');
  var dataItem = data.split(' ');
  
  var checked = 0;
  for(var i = 0; i < dataItem.length; i++) {
    if(content.split(dataItem[i]).length !== 1) {
      checked++;
    }
  }
  
  if(checked !== dataItem.length) {
    return false;
  } else {
    return true;
  }
}




module.exports = router;