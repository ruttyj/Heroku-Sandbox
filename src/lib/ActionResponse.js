const AddressedResponse = require('./AddressedResponse');
const Affected = require('./Affected');

module.exports = class ActionResponse {

    constructor() {
        this.mAffected = new Affected();
        this.mAddressedResponses = new AddressedResponse();
        this.mFailure = false;
    }

    getAffected() {
        return this.mAffected;
    }

    getAddressedResponses() {
        return this.mAddressedResponses;
    }

    isFailure() {
        return this.mFailure;
    }

    setIsFailure(value) {
        this.mFailure = value;
    }
}