// @flow

// Load modules.
import Strategy           from './strategy';
import AuthorizationError from './errors/authorizationerror';
import TokenError         from './errors/tokenerror';
import InternalOAuthError from './errors/internaloautherror';


// Exports
export {
    Strategy as default,
    Strategy,
    AuthorizationError,
    TokenError,
    InternalOAuthError
};

// // Expose Strategy.
// exports = module.exports = Strategy;
//

// exports.Strategy = Strategy;
//
// exports.AuthorizationError = AuthorizationError;
// exports.TokenError = TokenError;
// exports.InternalOAuthError = InternalOAuthError;
