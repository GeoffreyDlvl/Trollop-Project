var express = require('express');
var router = express.Router();

const AuthenticationController = require('./src/controller/authenticationController');
const SettingsController = require('./src/controller/settingsController');
const UsersController = require('./src/controller/usersController');
const DatabaseService = require('./src/services/databaseService');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/authentication', function(req, res, next) {
  const controller = new AuthenticationController(new DatabaseService());
  (async () => {
    const user = await controller.getUserFromCredentials(req.body.username, req.body.password);
    if (undefined !== user) {
      console.log(user.toJson())
      res.send(user.toJson());
    } else {
      return res.status(404).send({
        message: 'Incorrect credentials'
      });
    }
  })()
});

router.post('/registration', function(req, res, next) {
  const controller = new AuthenticationController(new DatabaseService());
  (async () => {
    const user = await controller.createUser(req.body.username, req.body.email, req.body.password,req.body.role);
    if (undefined !== user) {
      res.send(user.toJson());
    } else {
      return res.status(409).send({
        message: 'Cannot create user'
      });
    }
  })()
});

router.get('/users', function(req, res, next) {
  const controller = new UsersController(new DatabaseService());
  (async () => {
    const users = await controller.getAllUser();
    if (undefined !== users) {
      res.send(JSON.stringify(users));
    } else {
      return res.status(500).send({
        message: 'Error append sometimes you know'
      });
    }
  })()
});

router.post('/updateUser', function(req, res, next) {
  console.log('REQ BODYYY')
  console.log(req.body)
  const controller = new SettingsController(new DatabaseService());
  (async () => {
    await controller.updateUser(req.body.currentUsername, req.body.newUsername, req.body.newEmail, req.body.newPassword);
    res.end();
  })()
});

module.exports = router;
