// @flow
class User {
    id          : string;
    userId      : string;
    userName    : string;
    countryCode : string;
    channelId   : string;
    token       : string;
    email       : string;
    dynamoUser  : string;
    provider    : string;
    _raw        : Object;
    _json       : Object;
    constructor(user : Object) {
        this.id          = user.id;
        this.userId      = user.userId;
        this.userName    = user.userName;
        this.countryCode = user.countryCode;
        this.channelId   = user.channelId;
        this.token       = user.token;
        this.email       = user.email;
        this.dynamoUser  = user.dynamoUser;
        this.provider    = 'tidal';
        this._json       = user;
    }
}
export default User;
