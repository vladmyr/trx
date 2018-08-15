import * as Fs from "fs";
import * as Path from "path";
import { Command, flags } from "@oclif/command";
import AudioStreamManager from "../../Common/AudioStreamManager";

class RecordCommand extends Command {
    static audioStreamManager = AudioStreamManager.GetInstance();
    static description = "record audio devices"
    static examples = [
        "$ record --id 1",
        "$ record --id 1 --path ./record.raw",
    ]

    static flags = {
        id: flags.string({ description: "source audio device" }),
        path: flags.string({ char: "p", description: "relative or absolute output path" })
    }

    async run() {
        const { flags } = this.parse(RecordCommand);

        const id = Number.parseInt(flags.id) || 0;
        const path = flags.path || "./record.raw"
        const outputPath = Path.resolve(__dirname, path);

        const audioSource: any = RecordCommand.audioStreamManager.getSourceInput(id);
        const outputStream = Fs.createWriteStream(outputPath);

        audioSource.on("error", console.log.bind(console));

        audioSource.pipe(outputStream);
        audioSource.start();

        console.log("Recording... Press ^C to stop.");
    }
}

export default RecordCommand;