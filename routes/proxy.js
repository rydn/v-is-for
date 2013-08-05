var $logger = require('../lib/logger');
module.exports = {
	restart: function($proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function(req, res ) {
			$logger.info('restarting proxy...');
			$this.proxy.restart();
			res.json({
				result: 'restarting'
			});
		};
	},
	stop: function($proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function(req, res ) {
			$logger.info('stopping proxy...');
			$this.proxy.stop();
			res.json({
				result: 'stopping'
			});
		};
	},
	start: function($proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function(req, res ) {
			$logger.info('starting proxy...');
			$this.proxy.start();
			res.json({
				result: 'starting'
			});
		};
	},
	status: function($proxy ) {
		var $this = this;
		$this.proxy = $proxy;
		return function(req, res ) {
			res.json({
				status: $this.proxy.status
			});
		};
	}
};
