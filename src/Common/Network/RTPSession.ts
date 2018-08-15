import { Socket } from "dgram";
import { TPacket as TRTPPacket, 
    RTPSession as KRTPSession,
    RTPControlSR as KRTPControll
} from "krtp";

class RTPSession {
    private _address: string;
    private _kRTPSession: typeof KRTPSession

    public constructor(port: number, address: string = "127.0.0.1") {
        this._address = address;
        this._kRTPSession = new KRTPSession(port);
    }

    public send(buffer: Buffer, timestamp?: number) {
        this._kRTPSession.send(buffer, this._address, timestamp);
    }

    public getSession() {
        return this._kRTPSession;
    }

    public close(): void {
        this._kRTPSession.close();
    }

    public on(eventName: string, handler: (...args: any[]) => void): void {
        this._kRTPSession.on(eventName, handler);
    }

    public getSocket(): Socket {
        return this._kRTPSession.socket;
    }

    public getControlSocket(): Socket {
        return this._kRTPSession.controlSocket;
    }
}

export default RTPSession;