import { Readable } from "stream";
import RTPSession from "./RTPSession";
import DataBuffer from "./DataBuffer";
import { TPacket as TRTPPacket, RTPSession as KRTPSession } from "krtp";

class RTPReadable extends Readable {
    protected _pushSize: number = 0;
    protected _isInitialBuffering: boolean = true;
    protected _session: RTPSession;
    protected _dataBuffer: DataBuffer;
    protected _lowWaterMark: number;

    public constructor(rtpSession: RTPSession, lowWaterMark: number = 76800, highWaterMark: number = 1536000) {
        super({
            objectMode: false,
            highWaterMark: lowWaterMark,
        })
        this._session = rtpSession;
        this._lowWaterMark = lowWaterMark;
        this._dataBuffer = new DataBuffer(highWaterMark);
        this._buffer();
    }

    public _read(size: number) {
        this._pushSize = size;
    }

    protected _buffer() {
        this._session.on("message", (packet: TRTPPacket) => {
            // console.log("[RTPReadable] Message", packet.payload)

            // if (this._isInitialBuffering) {
            //     this._dataBuffer.write(packet.payload);
            //     this._isInitialBuffering = this._dataBuffer.getBufferedByteLength() < this._lowWaterMark;
            // } else 
            if (this._pushSize > 0) {
                this._dataBuffer.write(packet.payload);

                const hasPushed = this.push(this._dataBuffer.readMaxBytes(this._pushSize));

                if (!hasPushed) {
                    this._pushSize = 0;
                }
            } else if (this._pushSize === 0) {
                this._dataBuffer.write(packet.payload);
            }
        })
    }
}

export default RTPReadable;