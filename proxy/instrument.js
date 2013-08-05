var redis = require('redis'),
	$logger = require('../lib/logger');
var db = redis.createClient();
module.exports = function() {
	return function(req, res, next ) {
		$logger.trace('[ ' + req.headers.host + ' ] ' + req.method + ' => "' + req.url + '"');
		if (typeof (req.client._peername) !== 'undefined') {
			db.zincrby('stats:ip', 1, req.client._peername.address);
		}
		if (typeof (req.headers) !== 'undefined') {
			db.zincrby('stats:user-agent', 1, req.headers['user-agent']);
		}
		if (typeof (req.headers.host) !== 'undefined') {
			db.zincrby('stats:persite', 1, req.headers.host);
		}
		db.zincrby('stats:hits', 1, 'hit');
		next();
	};
};
