import { Command } from "#base";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "ping",
    description: "Ping the bot",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        
        const start = Date.now();

        return interaction.reply("Ping").then((msg) => {
            const diff = (Date.now() - start);
            return msg.edit(`Pong! \`${diff}ms\``);
        })

    }
});