import { Readable } from "stream";
import { TCPServer } from "./TCPTransport";
import DataBuffer from "./DataBuffer";

class TCPBufferedReadable extends Readable {
    protected _pushSize: number = 0;
    protected _isInitialBuffering: boolean = true;
    protected _tcpServer: TCPServer;
    protected _dataBuffer: DataBuffer;
    protected _lowWaterMark: number;

    public constructor(tcpServer: TCPServer, lowWaterMark: number = 7680, highWaterMark: number = 1536000) {
        super({
            objectMode: false,
            highWaterMark: lowWaterMark,
        })
        this._tcpServer = tcpServer;
        this._lowWaterMark = lowWaterMark * 10;
        this._dataBuffer = new DataBuffer(highWaterMark);
        this._buffer();
    }

    public _read(size: number) {
        if (this._isInitialBuffering) {
            this._pushSize = size;
            return;
        }

        this._pushBuffered(size);
    }

    protected _buffer() {
        this._tcpServer.getServer().on("connection", () => {
            const client = this._tcpServer.getClient();
            const socket = client.getSocket();

            socket.on("data", (buffer) => {
                this._dataBuffer.write(buffer);

                if (this._isInitialBuffering) {
                    this._isInitialBuffering = this._dataBuffer.getBufferedByteLength() < this._lowWaterMark;

                    if (!this._isInitialBuffering) {
                        this._pushBuffered(this._pushSize);
                        this._pushSize = 0;
                    }
                }
            })

            socket.on("end", () => {
                this._reset();
            })
        })
    }

    protected _pushBuffered(size: number) {
        const hasPushed = this.push(this._dataBuffer.readMaxBytes(size));

        if (!hasPushed) {
            console.trace("Buffer was not pushed successfully");
        }
    }

    protected _reset() {
        this._isInitialBuffering = true;
        this._dataBuffer.reset();
    }
}

export default TCPBufferedReadable;