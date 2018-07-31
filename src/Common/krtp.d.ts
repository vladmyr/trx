declare module "krtp" {
    export type TPacket = {
        csrc: any[],
        payload: Buffer,
        payloadType: number,
        sequenceNumber: number,
        ssrc: number,
        timestamp: number
    }
}