import * as chai from 'chai';
import TidalStrategy from '../lib/strategy';

chai.use(require('chai-passport-strategy'));

const tidalConfig = {
    clientID: 'ABC123',
    clientSecret: 'secret'
}

describe('Strategy', function() {

    describe('constructed', function() {

        let strategy = new TidalStrategy(tidalConfig, function(){});

        it('should be named tidal', function() {
            chai.expect(strategy.name).to.equal('tidal');
        });
    });

    describe('constructed with undefined options', function() {
        it('should throw', function() {
            chai.expect(function() {
                let strategy = new TidalStrategy(undefined, function(){});
            }).to.throw(Error);
        });
    })

    describe('authorization request', function() {
        let strategy = new TidalStrategy(tidalConfig, function(){});
        let url;

        before(function(done) {
            chai.passport.use(strategy)
            .redirect(function(u) {
                url = u;
                done();
            })
            .req(function(req) {}).authenticate();
        });
        it('should be redirected', function() {
            chai.expect(url).to.equal('https://auth-stage.tidal.com/v1/oauth2/authorize?response_type=code&client_id=' + tidalConfig.clientID);
        });
    });

    describe('failure caused by user denying request', function() {
        let strategy = new TidalStrategy(tidalConfig, function(){});
        let info;

        before(function(done) {
            chai.passport.use(strategy)
            .fail(function(i) {
                info = i;
                done();
            })
            .req(function(req) {
                req.query = {};
                req.query.denied = '8L74Y149';
            })
            .authenticate();
        });

        it('should fail', function() {
            chai.expect(info).to.be.undefined;
        });
    });


    describe('error caused by invalid code sent to token endpoint', function() {
        let strategy = new TidalStrategy(tidalConfig, function() {});

        strategy._oauth2.getOAuthAccessToken = function(code, options, callback) {
            return callback({ statusCode: 400, data: '{"error":{"message":"Invalid verification code format.","type":"OAuthException","code":100}}' });
        };

        let err;

        before(function(done) {
            chai.passport.use(strategy)
            .error(function(e) {
                err = e;
                done();
            })
            .req(function(req) {
                req.query = {};
                req.query.code = 'SplxlOBeZQQYbYS6WxSbIA+ALT1';
            })
            .authenticate();
        });

        it('should error', function() {
            chai.expect(err.constructor.name).to.equal('TidalTokenError');
            chai.expect(err.message).to.equal('Invalid verification code format.');
            chai.expect(err.type).to.equal('OAuthException');
            chai.expect(err.code).to.equal(100);
        });
    }); // error caused by invalid code sent to token endpoint

});
