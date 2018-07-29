import { Socket } from "dgram";

const KRTPSession = require("krtp").RTPSession;

class RTPSession {
    private _kRTPSession: typeof KRTPSession

    public constructor(port: number) {
        this._kRTPSession = new KRTPSession(port);
    }

    public getControlSocket(): Socket {
        return this._kRTPSession.controlSocket;
    }
}

class RTPWriteStream {
    private _address: string;
    private _port: number;
    private _config: {}

    public constructor(address: string, port: number, config: {}) {

    }

    public connect() {

    }

    public close() {

    }
}

class RTPReadStream {

}

export default RTPSession;