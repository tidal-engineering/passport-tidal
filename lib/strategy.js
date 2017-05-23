// Load modules.
import OAuth2Strategy from 'passport-oauth2';
import TidalTokenError from './errors/tidalTokenError';
import util from 'util';
import uri from 'url';
import User from './models/user';

/**
* `Strategy` constructor.
*
* The Tidal authentication strategy authenticates requests by delegating to
* Tidal using the OAuth2 protocol.
*
* Applications must supply a `verify` callback which accepts a `token`,
* and service-specific `profile`, and then calls the `cb` callback supplying
* a `user`, which should be set to `false` if the credentials are not valid.
* If an exception occured, `err` should be set.
*
* Options:
*   - `clientID`     identifies client to Tidal
*   - `clientSecret`  secret used to establish ownership of the consumer key
*   - `callbackURL`     URL to which Tidal will redirect the user after obtaining authorization
*
* Examples:
*     passport.use(new TidalStrategy({
*         clientID: '123-456-789',
*         clientSecret: 'shhh-its-a-secret'
*         callbackURL: 'https://www.example.net/auth/tidal/callback'
*       },
*       function(token, profile, cb) {
*         User.findOrCreate(..., function (err, user) {
*           cb(err, user);
*         });
*       }
*     ));
*
* @constructor
* @param {object} options
* @param {function} verify
* @access public
*/
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://login.tidal.com/authorize';
    options.tokenURL = options.tokenURL || 'https://login.tidal.com/oauth2/token';
    OAuth2Strategy.call(this, options, verify);
    this.name = 'tidal';
    this._userProfileURL = options.userProfileURL || 'https://login.tidal.com/oauth2/user';
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

/**
* Authenticate request by delegating to Tidal using OAuth.
*
* @param {http.IncomingMessage} req
* @param {object} [options]
* @access protected
*/
Strategy.prototype.authenticate = function(req, options): any {
    if (req.query && req.query.denied) {
        return this.fail();
    }

    if (req.session && req.session.lang) {
        this._oauth2._authorizeUrl = this._oauth2._authorizeUrl + '?lang=' + req.session.lang;
    }

    // Call the base class for standard OAuth2 authentication.
    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};

/**
* Retrieve user profile from Tidal.
*
* This function constructs a normalized profile, with the following properties:
*
*   - `id`        (equivalent to `user_id`)
*   - `username`  (equivalent to `screen_name`)
*
* @param {string} token
* @param {function} done
* @access protected
*/
Strategy.prototype.userProfile = function(token, done) {
    let json;

    let url = uri.parse(this._userProfileURL);

    this._oauth2.get(uri.format(url), token, function (err, body): Function {
        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                } catch (_) { return done(new OAuth2Strategy.InternalOAuthError('Failed to fetch user profile', err)); }
            }

            if (json && json.errors && json.errors.length) {
                let e = json.errors[0];
                // return done(new APIError(e.message, e.code));
                return done(new OAuth2Strategy.InternalOAuthError('Failed to fetch user profile', e));
            }
            return done(new OAuth2Strategy.InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        let user = new User(json);
        user._raw = body;

        done(null, user);
    });

};

/**
* Parse error response from Tidal OAuth2 endpoint.
*
* @param {string} body
* @param {number} status
* @return {Error}
* @access protected
*/
Strategy.prototype.parseErrorResponse = function(body): Object {
    let json = JSON.parse(body);
    if (json.error && typeof json.error == 'object') {
        return new TidalTokenError(json.error.message, json.error.type, json.error.code);
    }
    return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};

// Expose constructor.
export default Strategy;
