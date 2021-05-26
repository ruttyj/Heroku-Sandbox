module.exports = class ActionRequest {

    constructor(connection) {
        this.mConnection = connection;
        this.mContext = new Map();
    }

    getConnection() {
        return this.mConnection;
    }

    getSocket() {
        return this.getConnection().getSocket();
    }

    getContext() {
        return this.mContext;
    }

    get(contextKey ) {
        return this.getContext().get(contextKey);
    }

    set(contextKey, value ) {
        return this.getContext().set(contextKey, value);
    }

    getPayload() {
        return this.getContext().get('payload');
    }
}