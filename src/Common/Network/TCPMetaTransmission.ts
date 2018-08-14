import { createServer, createConnection, Server, Socket } from "net";

class TCPMetaTransmission {
  protected static _Server: Server; 
  protected static _Client: Socket;

  public static Start(port: number, address: string = "localhost") {
    this._Server = createServer();
    this._Server.on("listening", this._ListeningListener.bind(this));
    this._Server.on("close", this._CloseListener.bind(this));
    this._Server.on("connection", this._ConnectionListener.bind(this));
    this._Server.on("error", this._ErrorListener.bind(this));
    this._Server.listen(port);
    
    this._Client = createConnection(port, address);
  }

  public static async Stop() {
    this._Client.end();
    return new Promise<void>(resolve => this._Server.close(resolve));
  }

  protected static _ConnectionListener(socket: Socket) {
    
  }

  protected static _ErrorListener(er: Error) {
    this.Stop();
  }

  protected static _ListeningListener() {

  }

  protected static _CloseListener() {
    
  }

  protected constructor() {}
}

export default TCPMetaTransmission;