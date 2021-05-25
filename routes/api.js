const express = require('express');
const BlogPost = require('../models/blogPost');
const router = express.Router();

router.get('/list', (req, res) => {
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

router.post('/save', (req, res) => {
  const data = req.body;
  console.log('body:', data);

  const newBlogPost = new BlogPost(data);
  newBlogPost.save((error) => {
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

module.exports = router;