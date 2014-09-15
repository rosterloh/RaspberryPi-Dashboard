var expressJwt = require('express-jwt'), 	         // https://npmjs.org/package/express-jwt
    jwt        = require('jsonwebtoken'),  		     // https://npmjs.org/package/node-jsonwebtoken										
    MongoClient = require('mongodb').MongoClient,  // https://www.npmjs.org/package/mongodb
    bcrypt      = require('bcryptjs'),             // https://www.npmjs.org/package/bcryptjs
    config      = require('./config.js');

var SALT_WORK_FACTOR = 10;                         //No computation cycles with Encryption

/**
 * POST /register
 * @param {Request} req
 * @param {Response} res
 */
var register = function(req, res) {
  var username = req.body.username || '';
	var password = req.body.password || '';
	var email = req.body.email || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';

	//Angular form validation also ensures required fields are filled
	//Check to ensure passwordConfirmation matches password
	if (username === '' || password === '' || password !== passwordConfirmation) {
		return res.status(400).send('Bad Request:Registration error');
	}

	//check if username exists already
	MongoClient.connect(config.mongoUri, function(err, db) {
    if(err) { 
      console.log(err);
      return res.status(401).send('Error connecting to DB');
    }
    
    var collection = db.collection('users');
    collection.findOne({username: req.body.username}, function(err, user) {
      if (err) {
  		  console.log(err);
  		  res.status(401).send('Unauthorised-error finding username in DB');
  	  } else if(user) {
  	    //user exists already
  		  res.status(409).send('Conflict: username already exists');
  	  } else if (user === undefined) {
  	    //user does not exist already
  	    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if(err) {
            console.log(err);
            return res.status(401).send('Error salting password');
          }
          
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            if(err) {
              console.log(err);
              return res.status(401).send('Error hashing password');
            }
        
            var newUser = {
  			      username : req.body.username,
  			      password : hash,
  			      is_admin : true,
  			      email : req.body.email
  		      };
  		      
  		      collection.save(newUser, function() {
  		        if (err) {
        				console.log(err);
  			      	res.status(500).send('Internal Server Error: problem saving user to DB');
  			      }	else {
  				      return res.status(200).send('New user saved to DB ok');
  			      }
  		      });
          });
        });
      }
    });
	});
};

/**
 * POST /login
 * @param {Request} req
 * @param {Response} res
 */

var login = function(req, res) {
  //validate req.body.username and req.body.password
	//if is invalid, return 401
	var username = req.body.username || '';
	var password = req.body.password || '';
		
	//Angular Form validation also checks to ensure username and password fields are filled
	if (username === '' || password === '') { 
		return res.status(401).send('username or password fields are empty'); 
	}
	
	MongoClient.connect(config.mongoUri, function(err, db) {
    if(err) { 
      console.log(err);
      return res.status(401).send('Error connecting to DB');
    }
      
    var collection = db.collection('users');
    collection.findOne({username: req.body.username}, function(err, item) {
      if(err) { 
        console.log(err);
        return res.status(401).send("User undefined");
      } else {
        bcrypt.compare(req.body.password, item.password, function(err, isMatch) {
          if(err) {
            console.log(err);
            return res.status(401).send("Password compare error");
          } else {
            if(!isMatch) {
              console.log("Attempt failed to login with " + item.username);
              return res.status(401).send("Password does not match");
            } else {
              var userProfile = {
					      username: item.username,
					      admin: item.is_admin,
					      created: item.created,
					      email: item.email
				      };
              /*
				       * Build the JWT - using jsonwebtoken.js method sign(payload, secretOrPrivateKey, options)
				       * return type is a string
				       * put users profile inside the JWT (payload)
				       * Set token to expire in 24 hours (option)
				       */
				      var token = jwt.sign(userProfile, config.secret, { expiresInMinutes: 60*24 });
				      
				      // Send the token as JSON to user
        			res.json({ token: token });
            }
          }
        });
      }
    });
  });
};

/**
 * POST /logout
 * @param {Request} req
 * @param {Response} res
 */

var logout = function(req, res) {
	res.status(200).end();
};
	
/**
 * GET /
 * 
 * JWT is TX by client in HTTP packet header, JWT is checked 
 * Express will return 401 and stop the route if token is not valid
 * 
 * @param {Request} req
 * @param {Response} res
 */
var	getAdmin = function (req, res) {
	console.log('user ' + req.username + ' is calling /');
  console.info("req token=" +JSON.stringify(req.headers));
  res.send(req.username);
};


/**
 * GET /red
 * @param {Request} req
 * @param {Response} res
 */
var	getRed = function (req, res) {
	console.log('user ' + req.username + ' is calling /red');
  console.info("req token=" +JSON.stringify(req.headers));
  res.send(req.username);
};

/**
 * Node Module that will be available in server.js
 * @module
 * @param {Express} app
 */	
module.exports = function(app)
{
	/* ========================================================== 
	User Routes
	============================================================ */
	//app.post('/register', register);
	app.post('/login', login);
	app.post('/logout', logout);
	app.get('/', expressJwt({secret: config.secret}), getAdmin);
	app.get('/red', expressJwt({secret: config.secret}), getRed);

};
