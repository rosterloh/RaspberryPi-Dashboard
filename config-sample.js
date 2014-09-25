module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://<dbuser>:<dbpassword>@mongo.com/db-name',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'Google Client Secret'
};