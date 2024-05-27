import { Command } from "#base";
import { icon, reply } from "#functions";
import { settings } from "#settings";
import { hexToRgb } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder, codeBlock } from "discord.js";

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
        {
            name: "status",
            description: "Check my status",
            type: ApplicationCommandOptionType.Subcommand
        }
      ],
      async run(interaction) {

        const { options, client } = interaction;

        switch (options.getSubcommand()) {
          case "info": {
            
            reply.default({
                interaction,
                text: `I was developed by ${settings.links.developer}, where my job is to moderate and look after your server.\n\nI was **programmed** in [Typescript](${settings.links.typeScript}) using [Discord.Js](${settings.links.discordJs}), I stay **online** thanks to **[Square Cloud](${settings.links.squareCloud})**. Use </bot status:1236520871061884999> to know my currently status.\n\n> ${icon("slashCommand")} I only support **SlashCommands (/)**\n\nI'm currently taking care of **${client.guilds.cache.size.toLocaleString()} Servers** and managing **${client.guilds.cache.map(g => g.memberCount).reduce((a,b) => a + b).toLocaleString("pt-BR")} Users** 🥳`,
                footer: "Developed with ❤️",
                thumbnail: `${client.user.displayAvatarURL()}`
            });
            break;
          } // fim do /bot info

          case "status": {
           
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes();
            const seconds = date.getUTCSeconds();

            const embedStatus = new EmbedBuilder({
                color: hexToRgb(settings.colors.secondary),
                title: "Status",
                thumbnail: {
                    url: `${client.user.displayAvatarURL()}`
                },
                fields: [
                    {
                        name: "🖥️ ⠂Host",
                        value: `${codeBlock("Square Cloud")}`,
                        inline: true
                    },
                    {
                        name: "👨‍💻⠂Language",
                        value: `${codeBlock("Typescript")}`,
                        inline: true
                    },
                    {
                        name: "🧙‍♀️ ⠂Developer",
                        value: "<@629734543867379732> (`629734543867379732`)",
                        inline: true
                    },
                    {
                        name: "🌐 ⠂Network",
                        value: `${codeBlock("⬇️ 300mb - ⬆️ 150mb")}`,
                        inline: true
                    },
                    {
                        name: "🏓 ⠂Ping",
                        value: `${codeBlock(`${client.ws.ping}`)}`,
                        inline: true
                    },
                    {
                        name: "🔮 ⠂Mention",
                        value: `${client.user}`,
                        inline: true
                    },
                    {
                        name: "🕐 ⠂System time",
                        value: `${codeBlock(`${hours}:${minutes}:${seconds}\n${day}/${month}/${year}`)}`,
                        inline: true
                    },
                    {
                        name: "🆔 ⠂ID",
                        value: `${codeBlock(`${client.user.id}`)}`,
                        inline: true
                    },
                    {
                        name: "🍀 ⠂Environmente",
                        value: `${codeBlock("Production")}`,
                        inline: true
                    },
                ]
            });

            await interaction.reply({
                embeds: [embedStatus]
            });
            break;
          } // fim do /bot status

        }
          
      }
});