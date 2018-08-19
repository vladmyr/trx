import { Server, Socket, createServer } from "net";

class TCPServer {
    protected _server: Server;
    protected _client: TCPClient;

    public constructor(port: number) {
        this._server = createServer();

        this._server.on("listening", () => {
            const addressInfo: any = this._server.address();
            console.log(`[TCPServer] UDP server listening ${addressInfo.address}:${addressInfo.port}`);
        });

        this._server.on("connection", (socket: Socket) => {
            console.log("[TCPServer] connection")

            this._client = new TCPClient(socket);

            socket.on("close", () => {
                console.log("close")
            })
            socket.on("connect", () => {
                console.log("connect")
            })
            socket.on("data", () => {
                console.log("data")
            })
            socket.on("drain", () => {
                console.log("drain")
            })
            socket.on("end", () => {
                console.log("end")
            })
            socket.on("error", () => {
                console.log("error")
            })
            socket.on("lookup", () => {
                console.log("loopup")
            })
            socket.on("timeout", () => {
                console.log("timeout")
            })
        });

        this._server.on("error", (ex) => {
            console.error(ex);
        });

        this._server.on("close", () => {
            console.log("[TCPServer] Closing UDP server");
        })

        this._server.listen(port);
    }

    public getServer() { return this._server; }
    public getClient() { return this._client; }
    public close() { 
        if (this._client instanceof TCPClient) {
            this._client.getSocket().end();
        }
        return new Promise((resolve) => {
            this._server.close(resolve);
        })
    }
}


class TCPClient {
    protected _port: number;
    protected _address: string;
    protected _socket: Socket;

    public constructor(arg1: number | Socket, address: string = "127.0.0.1") {
        if (arg1 instanceof Socket) {
            this._socket = arg1;
            this._port = this._socket.remotePort;
            this._address = this._socket.remoteAddress;
        } else {
            this._port = arg1 as number;
            this._address = address;
            this._socket = new Socket();
        }

        this._socket.on("close", () => {
            console.log("[TCPClient] close")
        })
        this._socket.on("connect", () => {
            console.log("[TCPClient] connect")
        })
        this._socket.on("data", (data) => {
            console.log("[TCPClient] data", data)
        })
        this._socket.on("drain", () => {
            console.log("[TCPClient] drain")
        })
        this._socket.on("end", () => {
            console.log("[TCPClient] end")
        })
        this._socket.on("error", () => {
            console.log("[TCPClient] error")
        })
        this._socket.on("lookup", () => {
            console.log("[TCPClient] loopup")
        })
        this._socket.on("timeout", () => {
            console.log("[TCPClient] timeout")
        })
    }

    public connect() {
        return new Promise((resolve) => {
            this._socket.connect(this._port, this._address, resolve);
        })
    }

    public send(buffer: Buffer) {
        return this._socket.write(buffer);
    }

    public getSocket() { return this._socket; }
    public close() { this._socket.end(); }
}

export { TCPClient, TCPServer }