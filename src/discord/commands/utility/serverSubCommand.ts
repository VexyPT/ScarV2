import { Command } from "#base";
import { icon, reply } from "#functions";
import { settings } from "#settings";
import { createRow, hexToRgb } from "@magicyan/discord";
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ComponentType,
    EmbedBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    UserFlagsString
} from "discord.js";

new Command({
    name: "server",
    description: "Gerencia o modulo de servidor",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "badges",
            description: "Veja as badges do servidor",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction) {
        const { options, guild, client } = interaction;

        if (!guild) {
            reply.danger({
                interaction,
                text: `${icon("danger")} This command can only be used on a server`,
                ephemeral
            });
            return;
        }

        switch (options.getSubcommand()) {
            case "badges": {
                const badges: string[] = [];
                const counts: { [key: string]: number } = {};

                await guild.members.fetch();

                for (const member of guild.members.cache.values()) {
                    const user = await client.users.fetch(member.user.id);
                    badges.push(...(user.flags?.toArray() || []));
                }

                for (const badge of badges) {
                    counts[badge] = (counts[badge] || 0) + 1;
                }

                const embed = new EmbedBuilder({
                    color: hexToRgb(settings.colors.secondary),
                    author: { name: `Badges - ${guild.name}`, iconURL: client.user?.displayAvatarURL() || "" },
                    thumbnail: { url: guild.iconURL() || "" },
                    description: `${icon("discordStaff")} Discord Staff: \`${counts["Staff"] || 0}\`\n${icon("partner")} Partner: \`${counts["Partner"] || 0}\`\n${icon("moderatorAluri")} Certified Moderator: \`${counts["CertifiedModerator"] || 0}\`\n${icon("hypeSquadEvents")} HypeSquad Events: \`${counts["Hypesquad"] || 0}\`\n${icon("bravery")} HypeSquad Bravery: \`${counts["HypeSquadOnlineHouse1"] || 0}\`\n${icon("brilliance")} HypeSquad Brilliance: \`${counts["HypeSquadOnlineHouse2"] || 0}\`\n${icon("balance")} HypeSquad Balance: \`${counts["HypeSquadOnlineHouse3"] || 0}\`\n${icon("bughunter")} Bug Hunter: \`${counts["BugHunterLevel1"] || 0}\`\n${icon("bughunter2")} Bug Hunter Gold: \`${counts["BugHunterLevel2"] || 0}\`\n${icon("activeDev")} Active Developer: \`${counts["ActiveDeveloper"] || 0}\`\n${icon("verifiedDev")} Early Verified Bot Developer: \`${counts["VerifiedDeveloper"] || 0}\`\n${icon("earlySupporter")} Early Supporter: \`${counts["PremiumEarlySupporter"] || 0}\``
                });

                const row = createRow(
                    new StringSelectMenuBuilder({
                        customId: "badges",
                        placeholder: "Badges",
                        options: [
                            {
                                label: `Discord Staff (${counts["Staff"] || 0})`,
                                emoji: `${settings.emojis.static.discordStaff}`,
                                value: "Staff",
                            },
                            {
                                label: `Partner (${counts["Partner"] || 0})`,
                                emoji: `${settings.emojis.static.partner}`,
                                value: "Partner",
                            },
                            {
                                label: `Certified Moderator (${counts["CertifiedModerator"] || 0})`,
                                emoji: `${settings.emojis.static.moderatorAluri}`,
                                value: "CertifiedModerator",
                            },
                            {
                                label: `HypeSquad Events (${counts["Hypesquad"] || 0})`,
                                emoji: `${settings.emojis.static.hypeSquadEvents}`,
                                value: "Hypesquad",
                            },
                            {
                                label: `HypeSquad Bravery (${counts["HypeSquadOnlineHouse1"] || 0})`,
                                emoji: `${settings.emojis.static.bravery}`,
                                value: "HypeSquadOnlineHouse1",
                            },
                            {
                                label: `HypeSquad Brilliance (${counts["HypeSquadOnlineHouse2"] || 0})`,
                                emoji: `${settings.emojis.static.brilliance}`,
                                value: "HypeSquadOnlineHouse2",
                            },
                            {
                                label: `HypeSquad Balance (${counts["HypeSquadOnlineHouse3"] || 0})`,
                                emoji: `${settings.emojis.static.balance}`,
                                value: "HypeSquadOnlineHouse3",
                            },
                            {
                                label: `Bug Hunter (${counts["BugHunterLevel1"] || 0})`,
                                emoji: `${settings.emojis.static.bughunter}`,
                                value: "BugHunterLevel1",
                            },
                            {
                                label: `Golden Bug Hunter (${counts["BugHunterLevel2"] || 0})`,
                                emoji: `${settings.emojis.static.bughunter2}`,
                                value: "BugHunterLevel2",
                            },
                            {
                                label: `Active Developer (${counts["ActiveDeveloper"] || 0})`,
                                emoji: `${settings.emojis.static.activeDev}`,
                                value: "ActiveDeveloper",
                            },
                            {
                                label: `Early Verified Bot Developer (${counts["VerifiedDeveloper"] || 0})`,
                                emoji: `${settings.emojis.static.verifiedDev}`,
                                value: "VerifiedDeveloper",
                            },
                            {
                                label: `Early Supporter (${counts["PremiumEarlySupporter"] || 0})`,
                                emoji: `${settings.emojis.static.earlySupporter}`,
                                value: "PremiumEarlySupporter",
                            }
                        ]
                    })
                );

                const msg = await interaction.reply({ embeds: [embed], components: [row] });

                const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

                collector.on("collect", async (i) => {
                    const check = i.values[0];
                    if (typeof check !== "string") return;
                    await i.deferUpdate();

                    const members: string[] = [];
                    guild.members.cache.forEach(member => {
                        if (member.user.flags?.toArray().includes(check as UserFlagsString)) {
                            members.push(`<@${member.user.id}> - \`${member.user.tag}\` (${member.user.id})`);
                        }
                    });

                    if (members.length === 0) {
                        members.push("No members found");
                    }

                    let currentPage = 0;
                    const itemsPerPage = 10;
                    const totalPages = Math.ceil(members.length / itemsPerPage);

                    const getEmbed = (page: number) => {
                        const start = page * itemsPerPage;
                        const end = start + itemsPerPage;
                        const pageMembers = members.slice(start, end);

                        return new EmbedBuilder({
                            color: hexToRgb(settings.colors.secondary),
                            title: `${check} (${counts[check] || 0})`,
                            description: `The people with this badge within the server: \n\n> ${pageMembers.join("\n> ")}`,
                            footer: { text: `Page ${page + 1} of ${totalPages}` }
                        });
                    };

                    // vou só optimizar o comando, tenho toque

                    const buttons = createRow(
                        new ButtonBuilder({
                            customId: "prev",
                            emoji: `${settings.emojis.static.leftArrow}`,
                            style: ButtonStyle.Secondary,
                            disabled: currentPage === 0
                        }),
                        new ButtonBuilder({
                            customId: "next",
                            emoji: `${settings.emojis.static.rightArrow}`,
                            style: ButtonStyle.Secondary,
                            disabled: currentPage === totalPages - 1
                        })
                    );

                    const embedResponse = getEmbed(currentPage);
                    const message = await i.followUp({ embeds: [embedResponse], components: [buttons], ephemeral: true });

                    const buttonCollector = (message as any).createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

                    buttonCollector.on("collect", async (buttonInteraction: { customId: string; update: (arg0: { embeds: EmbedBuilder[]; components: ActionRowBuilder<ButtonBuilder>[]; }) => any; }) => {
                        if (buttonInteraction.customId === "prev" && currentPage > 0) {
                            currentPage--;
                        } else if (buttonInteraction.customId === "next" && currentPage < totalPages - 1) {
                            currentPage++;
                        }

                        const embedResponse = getEmbed(currentPage);
                        const buttons = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder({
                                    customId: "prev",
                                    emoji: `${settings.emojis.static.leftArrow}`,
                                    style: ButtonStyle.Secondary,
                                    disabled: currentPage === 0
                                }),
                                new ButtonBuilder({
                                    customId: "next",
                                    emoji: `${settings.emojis.static.rightArrow}`,
                                    style: ButtonStyle.Secondary,
                                    disabled: currentPage === totalPages - 1
                                })
                            );

                        await buttonInteraction.update({ embeds: [embedResponse], components: [buttons] });
                    });
                });

                break;
            }
        }
    }
});