import { Event } from "#base";
import { settings } from "#settings";
import { brBuilder } from "@magicyan/discord";
import { EmbedBuilder, MessageReaction, User } from 'discord.js';

const EMOJIS_PER_PAGE = 8;

new Event({
    name: "devCommands",
    event: "messageCreate",
    async run(message) {

        const { client, content } = message;
        const args = content.split(' ');

        switch(args[0]) {
            case ".info_extended": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {

                    /*fields: [
                    {
                        name: "🌐 ⠂Network",
                        value: `${codeBlock("⬇️ 300mb - ⬆️ 150mb")}`,
                        inline: true
                    },
                    {
                        name: "🏓 ⠂Ping",
                        value: `${codeBlock(`${client.ws.ping}ms`)}`,
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
                        name: "🍀 ⠂Environment",
                        value: `${codeBlock("Production")}`,
                        inline: true
                    },
                ]*/

                    const guilds = client.guilds.cache.size.toLocaleString();
                    const users = client.guilds.cache.map(g => g.memberCount).reduce((a,b) => a + b).toLocaleString("pt-BR");
                    const shards = client.shard?.count;
                    const shardId = client.shard?.ids;
                    const clientEmojis = client.emojis.cache.size;
                    const CommandsSize = client.application.commands.cache.size;

                    message.reply({
                        content: brBuilder(
                            `Guilds: \`${guilds}\``,
                            `Users: \`${users}\``,
                            `Shards: \`${shards ?? "0"}\``,
                            `Shard Id: \`${shardId ?? "0"}\``,
                            `Emojis: \`${clientEmojis}\``,
                            `CommandsSize: \`${CommandsSize}\``,
                        )
                    });
                }
                break;
            }
            case ".list_emojis": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {
                    let currentPage = 0;

                    if (args.length > 1 && !isNaN(parseInt(args[1]))) {
                        currentPage = parseInt(args[1]) - 1;
                    }

                    const emojiList = client.emojis.cache.map((e) => `${e} \`${e.name}\` \`${e.id}\``);
                    const formattedEmojiList = emojiList !== null ? emojiList : []; // Verificando se emojiList é null
                    const totalPages = Math.ceil(formattedEmojiList.length / EMOJIS_PER_PAGE);

                    const generateEmbed = (page: number) => {
                        const start = page * EMOJIS_PER_PAGE;
                        const end = start + EMOJIS_PER_PAGE;
                        const emojis = formattedEmojiList.slice(start, end).join('\n');

                        return new EmbedBuilder()
                            .setTitle(`Emoji List - Page ${page + 1} of ${totalPages}`)
                            .setDescription(emojis || 'No emojis found');
                    };

                    const embedMessage = await message.reply({ embeds: [generateEmbed(currentPage)] });

                    if (totalPages > 1) {
                        await embedMessage.react('⬅️');
                        await embedMessage.react('➡️');

                        const filter = (reaction: MessageReaction, user: User) => ['⬅️', '➡️'].includes(reaction.emoji.name ?? '') && user.id === message.author.id; // Adicionando verificação para reaction.emoji.name
                        const collector = embedMessage.createReactionCollector({ filter });

                        collector.on('collect', (reaction, user) => {
                            reaction.users.remove(user.id);

                            if (reaction.emoji.name === '⬅️') {
                                currentPage = currentPage > 0 ? --currentPage : totalPages - 1;
                            } else if (reaction.emoji.name === '➡️') {
                                currentPage = currentPage + 1 < totalPages ? ++currentPage : 0;
                            }

                            embedMessage.edit({ embeds: [generateEmbed(currentPage)] });
                        });

                        collector.on('end', () => {
                            embedMessage.reactions.removeAll().catch(console.error);
                        });
                    }
                }
                break;
            }
        
        }
    
    }
    
});