import { Readable } from "stream";
import RTPSession from "./RTPSession";
import DataBuffer from "./DataBuffer";
import { TPacket as TRTPPacket, RTPSession as KRTPSession } from "krtp";

/**
 * TODO: search for more elegant solution
 */
class RTPReadable {
    protected _source: RTPSession;
    protected _dataBuffer: DataBuffer;
    protected _readable: Readable;
    protected _destination: NodeJS.WritableStream;
    protected _lowWaterMark: number;

    public constructor(port: number, destination: any, lowWaterMark: number = 24000, highWaterMark: number = 48000) {
        this._destination = destination;
        this._lowWaterMark = lowWaterMark;
        this._dataBuffer = new DataBuffer(highWaterMark);
        
        this._instantiateSession(port);

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

    protected _instantiateSession(port: number) {
        this._source = new RTPSession(port);
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

export default RTPReadable;