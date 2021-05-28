const express = require('express');
const router = express.Router();

const BlogPost = require('../models/mongodb/BlogPost');
const RoomModel = require('../models/mongodb/Room/Model');

//===========================================
// BLOG POSTS
//===========================================
router.get('/blog/list', (req, res) => {
  BlogPost.find({})
  .then((data) => {
    res.json({
      data: data
    });
  })
  .catch((error) => {
    console.log('error:', error)
  });
})

router.post('/blog/save', (req, res) => {
  const data = req.body;
  console.log('body:', data);

  const newModel = new BlogPost(data);
  newModel.save((error) => {
    if (error) {
      res.json({
        msg: "error"
      })
    } else {
      res.json({
        msg: "success"
      })
    }
  });
})




//===========================================
// ROOMS
//===========================================
router.get('/Room/list', (req, res) => {
  RoomModel.find({})
  .then((data) => {
    res.json({
      data: data
    });
  })
  .catch((error) => {
    console.log('error:', error)
  });
})



router.post('/Room/save', (req, res) => {
  const data = req.body;
  const roomCode = data.code;
  const roomTitle = data.title || roomCode;
  console.log('body:', data);
  
  const newModel = new RoomModel({
    code: roomCode,
    title: roomTitle,
    playerCount: 0,
    joinable: true,
    mode: "in_setup",
    state: "{}",
  });

  const onModelSave = (error) => {
    if (error) {
      res.json({
        msg: "error"
      })
    } else {
      res.json({
        msg: "success"
      })
    }
  }

  newModel.save(onModelSave);
})


module.exports = router;
