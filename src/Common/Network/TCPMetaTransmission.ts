import { createServer, createConnection, Server, Socket } from "net";

enum MESSAGE_TYPE {
  // REQUEST_PLAYBACK,
  START,
  PAUSE,
  STOP,
  ERROR
}

// class TCPMessage {
//   public static requestStart() {

//   }

//   public static requestPause() {

//   }

//   public static requestStop() {

//   }

//   public static responseStart() {

//   }

//   public static responsePause() {

//   }

//   public static responseStop() {

//   }
// }

class SocketController {
  protected _socket: Socket;
  protected _dataListenerBound;

  protected static _SerializeMessage(o: {}): Buffer {
    return Buffer.from(JSON.stringify(o));
  }

  protected static _DeserializeMessage(buffer: Buffer): {} {
    return JSON.parse(buffer.toString());
  }
  
  public constructor(socket: Socket) {
    this._dataListenerBound = this._dataListener.bind(this);
    this._socket = socket;
    this._socket.addListener("data", this._dataListenerBound);
  }

  public destruct() {
    this._socket.removeListener("data", this._dataListenerBound);
  }

  protected _dataListener(data: Buffer) {

  }
}

class TCPMetaTransmissionClient {
  protected _socket: Socket;

  protected static _SerializeMessage(o: {}): Buffer {
    return Buffer.from(JSON.stringify(o));
  }

  protected static _DeserializeMessage(buffer: Buffer): {} {
    return JSON.parse(buffer.toString());
  }

  public constructor (socket: Socket) {
    this._socket = socket;
  }

  public getSocket() { return this._socket; }

  protected _initController() {
    this._socket.addListener("data", (serializedMessage) => {
      try {
        const deserializedserializedData = TCPMetaTransmissionClient._DeserializeMessage(serializedMessage);
      } catch (err) {

      }
    })
  }

  protected _end() {
    this._socket.removeAllListeners();
    this._socket.end();
  }
}

class TCPMetaTransmission {
  protected static _Server: Server; 
  protected static _Client: Socket;
  protected static _LoopClient: Socket;

  public static Start(port: number, address: string = "localhost") {
    this._Server = createServer();
    this._Server.on("listening", this._ListeningListener.bind(this));
    this._Server.on("close", this._CloseListener.bind(this));
    this._Server.on("connection", this._ConnectionListener.bind(this));
    this._Server.on("error", this._ErrorListener.bind(this));
    this._Server.listen(port);
    
    this._LoopClient = createConnection(port);
  }

  public static async Stop() {
    this._Client && this._Client.end();
    this._LoopClient.end();
    return new Promise<void>(resolve => this._Server.close(resolve));
  }

  public static getLoopClient() { return this._LoopClient; }
  public static getClient() { return this._Client; }

  protected static _ConnectionListener(socket: Socket) {
    if (socket !== this._LoopClient) {
      // TODO: handle multiple incomming socket connections
      this._Client && this._Client.end();
      this._Client = socket;
    }
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