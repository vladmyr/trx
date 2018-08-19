import test from "ava";

import * as Path from "path";
import * as Fs from "fs";
import { Writable } from "stream";

import { TCPServer, TCPClient } from "../../../src/Common/Network/TCPTransport";
import TCPBufferedReadable from "../../../src/Common/Network/TCPBufferedReadable";

const PORT = 1373;
const CONSUMPTION_SPEED = 16 * 48000 * 2 / 1000 / 8    // bytes per ms

test.only("[TCPTransport] Data transfer stress-test", async (t) => {
    const audioFilepath = Path.resolve(__dirname, "../../Assets/audio.raw");
    const audioFileBuffer = Fs.readFileSync(audioFilepath)
    const audioReadStream = Fs.createReadStream(audioFilepath);

    const destinationBuffer = Buffer.allocUnsafe(audioFileBuffer.byteLength);

    let transferByteLength = 0;

    await new Promise(async (resolve) => {
        const server = new TCPServer(PORT);
        const tcpBufferedReadable = new TCPBufferedReadable(server);
        const client = new TCPClient(PORT);

        const writable = new Writable({
            write(chunk: Buffer, _: string, callback: Function) {
                console.log(chunk);

                chunk.copy(destinationBuffer, transferByteLength);
                transferByteLength += chunk.byteLength;

                callback();
            }
        })

        writable.on("close", async () => {
            await server.close();
            resolve();
        })

        tcpBufferedReadable.pipe(writable);

        client.getSocket().on("end", () => {
            client.close();
        })

        await client.connect();
        audioReadStream.pipe(client.getSocket());
    })

    t.pass();
});