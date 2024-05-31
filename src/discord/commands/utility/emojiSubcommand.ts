import { Command } from "#base";
import { icon, reply } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, PermissionFlagsBits, parseEmoji } from "discord.js";

new Command({
    name: "emoji",
    description: "Manages the emojis module",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
          name: "add",
          description: "Add a customized emoji for the server.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "emoji",
              description: "Copy an existing emoji",
              type: ApplicationCommandOptionType.String,
              required: true
            },
            {
              name: "name",
              description: "Name of the emoji to be created",
              type: ApplicationCommandOptionType.String,
              required: false,
            }
          ],
        }, {
          name: "info",
          description: "Receive information from a Server emoji.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "emoji",
              description: "The emoji you want to see information about",
              type: ApplicationCommandOptionType.String,
              required: true
            },
          ],
        }, {
          name: "remove",
          description: "Remove a custom emoji from the server.",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "emoji",
              description: "The emoji you want to remove",
              type: ApplicationCommandOptionType.String,
              required: true
            },
          ]
        },
      ],
      async run(interaction) {

        const { options, user, guild, channel } = interaction;

        switch (options.getSubcommand()) {
          case "add": {
            if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
              reply.danger({
                interaction,
                text: `${icon("danger")} \`Missing ManagaGuildExpressions permission\``,
                ephemeral
              });
              return;
            }

            if (!channel?.permissionsFor(user)?.has(PermissionFlagsBits.ManageGuildExpressions)) {
              reply.danger({
                interaction,
                text: `${icon("danger")} You are not allowed to manage expressions. (\`Missing ManageGuildExpressions permission\`)`,
                ephemeral
              });
              return;
            }

            let emojiName = options.getString("name");

            if (emojiName) {

              if (interaction.guild.emojis.cache.find(
                (findEmoji) => findEmoji.name?.toLowerCase() === emojiName?.toLowerCase())
              ) {
                reply.danger({
                  interaction,
                  text: `${icon("danger")} There is already an emoji with that name on the server.`,
                  ephemeral
                });
              }

              if (emojiName.length > 32) {
                reply.danger({
                  interaction,
                  text: `${icon("danger")} The name of the emoji cannot be longer than **\`32\`** characters.`,
                  ephemeral
                });
                return;
              }

              if (emojiName.length < 2) {
                reply.danger({
                  interaction,
                  text: `${icon("danger")} The name of the emoji must be longer than **\`2\`** characters.`,
                  ephemeral
                });
                return;
              }
            }

            const string = options.getString("emoji", true);
            const parsed = parseEmoji(string);
            const link = `https://cdn.discordapp.com/emojis/${parsed?.id}${parsed?.animated ? ".gif" : ".png"}`;
            if (!emojiName) { emojiName = parsed!.name; }
            
            guild.emojis.create({ attachment: link, name: `${emojiName}` })
            .then((emoji) => {
              reply.success({
                interaction,
                text: `${emoji} Emoji added successfully!`
              });
            }).catch((error) => {
              console.error("[Emoji ADD] (Don't Worry)\n", error);
              reply.danger({
                interaction,
                text: `${icon("danger")} It was not possible to create the emoji, here are the possible causes:\n\n>> - The maximum number of emojis on the server has been reached\n- The emoji entered is invalid\n- The name of the emoji is invalid`,
                ephemeral
              });
              return;
            });

              break;
          } // fim do /emoji add

          case "remove": {

            if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
              reply.danger({
                interaction,
                text: `${icon("danger")} \`Missing ManagaGuildExpressions permission\``,
                ephemeral
              });
              return;
            }

            if (!channel?.permissionsFor(user)?.has(PermissionFlagsBits.ManageGuildExpressions)) {
              reply.danger({
                interaction,
                text: `${icon("danger")} You are not allowed to manage expressions. (\`Missing ManageGuildExpressions permission\`)`,
                ephemeral
              });
              return;
            }

            const emojiQuery = options.getString("emoji", true);
            let emojiToDelete;

            if (!isNaN(parseInt(emojiQuery))) {
              emojiToDelete = await guild.emojis.fetch(emojiQuery);
            } else {
              emojiToDelete = guild.emojis.cache.find(
                (findEmoji) => findEmoji.name === emojiQuery 
                || 
                findEmoji.name?.toLowerCase() === emojiQuery.toLowerCase() 
                || 
                findEmoji.name === emojiQuery.split(":")[0] 
                || 
                findEmoji.name === emojiQuery.split(":")[1]);
            }

            if (!emojiToDelete) {
              reply.danger({
                interaction,
                text: `${icon("danger")} That emoji doesn't exist.`,
                ephemeral
              });
              return;
            }

            if (emojiToDelete.managed) {
              reply.danger({
                interaction,
                text: `${icon("danger")} I can't delete an emoji that is managed by external services.`,
                ephemeral
              });
              return;
            }

            try {
              await emojiToDelete?.delete();
            } catch (error) {
              console.log("[Debug emoji remove] (dont worry)", error);
              reply.danger({
                interaction,
                text: `${icon("danger")} It was not possible to delete the emoji.\n> Possible reasons:\n\n- The emoji is not from this server\n- The emoji was not found`,
                ephemeral
              });
              return;
            }

            reply.success({
              interaction,
              text: `${icon("success")} Emoji successfully removed!`
            });

            return;
          } //fim do /emoji delete

          case "info": {
            reply.warning({
              interaction,
              text: `${icon("warning")} Command still in development`,
              ephemeral
            });
          } // fim do /emoji info

        }
          
      }
});