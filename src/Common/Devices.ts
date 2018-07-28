import * as PortAudio from "naudiodon";

interface IDeviceIndex {
    [i: number]: PortAudio.IDevice
}

class Devices {
    public static List = PortAudio.getDevices()
    public static Index = PortAudio
        .getDevices()
        .reduce<IDeviceIndex>((reduction, device) => {
            reduction[device.id] = device;
            return reduction;
        }, {});

    private constructor() {}
} 

export default Devices;