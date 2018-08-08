import { Socket } from "dgram";
import { 
    Readable, 
    ReadableOptions,
    Writable, 
    WritableOptions
} from "stream";

const KRTPSession = require("krtp").RTPSession;

// FIXME: ava-ts doesn't recognize *.d.ts files
// import { TPacket } from "krtp";

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
    protected _buffer: Buffer;
    protected _bufferReadIndex: number = 0;
    protected _bufferWriteIndex: number = 0;
    protected _bitDepth: number;    // FIXME: might not be needed

    public constructor(size: number, bitDepth: number = 16) {
        this._buffer = Buffer.allocUnsafe(size);
        this._bitDepth = bitDepth;
    }

    public write(buffer: Buffer) {
        const writeCapacity = this._calcWriteCapacity();
        const writeCapacityAppend = this._calcWriteCapacityAppend();

        if (writeCapacity < buffer.length) {
            throw new Error("DataBuffer overflow");
        } else if (writeCapacity === writeCapacityAppend) {
            buffer.copy(this._buffer, this._bufferWriteIndex);
            this._bufferWriteIndex += buffer.length;
        } else {
            buffer.copy(this._buffer, this._bufferWriteIndex, 0, writeCapacityAppend);
            buffer.copy(this._buffer, 0, writeCapacityAppend + 1);
            this._bufferWriteIndex = buffer.length - writeCapacityAppend + 1;
        }

        this._bufferWriteIndex = this._bufferWriteIndex % this._buffer.length;
    }

    public read(size: number = 1) {
        const readCapacity = this._calcReadCapacity();
        const readCapacityAppend = this._calcReadCapacityAppend();

        if (readCapacity < size) {
            throw new Error("DataBuffer underflow");
        }

        const readBuffer = Buffer.allocUnsafe(size);
        
        if (readCapacity === readCapacityAppend) {
            this._buffer.copy(readBuffer, 0, this._bufferReadIndex, this._bufferReadIndex + 1);
        } else {
            const readLengthFromHead = readCapacity - readCapacityAppend;
            const readLengthFromTail = this._buffer.length - this._bufferReadIndex + 1;

            this._buffer.copy(readBuffer, 0, this._bufferReadIndex, this._buffer.length);
            this._buffer.copy(readBuffer, readLengthFromTail + 1, 0, readLengthFromHead);
        }

        this._bufferReadIndex += size;
        this._bufferReadIndex = this._bufferReadIndex % this._buffer.length;

        return readBuffer;
    }

    protected _calcReadCapacity() {
        const writeCapacity = this._calcWriteCapacity();
        return this._buffer.length - writeCapacity + 1;
    }

    protected _calcReadCapacityAppend() {
        return this._bufferWriteIndex == this._bufferReadIndex
            ? 0
            : this._bufferReadIndex < this._bufferWriteIndex
                ? this._bufferWriteIndex - this._bufferReadIndex
                : this._buffer.length - this._bufferReadIndex + 1;
    }

    protected _calcWriteCapacity() {
        return this._bufferWriteIndex == this._bufferReadIndex
            ? this._buffer.length
            : this._bufferWriteIndex > this._bufferReadIndex
                ? this._buffer.length - this._bufferWriteIndex + this._bufferReadIndex + 1
                : this._bufferReadIndex - this._bufferWriteIndex;
    }

    protected _calcWriteCapacityAppend() {
        return this._bufferWriteIndex > this._bufferReadIndex
            ? this._buffer.length - this._bufferWriteIndex + 1
            : this._calcWriteCapacity();
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
        this._source.on("message", (chunk: any) => {
            if (!this.push(chunk)) {
                this.push(null);
                this._clearDataBuffer();
            }


        })
    }

    private _clearDataBuffer(offset: number = 0) {
        this._dataBuffer.slice(offset);
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

export { DataBuffer };