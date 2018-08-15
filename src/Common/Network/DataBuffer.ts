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

    public readMaxBytes(readMaxSize: number) {
        const readCapacity = this._calcReadCapacity();
        const readSize = Math.min(readCapacity, readMaxSize);

        return this.readBytes(readSize);
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

export default DataBuffer;
export { TDataBufferBitDepth }