// import { createSocket, Socket } from "dgram";
import { Server, Socket, createConnection, createServer } from "net";
import { prototype } from "stream";
// import { TPacket as TRTPPacket, 
//     RTPSession as KRTPSession,
//     RTPControlSR as KRTPControll
// } from "krtp";


// class Server {
//     protected _socket: Socket

//     public constructor(port: number) {
//         this._socket = createSocket("udp4");

//         this._socket.on("listening", () => {
//             const addressInfo: any = this._socket.address();
//             console.log(`UDP server listening ${addressInfo.address}:${addressInfo.port}`);
//         });

//         this._socket.on("message", (msg, client) => {
//             console.log(`Message from ${client.address}:${client.port}`, msg);
//         });

//         this._socket.on("error", (ex) => {
//             console.error(ex);
//         });

//         this._socket.on("close", () => {
//             console.log("Closing UDP server");
//         })

//         this._socket.bind(port);
//     }

//     public getSocket() {
//         return this._socket;
//     }
// }



class TCPTransport {
    protected _port: number;
    protected _address: string;
    protected _server: TCPServer;
    protected _client: TCPClient;

    public constructor(port: number, address: string = "127.0.0.1") {
        this._port = port;
        this._address = address;
        this._server = new TCPServer(port);
        this._client = new TCPClient(port, address);
    }

    public getServer() { return this._server; }
    public getClient() { return this._client; }

    public getSocket() { 
        // FIXME: need more universal solution
        if (this._address == "127.0.0.1") {
            return this._server.getSocket();
        } else {
            return this._client.getSocket(); 
        }
    }

    public async close() {
        this._client.close();
        await this._server.close();
    }
}

class RTPSession {
    private _port: number;
    private _address: string;
    // private _kRTPSession: typeof KRTPSession
    private _tcpTransport: TCPTransport;

    public constructor(port: number, address: string = "127.0.0.1") {
        this._port = port;
        this._address = address;
        // this._kRTPSession = new KRTPSession(port);
        this._tcpTransport = new TCPTransport(port, address);
    }

    public send(buffer: Buffer) {
        // this._server.getSocket().send(buffer, this._port, this._address, (err, bytes) => {
        //     console.log(err, bytes);
        // });

        this._tcpTransport.getSocket().write(buffer, (...args) => {
            console.log("sent", args)
        })
    }

    // public getSession() {
    //     return this._kRTPSession;
    // }

    public async close() {
        await this._tcpTransport.close();
    }

    public on(eventName: string, handler: (...args: any[]) => void): void {
        // this._kRTPSession.on(eventName, handler);
        // this._tcpTransport.getSocket().on(eventName, handler);
    }

    public getSocket(): Socket {
        // return this._kRTPSession.socket;
        return this._tcpTransport.getSocket();
    }

    // public getControlSocket(): Socket {
    //     return this._kRTPSession.controlSocket;
    // }
}

export default RTPSession;