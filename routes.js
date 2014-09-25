var jwt         = require('jwt-simple'),
    mongoose    = require('mongoose'),
    moment      = require('moment'),
    bcrypt      = require('bcryptjs'),
    request     = require('request'),
    config      = require('./config.js');

var SALT_WORK_FACTOR = 10;  //No computation cycles with Encryption

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  google: String,
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

mongoose.connect(config.MONGO_URI);

/**
 * Login Required Middleware
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.TOKEN_SECRET);

  if (payload.exp <= Date.now()) {
    return res.status(401).send({ message: 'Token has expired' });
  }

  req.user = payload.sub;
  next();
}

/**
 * Generate JSON Web Token
 * 
 * @param {Request} req
 * @param {User} user
 */
function createToken(req, user) {
  var payload = {
    iss: req.hostname,
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/**
 * GET /api/me
 * 
 * @param {Request} req
 * @param {Response} res
 */
var getUser = function(req, res) {
  User.findById(req.user, function (err, user) {
      res.send(user);
  });
};

/**
 * PUT /api/me
 * 
 * @param {Request} req
 * @param {Response} res
 */
var updateUser = function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
};

/**
 * POST /auth/login
 * 
 * @param {Request} req
 * @param {Response} res
 */
var emailLogin = function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Wrong email and/or password' });
    }

    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong email and/or password' });
      }
      res.send({ token: createToken(req, user) });
    });
  });
};

/**
 * POST /auth/signup
 * 
 * @param {Request} req
 * @param {Response} res
 */
var emailSignUp = function(req, res) {
  var user = new User();
  user.displayName = req.body.displayName;
  user.email = req.body.email;
  user.password = req.body.password;
  user.save(function(err) {
    res.send({ token: createToken(req, user) });
  });
};

/**
 * POST /auth/google
 * 
 * @param {Request} req
 * @param {Response} res
 */
var googleLogin = function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.GOOGLE_SECRET,
    code: req.body.code,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {

    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {

      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }

          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);

          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.displayName = user.displayName || profile.name;
            user.save(function(err) {
              res.send({ token: createToken(req, user) });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createToken(req, existingUser) });
          }

          var user = new User();
          user.google = profile.sub;
          user.displayName = profile.name;
          user.save(function(err) {
            res.send({ token: createToken(req, user) });
          });
        });
      }
    });
  });
};

/**
 * GET /auth/unlink/:provider
 * 
 * @param {Request} req
 * @param {Response} res
 */
var unlinkProvider = function(req, res) {
  var provider = req.params.provider;
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    user[provider] = undefined;
    user.save(function(err) {
      res.status(200).end();
    });
  });
};

/**
 * GET /red
 * 
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
	app.get('/api/me', ensureAuthenticated, getUser);
	app.put('/api/me', ensureAuthenticated, updateUser);
	app.post('/auth/login', emailLogin);
	app.post('/auth/signup', emailSignUp);
	app.post('/auth/google', googleLogin);
	app.get('/auth/unlink/:provider', ensureAuthenticated, unlinkProvider);
	//app.get('/red', ensureAuthenticated, getRed);
};
