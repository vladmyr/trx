import test from "ava";
import * as Path from "path";
import * as Fs from "fs";
import {TCPServer, TCPClient } from "../../../src/Common/Network/TCPTransport";

const PORT = 1737;

test("[TCPTransport] Verify client connection", async (t) => {
    await new Promise((resolve) => {
        const server = new TCPServer(PORT);
        const client = new TCPClient(PORT);

        server.getServer().on("connection", async (socket) => {
            t.truthy(socket);

            client.close();
            await server.close();

            resolve();
        })

        client.connect();
    });

    t.pass();
});

test("[TCPTransport] Data transfer test", async (t) => {
    await new Promise(async (resolve) => {
        const clientMessage = Buffer.from("Hello server!");
        const serverMessage = Buffer.from("Hello client!");

        const server = new TCPServer(PORT);
        const client = new TCPClient(PORT);

        server.getServer().on("connection", async (socket) => {
            socket.on("data", async (data) => {
                t.deepEqual(data, clientMessage);

                await new Promise((resolve) => socket.end(serverMessage, resolve));
                await server.close();
            })
        })

        await client.connect();

        client.getSocket().on("data", async (data) => {
            t.deepEqual(data, serverMessage);
            client.close();
            resolve();
        })

        client.send(clientMessage);
    })

    t.pass();
});

test.only("[TCPTransport] Data transfer stress-test", async (t) => {
    const audioFilepath = Path.resolve(__dirname, "../../Assets/audio.raw");
    const audioFileBuffer = Fs.readFileSync(audioFilepath)
    const audioReadStream = Fs.createReadStream(audioFilepath);

    const destinationBuffer = Buffer.allocUnsafe(audioFileBuffer.byteLength);

    let transferByteLength = 0;

    await new Promise(async (resolve) => {
        const server = new TCPServer(PORT);
        const client = new TCPClient(PORT);

        server.getServer().on("connection", async (socket) => {
            socket.on("data", async (data) => {
                data.copy(destinationBuffer, transferByteLength);
                transferByteLength += data.byteLength;
            });

            socket.on("end", async () => {
                t.deepEqual(destinationBuffer, audioFileBuffer);

                socket.end();
                await server.close();

                resolve();
            });
        });

        client.getSocket().on("end", () => {
            client.close();
        })

        await client.connect();
        audioReadStream.pipe(client.getSocket());
    })

    t.pass();
});