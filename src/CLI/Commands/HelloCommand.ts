import { Command, flags } from "@oclif/command";

class HelloCommand extends Command {
    static description = "hello command description"

    static flags = {
        help: flags.help({ char: "h" }),
        name: flags.string({ char: "n", description: "name to print"}),
        force: flags.boolean({ char: "f"})
    }

    async run() {
        const { args, flags } = this.parse(HelloCommand);

        const name = flags.name || "world";

        this.log(`hello ${name}`)

        if (args.file && flags.force) {
            this.log(`you input --force and --file: ${args.file}`)
        }
    }
}

export default HelloCommand;