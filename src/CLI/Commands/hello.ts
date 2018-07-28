import { Command, flags } from "@oclif/command";

class HelloCommand extends Command {
    static description = "hello world"
    static examples = [
        "$ hello",
        "$ hello --name john",
    ]

    static flags = {
        name: flags.string({ char: "n", description: "name to print"}),
    }

    async run() {
        const { flags } = this.parse(HelloCommand);

        const name = flags.name || "world";

        this.log(`hello ${name}`);
    }
}

export default HelloCommand;