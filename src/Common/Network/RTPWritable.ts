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
        // console.log("[RTPWritable] Sending..", chunk.byteLength, buffer)

        try {
            process.nextTick(() => {
                this._session.send(buffer);
            })
        } catch(e) {
            console.error(e);
        }
        
        done();
    }
}

export default RTPWritable;