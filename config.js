/**
 * place enviroment specific configuration here
 */
var configer = require( './lib/configer' );
//////////////////
//	DEVELOPMENT //
//////////////////
configer.development = {
	"constr": "mongodb://localhost/visfor",
	"url_base": "localhost", //	url without http and ports
	"proxy_port": 80,
	"admin_port": 5000,
	"admin_public": '/app'
};
/////////////////
//	PRODUCTION //
/////////////////
configer.production = {
	"constr": "mongodb://data.domain.com/visfor",
	"url_base": "domain.com", //	url without http and ports
	"proxy_port": 80,
	"admin_port": 5000,
	"admin_public": '/dist'
};

configer.default_env = "development";
module.exports = configer.apply( );
