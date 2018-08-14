import { Socket } from "net";
import test from "ava";
import TCPMetaTransmission from "../../../src/Common/Network/TCPMetaTransmission";

const PORT = 1372;

class TCPMetaTransmissionTest extends TCPMetaTransmission {
  private static _ListeningListeners = [];
  private static _ConnectionListeners = [];
  private static _ErrorListeners = [];
  private static _CloseListeners = [];
  protected static _ConnectionListener(socket: Socket) {
    super._ConnectionListener(socket);
    this._CallListeners(this._ConnectionListeners, socket);
  }

  protected static _ErrorListener(er: Error) {
    super._ErrorListener(er);
    this._CallListeners(this._ErrorListeners, er);
  }

  protected static _ListeningListener() {
    super._ListeningListener();
    this._CallListeners(this._ListeningListeners);
  }

  protected static _CloseListener() {
    super._CloseListener();
    this._CallListeners(this._CloseListeners);
  }

  public static async Stop() {
    await super.Stop();
    this._ClearListeners(this._ConnectionListeners);
    this._ClearListeners(this._ErrorListeners);
  }

  public static AddListeningListener(listener: Function) {
    this._AddListener(this._ListeningListeners, listener);
  }

  public static AddConnectionListener(listener: Function) {
    this._AddListener(this._ConnectionListeners, listener);
  }

  public static AddErrorListener(listener: Function) {
    this._AddListener(this._ErrorListeners, listener);
  }

  public static AddCloseListener(listener: Function) {
    this._AddListener(this._CloseListeners, listener);
  }

  private static _AddListener(list: Function[], listener: Function) {
    if (list.indexOf(listener) === -1) {
      list.push(listener);
    }
  }

  private static _CallListeners(listeners: Function[], ...args: any[]) {
    listeners.forEach(listener => listener.apply(listener, args));
  }

  private static _ClearListeners(listeners: Function[]) {
    listeners.splice(0);
  }
}


test("[TCPMetaTransmission] Loop client connection, server stop & connection close test", async (t) => {
  return new Promise((resolve) => {
    TCPMetaTransmissionTest.AddCloseListener(resolve);
    TCPMetaTransmissionTest.AddConnectionListener(async (socket: Socket) => {
      await TCPMetaTransmissionTest.Stop();
    });
  
    TCPMetaTransmissionTest.Start(PORT);
  })
})