import { Socket } from "dgram";
import { 
    Readable, 
    ReadableOptions,
    Writable, 
    WritableOptions
} from "stream";

const KRTPSession = require("krtp").RTPSession;
import { TPacket } from "krtp";

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

class DataBuffer {
    private _buffer: Buffer;
    private _bufferWriteOffset: number;
    private _bufferLength: number;

    public constructor(size: number) {
        this._buffer = Buffer.allocUnsafe(size);
        this._bufferLength = 0;
        this._bufferWriteOffset = 0;
    }

    public write(buffer: Buffer) {
        this._bufferWriteOffset += buffer.byteLength;
        this._buffer.
    }

    public read(size: number = 1) {

    }
}

class TRPReadable extends Readable {
    private _source: RTPSession;
    private _dataBuffer: Buffer;
    private _dataBufferLength: number;
    private _dataBufferWriteIndex: number;

    public constructor(lowWaterMark: number, highWaterMark: number) {
        super({ highWaterMark });

        this._dataBufferLength = lowWaterMark * 2;
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
        this._source.on("message", (chunk: TPacket) => {
            if (!this.push(chunk)) {
                this.push(null);
                this._clearDataBuffer();
            }


        })
    }

    private _clearDataBuffer(offset: number = 0) {
        this._dataBuffer.slice(offset);
    }

    private _pushDataBufferChunk(chunk: TPacket) {

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

export { DataBuffer };