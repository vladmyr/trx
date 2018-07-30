import * as Fs from "fs";
import * as PortAudio from "naudiodon";

interface IDeviceIndex {
    [i: number]: PortAudio.IDevice
}

class AudioStreamManager {
    private static _IdxDevices: IDeviceIndex;
    private static _Instance: AudioStreamManager;

    private static _GetDevicesIndex() {
        return PortAudio
        .getDevices()
        .reduce<IDeviceIndex>((reduction, device) => {
            reduction[device.id] = device;
            return reduction;
        }, {});
    }
    public static GetInstance() {
        if (typeof this._Instance == "undefined") {
            this._IdxDevices = this._GetDevicesIndex();
            this._Instance = new AudioStreamManager();
        }

        return this._Instance;
    }

    public static GetDevices() {
        return PortAudio.getDevices();
    }

    private _sinkOutputDevice: PortAudio.AudioOutput | any;
    private _sourceInputDevice: PortAudio.AudioInput | any;

    public constructor() {}
    
    public getSourceInput(id: number) {
        const device = AudioStreamManager._IdxDevices[id]

        if (typeof device == "undefined") {
            throw new Error(`There is no device with an id of ${id}`);
        }

        return new PortAudio.AudioInput({
            channelCount: 2,
            sampleFormat: PortAudio.SampleFormat16Bit,
            sampleRate: device.defaultSampleRate,
            deviceId: id
        })
    }

    public getSinkOutput(id: number, options: {
        sampleFormat?: PortAudio.TSampleFormat,
        sampleRate?: number
    } = {}) {
        const device = AudioStreamManager._IdxDevices[id]

        if (typeof device == "undefined") {
            throw new Error(`There is no device with an id of ${id}`);
        }

        return new PortAudio.AudioOutput({
            channelCount: 2,
            sampleFormat: options.sampleFormat || PortAudio.SampleFormat16Bit,
            sampleRate: options.sampleRate || device.defaultSampleRate,
            deviceId: id
        });
    }

    public start(souceInputId: number) {
        // this.stop();

        const writeStream = Fs.createWriteStream("rawAudio.raw");

        this._sourceInputDevice = this.getSourceInput(souceInputId);

        this._sourceInputDevice.on("error", console.error);
        this._sourceInputDevice.on("end", () => this.stop());

        this._sourceInputDevice.pipe(writeStream);
        this._sourceInputDevice.start();
    }

    public fromSource(sourceInputId: number) {
        // this.stop();

        this._sourceInputDevice = this.getSourceInput(sourceInputId);

        this._sourceInputDevice.on("end", () => this.stop());
        this._sourceInputDevice.on("error", console.error.bind(console));

        return this._sourceInputDevice;
    }

    public stop() {
        this._sourceInputDevice.quit();
    }
}

export default AudioStreamManager;