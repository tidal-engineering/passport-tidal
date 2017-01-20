import user from '../../lib/models/user';
import * as chai from 'chai';

describe('user model', function() {

    const userData = {
        id         : '123',
        userId     : '123a',
        userName   : 'nik',
        countryCode: 'NO',
        channelId  : 'channelId',
        token      : '43kiojio123io1j232',
        email      : 'nik@fake.no',
        dynamoUser : 'dynamoUser'
    };
    let userModel = new user(userData);

    it('should be imported and created', function() {
        chai.expect(userModel.countryCode).to.equal('NO');
    });
});
