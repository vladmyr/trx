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
        console.log("[RTPWritable] Send", chunk.byteLength, chunk)
        this._session.getSession().send(Buffer.from(chunk));
        done();
    }
}

export default RTPWritable;