declare module "krtp" {
    export type RTPMessage = {
        csrc: any[],
        payload: Buffer,
        payloadType: number,
        sequenceNumber: number,
        ssrc: number,
        timestamp: number
    }
}