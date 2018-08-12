process.env.NODE_ENV = 'stage';
process.env.PORT = 3040;
process.env.isCachesActivated = 'true';
process.env.cachesVersion = '1';

//
require('./index-old');
