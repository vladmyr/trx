import { Socket } from "dgram";
import { TPacket as TRTPPacket, RTPSession as KRTPSession } from "krtp";

enum RTCP_MESSAGE {
    START,
    PAUSE,
    STOP,
    DESTROY
}

class RTPSession {
    private _kRTPSession: typeof KRTPSession

    public constructor(port: number) {
        this._kRTPSession = new KRTPSession(port);
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