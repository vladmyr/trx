import test from "ava";
import { TDataBufferBitDepth, DataBuffer } from "../../src/Common/RTPSession";

const BUFFER_LENGTH = 16;
const BUFFER_BIT_DEPTH = 16;

class DataBufferTest extends DataBuffer {
    public static CalcByteSize(length: number, bitDepth: TDataBufferBitDepth) {
        return super._CalcByteSize(length, BUFFER_LENGTH);
    }

    public static GenDummyArray(
        bitDepth: TDataBufferBitDepth, 
        length: number, 
        startNumber: number
    ) {
        const bufferByteSize = DataBufferTest._CalcByteSize(length, bitDepth);
        const offsetIndexMultiplier = bufferByteSize / length;
        const buffer = Buffer.allocUnsafe(bufferByteSize);

        for (let i = 0; i < length; i++) {
            const value = i + startNumber;
            const index = i * offsetIndexMultiplier;

            if (bitDepth === 8) {
                buffer.writeUInt8(value, index);
            } else if (bitDepth === 16) {
                buffer.writeUInt16LE(value, index);
            } else {
                buffer.writeUInt32LE(value, index);
            }
        }

        return buffer;
    }

    public getBuffer() { return this._buffer; }
    public getIsBufferEmpty() { return this._isBufferEmpty; }
    public getWriteIndex() { return this._bufferWriteIndex; }
    public getReadIndex() { return this._bufferReadIndex; }
    public calcReadCapacity() { return super._calcReadCapacity(); }
    public calcReadCapacityAppend() { return super._calcReadCapacityAppend(); }
    public calcWriteCapacity() { return super._calcWriteCapacity(); }
    public calcWriteCapacityAppend() { return super._calcWriteCapacityAppend(); }

    public writeUint16Fluently(length: number = 1, startNumber: number = 0) {
        return this._writeFluently(16, length, startNumber);
    }

    private _writeFluently(
        bitDepth: TDataBufferBitDepth, 
        length: number, 
        startNumber: number
    ) {
        this.write(DataBufferTest.GenDummyArray(bitDepth, length, startNumber));
    }
}

test("[DataBuffer] Single buffer write", (t) => {
    const elementSize = DataBufferTest.CalcByteSize(1, BUFFER_BIT_DEPTH);
    const dataBuffer = new DataBufferTest(BUFFER_LENGTH, BUFFER_BIT_DEPTH);
    const dataBuffer2 = new DataBufferTest(BUFFER_LENGTH, BUFFER_BIT_DEPTH);

    // dataBuffer
    t.deepEqual(dataBuffer.getIsBufferEmpty(), true);

    dataBuffer.writeUint16Fluently(4);

    t.deepEqual(dataBuffer.getIsBufferEmpty(), false);
    t.deepEqual(dataBuffer.getWriteIndex(), 4 * elementSize);
    t.deepEqual(dataBuffer.getReadIndex(), 0);

    // dataBuffer2
    t.deepEqual(dataBuffer2.getIsBufferEmpty(), true);

    dataBuffer2.writeUint16Fluently(BUFFER_LENGTH);

    t.deepEqual(dataBuffer2.getIsBufferEmpty(), false);
    t.deepEqual(dataBuffer2.getWriteIndex(), 0);
    t.deepEqual(dataBuffer2.getReadIndex(), 0);
});

test("[DataBuffer] Multiple buffer writes", (t) => {
    const elementSize = DataBufferTest.CalcByteSize(1, BUFFER_BIT_DEPTH);
    const dataBuffer = new DataBufferTest(BUFFER_LENGTH, BUFFER_BIT_DEPTH);

    dataBuffer.writeUint16Fluently(2);
    dataBuffer.writeUint16Fluently(4, 2);
    dataBuffer.writeUint16Fluently(8, 6);

    t.deepEqual(dataBuffer.getWriteIndex(), 14 * elementSize);
});

test("[DataBuffer] Single buffer write/read - half capacity", (t) => {
    const startNumber = 0;
    const readWriteSize = BUFFER_LENGTH / 2;

    const elementSize = DataBufferTest.CalcByteSize(1, BUFFER_LENGTH);
    const dataBuffer = new DataBufferTest(BUFFER_LENGTH, BUFFER_BIT_DEPTH);
    const expectedBuffer = DataBufferTest.GenDummyArray(BUFFER_LENGTH, readWriteSize, startNumber);

    dataBuffer.writeUint16Fluently(readWriteSize);

    t.deepEqual(dataBuffer.getIsBufferEmpty(), false);
    t.deepEqual(dataBuffer.getReadIndex(), 0);
    t.deepEqual(dataBuffer.getWriteIndex(), readWriteSize * elementSize);
    t.deepEqual(dataBuffer.calcReadCapacity(), readWriteSize * elementSize);

    const readBuffer = dataBuffer.read(readWriteSize);

    t.deepEqual(dataBuffer.getIsBufferEmpty(), true);
    t.deepEqual(dataBuffer.getWriteIndex(), dataBuffer.getReadIndex());
    t.deepEqual(dataBuffer.calcWriteCapacity(), BUFFER_LENGTH * elementSize);
    t.deepEqual(dataBuffer.calcReadCapacity(), 0);
    t.deepEqual(readBuffer, expectedBuffer);
})

test("[DataBuffer] Single buffer write/read - full capacity", (t) => {
    const elementSize = DataBufferTest.CalcByteSize(1, BUFFER_LENGTH);

    const dataBuffer = new DataBufferTest(BUFFER_LENGTH, BUFFER_BIT_DEPTH);
    const startNumber = 32769;
    const readWriteSize = BUFFER_LENGTH;

    const expectedBuffer = DataBufferTest.GenDummyArray(BUFFER_LENGTH, readWriteSize, startNumber);

    dataBuffer.writeUint16Fluently(readWriteSize, startNumber);

    t.deepEqual(dataBuffer.getIsBufferEmpty(), false);
    t.deepEqual(dataBuffer.getReadIndex(), 0);
    t.deepEqual(dataBuffer.getWriteIndex(), 0);
    t.deepEqual(dataBuffer.calcWriteCapacity(), 0);
    t.deepEqual(dataBuffer.calcReadCapacity(), readWriteSize * elementSize);

    const readBuffer = dataBuffer.read(readWriteSize);

    t.deepEqual(dataBuffer.getIsBufferEmpty(), true);
    t.deepEqual(dataBuffer.getWriteIndex(), dataBuffer.getReadIndex());
    t.deepEqual(dataBuffer.calcWriteCapacity(), readWriteSize * elementSize);
    t.deepEqual(dataBuffer.calcReadCapacity(), 0);
    t.deepEqual(readBuffer, expectedBuffer);
})

test("[DataBuffer] Multiple sequential buffer writes/reads", async (t) => {
    const elementSize = DataBufferTest.CalcByteSize(1, BUFFER_LENGTH);

    const bufferLength = BUFFER_LENGTH * 2 + BUFFER_LENGTH / 2;
    const dataBuffer = new DataBufferTest(BUFFER_LENGTH, BUFFER_BIT_DEPTH);
    const startNumber = 32769;

    const dummyBuffer = DataBufferTest.GenDummyArray(BUFFER_BIT_DEPTH, bufferLength, startNumber);
    const bufferCheckBreakpoints = [{
        readLength: 2,
        writeBuffer: dummyBuffer.slice(0, 4 * elementSize),
        expectedBuffer: dummyBuffer.slice(0, 2 * elementSize)
    }, {
        readLength: 8,
        writeBuffer: dummyBuffer.slice(4 * elementSize, 10 * elementSize),
        expectedBuffer: dummyBuffer.slice(2 * elementSize, 10 * elementSize)
    }, {
        readLength: 6,
        writeBuffer: dummyBuffer.slice(10 * elementSize, 22 * elementSize),
        expectedBuffer: dummyBuffer.slice(10 * elementSize, 16 * elementSize)
    }, {
        readLength: 12,
        writeBuffer: dummyBuffer.slice(22 * elementSize, 30 * elementSize),
        expectedBuffer: dummyBuffer.slice(16 * elementSize, 28 * elementSize)
    }, {
        readLength: 12,
        writeBuffer: dummyBuffer.slice(30 * elementSize),
        expectedBuffer: dummyBuffer.slice(28 * elementSize)
    }]

    bufferCheckBreakpoints.forEach((breakpoint) => {
        dataBuffer.write(breakpoint.writeBuffer);

        const buffer = dataBuffer.read(breakpoint.readLength);

        t.deepEqual(buffer, breakpoint.expectedBuffer);
    });
});