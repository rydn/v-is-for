var $logger = require('../lib/logger');
//	module
module.exports = function($Routes ) {
	/**
	 * private method for getting hostname from string
	 *
	 * @method getHostname
	 *
	 * @param  {String}    str
	 *
	 * @return {String}
	 */

	function getHostname(str ) {
		var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
		return str.match(re)[1].toString();
	}
	//	bring routes into namespace then return handler
	return function(req, res, proxy ) {
		var $routes = $Routes();
		var route = $routes[req.headers.host];
		if (route) {
			if (route.indexOf('http://') == -1) {
				route = 'http://' + route;
			}
			var pathO = {
				hostname: getHostname(route),
				port: 0
			};
			//	seperate hostname and port
			pathO.port = Number(pathO.hostname.substring(pathO.hostname.indexOf(':') + 1, pathO.hostname.length));
			pathO.hostname = pathO.hostname.substring(0, pathO.hostname.indexOf(':'));
			//	if port and host are present proxy the request
			if ((pathO.port) && (pathO.hostname)) {
				proxy.proxyRequest(req, res, {
					host: pathO.hostname,
					port: pathO.port
				});
			} else {
				res.send('an error occured');
			}
		} else {
			$logger.debug('unknown route requested, host: ' + req.headers.host);
		}
	};
};
