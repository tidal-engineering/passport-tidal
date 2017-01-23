import strategy from '../lib/index';
import * as chai from 'chai';

describe('passport-tidal', function() {

    it('should export Strategy constructor', function() {
        chai.expect(strategy.Strategy).to.be.a('function');
    });

    it('should export Strategy constructor as module', function() {
        chai.expect(strategy).to.be.a('function');
        chai.expect(strategy).to.equal(strategy.Strategy);
    });

});
