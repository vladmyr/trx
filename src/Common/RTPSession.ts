import { Socket } from "dgram";
import { Readable } from "stream";

import { TPacket as TRTPPacket, RTPSession as KRTPSession } from "krtp";

enum CONTROL_COMMAND {
    START,
    PAUSE,
    STOP,
    DESTROY
}

class RTPSession {
    private _kRTPSession: typeof KRTPSession

    public constructor(port: number) {
        this._kRTPSession = new KRTPSession(port);
    }

    public getSession() {
        return this._kRTPSession;
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

type TDataBufferBitDepth = 8 | 16 | 32;

/**
 * CONCERN: is JS implementation slower compared to native TypedArrays' implememtatopms?
 */
class DataBuffer {
    protected _isBufferEmpty: boolean = true;
    protected _buffer: Buffer;
    protected _bufferReadIndex: number = 0;
    protected _bufferWriteIndex: number = 0;
    protected _bitDepth: TDataBufferBitDepth;

    protected static _CalcByteSize(length: number, bitDepth: TDataBufferBitDepth) {
        return length * (bitDepth / 8);
    }

    public constructor(length: number, bitDepth: TDataBufferBitDepth = 16) {
        const byteSize = DataBuffer._CalcByteSize(length, bitDepth);

        this._bitDepth = bitDepth;
        this._buffer = Buffer.allocUnsafe(byteSize);
    }

    public write(buffer: Buffer) {
        const writeCapacity = this._calcWriteCapacity();
        const writeCapacityAppend = this._calcWriteCapacityAppend();

        if (writeCapacity < buffer.length) {
            throw new Error("DataBuffer overflow");
        } else if (buffer.length <= writeCapacityAppend) {
            buffer.copy(this._buffer, this._bufferWriteIndex);
        } else {
            buffer.copy(this._buffer, this._bufferWriteIndex, 0, writeCapacityAppend);
            buffer.copy(this._buffer, 0, writeCapacityAppend);
        }

        this._bufferWriteIndex += buffer.length;
        this._bufferWriteIndex = this._bufferWriteIndex % this._buffer.length;
        this._isBufferEmpty = false;
    }

    public readBytes (readSize: number = 1) {
        const readCapacity = this._calcReadCapacity();
        const readCapacityAppend = this._calcReadCapacityAppend();

        if (this._isBufferEmpty || readCapacity < readSize) {
            throw new Error("DataBuffer underflow");
        }

        const readBuffer = Buffer.allocUnsafe(readSize);
        
        if (readSize <= readCapacityAppend) {
            this._buffer.copy(readBuffer, 0, this._bufferReadIndex, this._bufferReadIndex + readSize);
        } else {
            const readLengthFromHead = readCapacity - readCapacityAppend;
            const readLengthFromTail = this._buffer.length - this._bufferReadIndex;

            this._buffer.copy(readBuffer, 0, this._bufferReadIndex);
            this._buffer.copy(readBuffer, readLengthFromTail, 0, readLengthFromHead);
        }

        this._bufferReadIndex += readSize;
        this._bufferReadIndex = this._bufferReadIndex % this._buffer.length;
        this._isBufferEmpty = this._bufferReadIndex === this._bufferWriteIndex;

        return readBuffer;
    }

    public read(length: number = 1) {
        const elementSize = DataBuffer._CalcByteSize(1, this._bitDepth);
        const byteSize = elementSize * length;
        return this.readBytes(byteSize);
    }

    public reset() {
        this._bufferWriteIndex = 0;
        this._bufferReadIndex = 0;
        this._isBufferEmpty = true;
    }

    public getBufferedLength() {
        return Math.floor(this._calcReadCapacity() / DataBuffer._CalcByteSize(1, this._bitDepth));
    }

    public getBufferedByteLength() {
        return this._calcReadCapacity();
    }

    protected _calcReadCapacity() {
        const writeCapacity = this._calcWriteCapacity();
        return this._buffer.length - writeCapacity;
    }

    protected _calcReadCapacityAppend() {
        return this._bufferWriteIndex === this._bufferReadIndex
            ? this._isBufferEmpty
                ? 0
                : this._buffer.length - this._bufferWriteIndex
            : this._bufferReadIndex < this._bufferWriteIndex
                ? this._bufferWriteIndex - this._bufferReadIndex
                : this._buffer.length - this._bufferReadIndex;
    }

    protected _calcWriteCapacity() {
        return this._bufferWriteIndex === this._bufferReadIndex
            ? this._isBufferEmpty
                ? this._buffer.length
                : 0
            : this._bufferWriteIndex > this._bufferReadIndex
                ? this._buffer.length - this._bufferWriteIndex + this._bufferReadIndex
                : this._bufferReadIndex - this._bufferWriteIndex;
    }

    protected _calcWriteCapacityAppend() {
        return this._bufferWriteIndex === this._bufferReadIndex
            ? this._isBufferEmpty
                ? this._buffer.length - this._bufferWriteIndex
                : 0
            : this._bufferWriteIndex > this._bufferReadIndex
                ? this._buffer.length - this._bufferWriteIndex
                : this._bufferReadIndex - this._bufferWriteIndex;
    }
}


/**
 * TODO: search for more elegant solution
 */
class RTPReadable<T extends NodeJS.WritableStream> {
    protected _source: RTPSession;
    protected _dataBuffer: DataBuffer;
    protected _readable: Readable;
    protected _destination: NodeJS.WritableStream;
    protected _lowWaterMark: number;

    public constructor(port: number, destination: T, lowWaterMark: number = 24000, highWaterMark: number = 48000) {
        this._destination = destination;
        this._lowWaterMark = lowWaterMark;
        this._dataBuffer = new DataBuffer(highWaterMark);
        this._source = new RTPSession(port);
        this._readable = new Readable({
            highWaterMark: lowWaterMark,
            objectMode: false,
            read: this._readDataBuffer(this._dataBuffer),
        });
        this._readable.pause();
        this._bufferSource();
    }

    protected _destroy(err: Error, callback: Function) {
        this._source.close();
        this._dataBuffer.reset();
        this._readable.destroy(err);

    }

    protected _bufferSource() {
        this._source.on("message", (packet: TRTPPacket) => {
            // TODO: ensure correct packet write order
            this._dataBuffer.write(packet.payload);

            if (this._readable.isPaused()
                && this._dataBuffer.getBufferedByteLength() >= this._lowWaterMark * 4
                && typeof this._destination !== "undefined"
            ) {
                this._readable.pipe(this._destination);
            }
        });
    }

    protected _readDataBuffer(dataBuffer: DataBuffer) {
        return function (size?: number) {
            // @ts-ignore
            const readable: Readable = this;
            const buffer = dataBuffer.readBytes(size);
            readable.push(buffer);
        }
    }
}

export { TDataBufferBitDepth, DataBuffer, RTPReadable };