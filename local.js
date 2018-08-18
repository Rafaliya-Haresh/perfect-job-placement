//
process.env.PORT = 3000;
process.env.NODE_ENV = 'developement';
process.env.isCachesActivated = 'false';
process.env.cachesVersion = '1';

//
require('./index-old');
