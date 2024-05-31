import { Command } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
    name: "bot",
    description: "See information about me",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "info",
            description: "See information about me.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        /*{
            name: "status",
            description: "Check my status",
            type: ApplicationCommandOptionType.Subcommand
        }*/
      ],
      async run(interaction) {

        const { options, client } = interaction;

        switch (options.getSubcommand()) {
          case "info": {

            const embedStatus = new EmbedBuilder({
                color: hexToRgb(settings.colors.primary),
                description: brBuilder(
                    `${icon("verifiedDev")} Developer: <@${settings.dev}> \`${settings.dev}\``,
                    `${icon("form")} Library: [Discord.Js](${settings.links.discordJs})`,
                    `${icon("world")} Host: [Square Cloud](${settings.links.squareCloud})`,
                    `${icon("time")} Ping: \`${client.ws.ping} ms\``,
                    `${icon("ts")} Language: [TypeScript](${settings.links.typeScript})`,
                    `${icon("id")} ID: \`${client.user.id}\``,
                    `${icon("slashCommand")} Total Commands: \`${client.application.commands.cache.size}\``,
                    `${icon("discover")} Servers: \`${client.guilds.cache.size.toLocaleString("en-US")}\``,
                    `${icon("user")} Users: \`${client.guilds.cache.map(g => g.memberCount).reduce((a,b) => a + b).toLocaleString("en-US")}\``
                ),
                thumbnail: {
                    url: `${client.user.displayAvatarURL()}`
                },
            });

            await interaction.reply({
                embeds: [embedStatus]
            });
            break;
          } // fim do /bot info

        }
          
      }
});