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

    public close(): void {
        this._kRTPSession.close();
    }

    public on(eventName: string, handler: (...args: any[]) => void): void {
        this._kRTPSession.on(eventName, handler);
    }

    public getSocket(): Socket {
        return this._kRTPSession.socket;
    }

    public getControlSocket(): Socket {
        return this._kRTPSession.controlSocket;
    }
}

class TRPReadable extends Readable {
    private _source: RTPSession;
    private _dataBuffer: any[] = [];
    private _lowWaterMark: number;

    public constructor(lowWaterMark: number, highWaterMark: number) {
        super({ highWaterMark });

        this._lowWaterMark = lowWaterMark;
    }

    public open(port: number) {
        this._source = new RTPSession(port);
        this._ondata();
    }

    public _read(size: number) {
        
    }

    public _destroy(err: Error, callback: Function) {
        this._source.close();

        super._destroy(err, callback);
    }

    private _ondata() {
        this._source.on("message", (chunk) => {
            if (!this.push(chunk)) {
                this.push(null);
                this._clearDataBuffer();
            }


        })
    }

    private _clearDataBuffer() {
        this._dataBuffer.slice(0);
    }

    private _pushDataBufferChunk(chunk: any) {

    }
}

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