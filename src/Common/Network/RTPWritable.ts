import { Writable } from "stream";
import RTPSession from "./RTPSession";

class RTPWritable extends Writable {
    protected _session: RTPSession;

    public constructor(port: number, address?: string) {
        super({ 
            objectMode: false, 
            decodeStrings: false 
        });
        this._instantiateSession(port, address);
    }

    public _write(chunk: Buffer, _: string, done: Function) {
        this._session.getSession().send(chunk);
        done();
    }

    protected _instantiateSession(port: number, address?: string) {
        this._session = new RTPSession(port, address);
    }
}

export default RTPWritable;