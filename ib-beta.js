//
process.env.NODE_ENV = 'beta';
process.env.PORT = 3042;
process.env.isCachesActivated = 'true';
process.env.cachesVersion = '20';


//
require('./index-old');
