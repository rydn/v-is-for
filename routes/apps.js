var $logger = require( '../lib/logger' );
module.exports = {
	get: function ( req, res ) {
		var $App = require( 'mongoose' ).model( 'App' );
		var query;
		if ( req.query._id ) {
			query = {
				_id: req.query._id
			};
		}
		$App.find( query ).skip( req.query.skip || 0 ).limit( req.query.limit || 100 ).exec( function ( err, apps ) {
			if ( err ) $logger.error( err );
			else res.json( apps );
		} );
	},
	query: function ( req, res ) {
		var $App = require( 'mongoose' ).model( 'App' );
		$App.find( {
			_id: req.params._id
		} ).skip( req.query.skip || 0 ).limit( req.query.limit || 100 ).exec( function ( err, app ) {
			if ( err ) $logger.error( err );
			else res.json( app );
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
		var $App = require( 'mongoose' ).model( 'App' );
		$App.remove( {
			_id: req.params.id
		}, function ( err, app ) {
			if ( err ) throw err;
			else {
				res.json( {
					result: req.params.id + ' deleted'
				} );
			}
		} );
	},
	update: function ( req, res ) {
		var $App = require( 'mongoose' ).model( 'App' );
		var updateObject = {};
		updateObject[ req.body.param ] = req.body.value;
		$App.update( {
			_id: req.params._id
		}, {
			$set: updateObject
		}, function ( err, app ) {
			if ( err ) $logger.error( err );
			else {
				$logger.info( 'update app "' + req.params._id + '" param: "' + req.body.param + '" with "' + req.body.value + '" succeeded' );
				res.json( app );
			}
		} );
	}
};