import { Command } from "#base";
import { reply } from "#functions";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "avatar",
    dmPermission: true,
    type: ApplicationCommandType.User,
    async run(interaction) {

        const { targetUser } = interaction;

            reply.default({
                interaction,
                text: `${targetUser.username} Avatar`,
                image: `${targetUser.avatarURL()}`
            });
        
    }
});