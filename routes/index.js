var express = require('express');
var messageService = require('../services/message-service');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Lightning NodeJS Messenger' });
});

router.get('/messages/:id?', function(req, res){
  res.json(messageService.getAll(req.params.id, { include: req.query.include, isStartDate: req.query.isStartDate }));
});

router.post('/messages', function(req, res){
  if (req.body && req.body.message) {
    messageService.addMessage(req.body.message);
  }

  res.status(200).end();
});

module.exports = router;
