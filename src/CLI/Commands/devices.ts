import { Command, flags } from "@oclif/command";
import Devices from "../../Common/Devices";

class DevicesCommand extends Command {
    static description = "list audio devices"
    static examples = [
        "$ devices",
        "$ devices --id 1",
    ]

    static flags = {
        id: flags.string({ description: "list details of a selected device" })
    }

    async run() {
        const { flags } = this.parse(DevicesCommand);

        if (flags.hasOwnProperty("id")) {
            if (!Devices.Index.hasOwnProperty(flags.id)) {
                this.error(`Device with id ${flags.id} was not found`);
            }

            const device = Devices.Index[flags.id];

            Object.keys(device).forEach((propName) => {
                this.log(`${propName}: ${device[propName
                ]}`)
            })
        } else {
            Object.keys(Devices.Index).forEach((deviceId) => {
                const device = Devices.Index[deviceId];
                this.log(`${deviceId}. ${device.name}`);
            })
        }
    }
}

export default DevicesCommand;