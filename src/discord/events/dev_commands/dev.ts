import { Event } from "#base";
import { settings } from "#settings";
import { brBuilder } from "@magicyan/discord";
import { EmbedBuilder, MessageReaction, PermissionFlagsBits, TextChannel, User } from 'discord.js';

const EMOJIS_PER_PAGE = 8;
const SERVERS_PER_PAGE = 8;

new Event({
    name: "devCommands",
    event: "messageCreate",
    async run(message) {
        const { client, content } = message;
        const args = content.split(' ');

        switch(args[0]) {
            case ".help_dev": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {
                    message.react("📨");
                    message.author.send({
                        content: brBuilder(
                            "### - Dev Commands",
                            "> .info_extended",
                            "> .list_emojis",
                            "> .create_invite",
                            "> .list_servers"
                        )
                    });
                }
                break;
            }
            case ".info_extended": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {
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
            case ".list_servers": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {
                    let currentPage = 0;

                    if (args.length > 1 && !isNaN(parseInt(args[1]))) {
                        currentPage = parseInt(args[1]) - 1;
                    }

                    const servers = client.guilds.cache.map(guild => `${guild.name} - \`${guild.id}\``);
                    const totalPages = Math.ceil(servers.length / SERVERS_PER_PAGE);

                    const generateEmbed = (page: number) => {
                        const start = page * SERVERS_PER_PAGE;
                        const end = start + SERVERS_PER_PAGE;
                        const serverList = servers.slice(start, end).join('\n');

                        return new EmbedBuilder()
                            .setTitle(`Server List - Page ${page + 1} of ${totalPages}`)
                            .setDescription(serverList || 'No servers found');
                    };

                    const embedMessage = await message.reply({ embeds: [generateEmbed(currentPage)] });

                    if (totalPages > 1) {
                        await embedMessage.react('⬅️');
                        await embedMessage.react('➡️');

                        const filter = (reaction: MessageReaction, user: User) => ['⬅️', '➡️'].includes(reaction.emoji.name ?? '') && user.id === message.author.id;
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
            case ".create_invite": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {
                    try {
                        if (!args[1]) {
                            message.reply("Insira um ID");
                            return;
                        }
                        const guildId = args[1];
                        const guild = client.guilds.cache.get(guildId);
                        if (!guild) {
                            message.reply("O bot não está nesse servidor.");
                            return;
                        }

                        const channel = guild.channels.cache.find(
                            (ch) => ch.isTextBased() && (ch as TextChannel).permissionsFor(guild.members.me!)?.has(PermissionFlagsBits.CreateInstantInvite)
                        ) as TextChannel;

                        if (!channel) {
                            message.reply("Não há nenhum canal onde possa criar um convite.");
                            return;
                        }

                        const invite = await channel.createInvite({
                            maxAge: 0,
                            maxUses: 1
                        });

                        message.reply(`Aqui está o convite: ${invite.url}`);
                    } catch (error) {
                        console.error('Erro ao criar convite:', error);
                        message.reply("Ocorreu um erro ao criar o invite");
                    }
                }
                break;
            }
            case ".leave_server": {
                if (message.author.id != `${settings.dev}`) {
                    return;
                } else {
                    if (!args[1]) {
                        message.reply("Insira um ID");
                        return;
                    }
                    const guildId = args[1];
                    const guild = client.guilds.cache.get(guildId);

                    if (!guild) {
                        message.reply("O bot não está nesse servidor.");
                        return;
                    }

                    try {
                        await guild.leave();
                        message.reply(`O bot saiu do servidor ${guild.name}.`);
                    } catch (error) {
                        console.error("Erro ao sair do servidor:", error);
                        message.reply("Ocorreu um erro ao tentar sair do servidor.");
                    }
                }
                break;
            }
        }
    }
});
