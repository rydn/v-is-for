function configer( ) {
	// apply the environment
	// [param] strict: usually, giving an invalid environment name
	//                 would fall back to default. make true to
	//                 throw an error for an invalid env instead.
	this.apply = function ( options ) {
		if ( !options ) options = {};
		if ( this.default_env && !this[ this.default_env ] ) {
			// default not found
			throw new Error( 'configer: no configuration found for default environment `' + this.default_env + '`' );
		}
		var envName = process.env.NODE_ENV;
		if ( this[ envName ] ) {
			// environment matched
			var env = defaultDeep( {}, this[ envName ] );
			if ( this.default_env ) {
				if ( options.strictProperties ) {
					dPropCompare( env, this[ this.default_env ], envName, this.default_env );
				} else {
					env = defaultDeep( env, this[ this.default_env ] );
				}
			}
			return env;
		} else {
			// no environment matched
			if ( envName && options.strict ) {
				// env defined, but not matched
				throw new Error( 'configer: couldn\'t find environment `' + envName + '`' );
			} else {
				// env is undefined/empty
				if ( !this.default_env ) {
					throw new Error( 'configer: no default environment found' );
				} else if ( this.default_env && this[ this.default_env ] ) {
					// return default
					return defaultDeep( {}, this[ this.default_env ] );
				}
			}
		}
	};
}

function defaultDeep( obj ) {
	Array.prototype.slice.call( arguments, 1 )
		.forEach( function ( source ) {
			for ( var prop in source ) {
				if ( typeof obj[ prop ] === 'undefined' ) {
					obj[ prop ] = source[ prop ];
				} else if ( typeof obj[ prop ] === 'object' && typeof source[ prop ] === 'object' ) {
					obj[ prop ] = defaultDeep( obj[ prop ], source[ prop ] );
				}
			}
		} );
	return obj;
}

function dPropCompare( env1, env2, env1Name, env2Name, propContext ) {
	if ( !propContext )
		propContext = "";
	for ( var prop in env2 ) {
		if ( typeof env1[ prop ] === 'undefined' ) {
			throw new Error( 'configer: environment `' + env1Name + '` missing property `' + propContext + prop + '` defined in `' + env2Name + '`' );
		} else if ( typeof env1[ prop ] === 'object' && typeof env2[ prop ] === 'object' ) {
			dPropCompare( env1[ prop ], env2[ prop ], env1Name, env2Name, propContext + prop + '.' );
		}
	}
}
module.exports = new configer( );
