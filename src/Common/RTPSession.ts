import { Socket } from "dgram";
import { 
    Readable, 
    ReadableOptions,
    Writable, 
    WritableOptions
} from "stream";

const KRTPSession = require("krtp").RTPSession;

class RTPSession {
    private _kRTPSession: typeof KRTPSession

    public constructor(port: number) {
        this._kRTPSession = new KRTPSession(port);
    }

    public getSocket(): Socket {
        return this._kRTPSession.socket;
    }

    public getControlSocket(): Socket {
        return this._kRTPSession.controlSocket;
    }
}

// class TRPReadable extends Readable {
//     private _source: RTPSession 

//     public constructor(options: ReadableOptions) {
//         super(options);
//     }

//     public open(port: number) {
//         this._source = new RTPSession(port);
//     }

//     private _read(size: number) {
        
//     }
// }

// class RTPWritable extends Writable {
//     private _address: string;
//     private _port: number;
//     private _config: {}

//     public constructor(address: string, port: number, config: {}) {

//     }

//     public constructor(options: WritableOptions) {
//         super(options)
//     }

//     public connect(ip: string, port: number, config: {}) {

//     }

//     public close() {

//     }
// }

// export { RTPWritable, TRPReadable };