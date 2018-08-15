import { Writable } from "stream";
import RTPSession from "./RTPSession";

class RTPWritable extends Writable {
    protected _session: RTPSession;

    public constructor(session: RTPSession) {
        super({ 
            objectMode: false, 
            decodeStrings: false 
        });
        this._session = session;
    }

    public _write(chunk: Uint8Array, _: string, done: Function) {
        const buffer = Buffer.from(chunk);
        console.log("[RTPWritable] Send", chunk.byteLength, buffer)
        this._session.send(buffer);
        done();
    }
}

export default RTPWritable;