/**
* `TidalTokenError` error.
*
* TidalTokenError represents an error received from a Tidal's token
* endpoint.  Note that these responses don't conform to the OAuth 2.0
* specification.
*
* @constructor
* @param {string} [message]
* @param {string} [type]
* @param {number} [code]
* @access public
*/
function TidalTokenError(message, type, code) {
    Error.call(this);
    this.name = 'TidalTokenError';
    this.message = message;
    this.type = type;
    this.code = code;
    this.status = 500;
}

// Inherit from `Error`.
TidalTokenError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = TidalTokenError;
