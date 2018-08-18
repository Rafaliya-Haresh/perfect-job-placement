//
// process.env.NODE_ENV = 'production';
// process.env.PORT = 3042;
process.env.isCachesActivated = 'false';
process.env.cachesVersion = '1';

//
require('./index-old');
