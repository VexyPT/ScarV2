import { Command } from "#base";
import { reply } from "#functions";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "Ver avatar",
    dmPermission: true,
    type: ApplicationCommandType.User,
    async run(interaction) {

        const { targetUser } = interaction;

            reply.default({
                interaction,
                text: `${targetUser.displayName} Avatar`,
                image: `${targetUser.avatarURL({ size: 2048 })}`
            });
        
    }
});