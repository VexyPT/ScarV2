import { Event } from "#base";
import { settings } from "#settings";
import { EmbedBuilder, TextBasedChannel } from "discord.js";

new Event({
    name: "Command Logs",
    event: "interactionCreate",
    async run(interaction) {

        if (interaction.isCommand()) {
            const { user, guild, client } = interaction;

            const channelLogs = client.channels.cache.get(`${settings.channels.commandLogs}`) as TextBasedChannel;

            const embedLogs = new EmbedBuilder({
                author: {
                    name: `${user.username}`, iconURL: `${user.displayAvatarURL()}`
                },
                description: `Nome do Servidor: **${guild?.name}**\nID do Servidor: **${guild?.id}**\nNome do Usuário: ${user.username}\nID do Usuário: **${user.id}**\nComando: ${interaction.commandName}`
            });

            channelLogs.send({ embeds: [embedLogs] });
            
        }

    },
});