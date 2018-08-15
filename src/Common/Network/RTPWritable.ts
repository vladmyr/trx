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

    public _write(chunk: Buffer, _: string, done: Function) {
        console.log("[RTPWritable] Send", chunk.byteLength, chunk)
        setTimeout(() => {
            this._session.getSession().send(chunk);
            done();
        }, 1000);
    }
}

export default RTPWritable;