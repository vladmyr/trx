// import { createSocket, Socket } from "dgram";
import { Server, Socket, createConnection, createServer } from "net";
import { TPacket as TRTPPacket, 
    RTPSession as KRTPSession,
    RTPControlSR as KRTPControll
} from "krtp";


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

class TCPServer {
    protected _server: Server;
    protected _client: Socket;

    public constructor(port: number) {
        this._server = createServer();

        this._server.on("listening", () => {
            const addressInfo: any = this._server.address();
            console.log(`UDP server listening ${addressInfo.address}:${addressInfo.port}`);
        });

        this._server.on("connection", (client: Socket) => {
            this._client = client;
        });

        this._server.on("error", (ex) => {
            console.error(ex);
        });

        this._server.on("close", () => {
            console.log("Closing UDP server");
        })

        this._server.listen(port);
    }
}

class TCPClient {
    protected _client: Socket;

    public constructor(port: number, address: string = "127.0.0.1") {
        this._client = new Socket();

        this._client.on("close", () => {})
        this._client.on("connect", () => {})
        this._client.on("data", () => {})
        this._client.on("drain", () => {})
        this._client.on("end", () => {})
        this._client.on("error", () => {})
        this._client.on("lookup", () => {})
        this._client.on("timeout", () => {})

        this._client.connect(port, address);
    }
}

class RTPSession {
    private _port: number;
    private _address: string;
    // private _kRTPSession: typeof KRTPSession
    private _server: Server;

    public constructor(port: number, address: string = "127.0.0.1") {
        this._port = port;
        this._address = address;
        // this._kRTPSession = new KRTPSession(port);
        this._server = new Server(port);
    }

    public send(buffer: Buffer) {
        this._server.getSocket().send(buffer, this._port, this._address, (err, bytes) => {
            console.log(err, bytes);
        });
    }

    // public getSession() {
    //     return this._kRTPSession;
    // }

    public close(): void {
        this._server.getSocket().close();
    }

    public on(eventName: string, handler: (...args: any[]) => void): void {
        // this._kRTPSession.on(eventName, handler);
        this._server.getSocket().on(eventName, handler);
    }

    public getSocket(): Socket {
        // return this._kRTPSession.socket;
        return this._server.getSocket();
    }

    // public getControlSocket(): Socket {
    //     return this._kRTPSession.controlSocket;
    // }
}

export default RTPSession;