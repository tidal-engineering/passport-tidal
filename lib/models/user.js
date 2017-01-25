// @flow
class User {
    userId     : string;
    email      : string;
    countryCode: string;
    fullName   : string;
    firstName  : string;
    lastName   : string;
    nickname   : string;
    username   : string;
    address    : string;
    city       : string;
    postalcode : string;
    usState    : string;
    phoneNumber: string;
    birthday   : string;
    gender     : string;
    imageId    : string;
    channelId  : string;
    parentId   : string;
    _raw       : Object;
    _json      : Object;
    constructor(user : Object) {
        this.userId      = user.userId;
        this.email       = user.email;
        this.countryCode = user.countryCode;
        this.fullName    = user.fullName;
        this.firstName   = user.firstName;
        this.lastName    = user.lastName;
        this.nickname    = user.nickname;
        this.username    = user.username;
        this.address     = user.address;
        this.city        = user.city;
        this.postalcode  = user.postalcode;
        this.usState     = user.usState;
        this.phoneNumber = user.phoneNumber;
        this.birthday    = user.birthday;
        this.gender      = user.gender;
        this.imageId     = user.imageId;
        this.channelId   = user.channelId;
        this.parentId    = user.parentId;
        this.provider    = 'tidal';
        this._json       = user;
    }
}
export default User;
