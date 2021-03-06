import * as Fs from "fs";
import * as Path from "path";
import { Command, flags } from "@oclif/command";
import AudioStreamManager from "../../Common/AudioStreamManager";

const MemFs = require("memfs").fs;

class PlayCommand extends Command {
    static audioStreamManager = AudioStreamManager.GetInstance();
    static description = "list audio devices"
    static examples = [
        "$ devices --id 1",
    ]

    static flags = {
        id: flags.string({ description: "output audio device" }),
        filename: flags.string({ description: "file name" }),
        rate: flags.string({ description: "sample rate" }),
        format: flags.string({ description: "format depth" })
    }

    async run() {
        const { flags } = this.parse(PlayCommand);

        const id = Number.parseInt(flags.id) || 0;
        const fileName = flags.filename || "audio.raw";
        const rate = flags.rate || 44100;
        const format = flags.format || 16;

        const memFsfilePath = Path.join("/", fileName);
        const path = Path.resolve(__dirname, "../../../../Sample/", fileName);
        const rawAudioFile = Fs.readFileSync(path);

        MemFs.writeFileSync(memFsfilePath, rawAudioFile);

        const readStream = MemFs.createReadStream(memFsfilePath);

        const output: any = PlayCommand.audioStreamManager.getSinkOutput(id);

        output.on("end", () => output.end());
        readStream.pipe(output);
        output.start();
    }
}

export default PlayCommand;