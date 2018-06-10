// Type definitions for <placeholder>
// Project: <url>
// Definitions by: Volodymyr Khytskyi <url>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "naudiodon" {
    type TSampleFormat = 8 | 16 | 24 | 32;

    export interface IDevice {
        id: number,
        name: string,
        maxInputChannels: number,
        maxOutputChannels: number,
        defaultSampleRate: number,
        defaultLowInputLatency: number,
        defaultLowOutputLatency: number,
        defaultHighInputLatency: number,
        defaultHighOutputLatency: number,
        hostAPIName: string
    }

    export interface IAudioOptions {
        channelCount: number,
        sampleFormat: TSampleFormat,
        sampleRate: number,
        deviceId: number
    }

    export const SampleFormat8Bit = 8;
    export const SampleFormat16Bit = 16;
    export const SampleFormat24Bit = 24;
    export const SampleFormat32Bit = 32;
    
    export function getDevices(): IDevice[];

    export class AudioOutput {
        constructor(o: IAudioOptions);
        start(): void;
        stop(callback?: Function): void;
    }
    
    export class AudioInput {
        constructor(o: IAudioOptions);
        start(): void;
        stop(callback?: Function): void;
    }
}
