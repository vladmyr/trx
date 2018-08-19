import { Writable } from "stream";
import { TCPClient } from "./TCPTransport";

class RTPWritable extends Writable {
    protected _tcpClient: TCPClient;

    public constructor(tcpClient: TCPClient) {
        super({ 
            objectMode: false, 
            decodeStrings: false 
        });
        this._tcpClient = tcpClient;
    }

    public _write(chunk: Uint8Array, _: string, done: Function) {
        const buffer = Buffer.from(chunk);
        
        try {
            // use callback?
            this._tcpClient.send(buffer)
        } catch(ex) {
            console.error(ex);
        }
        
        done();
    }
}

export default RTPWritable;