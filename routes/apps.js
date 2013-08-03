module.exports = {
	get: function ( req, res ) {
		var $App = require( 'mongoose' ).model( 'App' );
		$App.find( {
			_id: req.query._id
		} ).skip( req.query.skip || 0 ).limit( req.query.limit || 100 ).exec( function ( err, apps ) {
			if ( err ) $logger.error( err );
			else res.json( apps );
		} );
	},
	post: function ( req, res ) {
		var $App = require( 'mongoose' ).model( 'App' );
		var newApp = new $App( {
			name: req.body.name,
			domain: req.body.domain,
			target: req.body.target
		} );
		newApp.save( function ( err, newAppO ) {
			if ( err ) throw err;
			else {
				res.json( newAppO );
			}
		} );
	},
	delete: function ( req, res ) {
		$App.find( {
			_id: req.params._id
		}, function ( err, app ) {
			if ( err ) throw err;
			else {
				app.remove( function ( err ) {
					if ( err ) throw err;
					else {
						res.json( {
							result: 'ok'
						} );
					}
				} );
			}
		} );
	}
};