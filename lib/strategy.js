// Load modules.
import OAuthStrategy from 'passport-oauth1';
import util from 'util';
import uri from 'url';
import XML from 'xtraverse';
import InternalOAuthError from 'passport-oauth1';
import APIError from './errors/apierror';
import User from './models/user';

/**
* `Strategy` constructor.
*
* The Twitter authentication strategy authenticates requests by delegating to
* Twitter using the OAuth protocol.
*
* Applications must supply a `verify` callback which accepts a `token`,
* `tokenSecret` and service-specific `profile`, and then calls the `cb`
* callback supplying a `user`, which should be set to `false` if the
* credentials are not valid.  If an exception occured, `err` should be set.
*
* Options:
*   - `consumerKey`     identifies client to Twitter
*   - `consumerSecret`  secret used to establish ownership of the consumer key
*   - `callbackURL`     URL to which Twitter will redirect the user after obtaining authorization
*
* Examples:
*
*     passport.use(new TwitterStrategy({
*         consumerKey: '123-456-789',
*         consumerSecret: 'shhh-its-a-secret'
*         callbackURL: 'https://www.example.net/auth/twitter/callback'
*       },
*       function(token, tokenSecret, profile, cb) {
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
    options.requestTokenURL = options.requestTokenURL || 'https://api.twitter.com/oauth/request_token';
    options.accessTokenURL = options.accessTokenURL || 'https://api.twitter.com/oauth/access_token';
    options.userAuthorizationURL = options.userAuthorizationURL || 'https://api.twitter.com/oauth/authenticate';
    options.sessionKey = options.sessionKey || 'oauth:tidal';

    OAuthStrategy.call(this, options, verify);
    this.name = 'tidal';
    this._userProfileURL = options.userProfileURL || 'https://api.twitter.com/1.1/account/verify_credentials.json';
}

// Inherit from `OAuthStrategy`.
util.inherits(Strategy, OAuthStrategy);

/**
* Authenticate request by delegating to Twitter using OAuth.
*
* @param {http.IncomingMessage} req
* @param {object} [options]
* @access protected
*/
Strategy.prototype.authenticate = function(req, options): any {
    // When a user denies authorization on Twitter, they are presented with a link
    // to return to the application in the following format (where xxx is the
    // value of the request token):
    //
    //     http://www.example.com/auth/twitter/callback?denied=xxx
    //
    // Following the link back to the application is interpreted as an
    // authentication failure.
    if (req.query && req.query.denied) {
        return this.fail();
    }

    // Call the base class for standard OAuth authentication.
    OAuthStrategy.prototype.authenticate.call(this, req, options);
};

/**
* Retrieve user profile from Twitter.
*
* This function constructs a normalized profile, with the following properties:
*
*   - `id`        (equivalent to `user_id`)
*   - `username`  (equivalent to `screen_name`)
*
* Note that because Twitter supplies basic profile information in query
* parameters when redirecting back to the application, loading of Twitter
* profiles *does not* result in an additional HTTP request, when the
* `skipExtendedUserProfile` option is enabled.
*
* @param {string} token
* @param {string} tokenSecret
* @param {object} params
* @param {function} done
* @access protected
*/
Strategy.prototype.userProfile = function(token, tokenSecret, params, done) {
    var json;

    var url = uri.parse(this._userProfileURL);
    url.query = url.query || {};
    if (url.pathname.indexOf('/users/show.json') == (url.pathname.length - '/users/show.json'.length)) {
        url.query.user_id = params.user_id;
    }
    if (this._includeEmail == true) {
        url.query.include_email = true;
    }
    if (this._includeStatus == false) {
        url.query.skip_status = true;
    }
    if (this._includeEntities == false) {
        url.query.include_entities = false;
    }

    this._oauth.get(uri.format(url), token, tokenSecret, function (err, body): Function {
        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                } catch (_) { return done(new InternalOAuthError.InternalOAuthError('Failed to fetch user profile', err)); }
            }

            if (json && json.errors && json.errors.length) {
                var e = json.errors[0];
                return done(new APIError(e.message, e.code));
            }
            return done(new InternalOAuthError.InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var user = new User(json);
        user._raw = body;

        done(null, user);
    });

};

/**
* Parse error response from Tidal OAuth endpoint.
*
* @param {string} body
* @param {number} status
* @return {Error}
* @access protected
*/
Strategy.prototype.parseErrorResponse = function(body): Object {
    var json, xml;

    try {
        json = JSON.parse(body);
        if (Array.isArray(json.errors) && json.errors.length > 0) {
            return new Error(json.errors[0].message);
        }
    } catch (ex) {
        xml = XML(body);
        return new Error(xml.children('error').t() || body);
    }
};

// Expose constructor.
export default Strategy;
