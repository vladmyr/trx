import test from "ava";
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

test("[TCPTransport] Test data transfer", async (t) => {
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