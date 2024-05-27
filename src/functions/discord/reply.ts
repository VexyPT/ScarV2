import { settings } from "#settings";
import { hexToRgb } from "@magicyan/discord";
import { AutocompleteInteraction, EmbedBuilder, EmbedData, Interaction } from "discord.js";

interface ReplyOptions {
  interaction: Exclude<Interaction, AutocompleteInteraction>,
  text: string;
  ephemeral?: boolean;
  update?: boolean;
  clear?: boolean;
  content?: string;
  send?: boolean;
  footer?: string;
  title?: string;
  thumbnail?: string;
  image?: string;
}

interface EmbedReplyOptions extends ReplyOptions {
  color: string
  embed?: EmbedData
}
export function embedReply({ interaction, text, ...options }: EmbedReplyOptions) {
  const { ephemeral=false, update=false, color, embed: data, clear, content, send=false, footer=[""], title=[""], thumbnail=[""], image=[""] } = options;

  const embed = new EmbedBuilder({
    color: hexToRgb(color),
    title: `${title}`,
    footer: {
      text: `${footer}`
    },
    image: {
      url: `${image}`
    },
    thumbnail: {
      url: `${thumbnail}`
    },
    description: text,
    ...data
  });

  const components = clear ? [] : undefined;
  
  if (update) {
    if (interaction.isMessageComponent()) {
      interaction.update({ content, embeds: [embed], components });
      return;
    }
    if (send) {
      interaction.channel?.send({ content, embeds: [embed], components });
    } else {
      interaction.reply({ content, embeds: [embed], components });
    }
    return;
  }
  if (send) {
    interaction.channel?.send({ embeds: [embed], content });
  } else {
    interaction.reply({ ephemeral, embeds: [embed], content });
  }
}

export const reply = {
  success(options: ReplyOptions) {
    embedReply({
      color: settings.colors.success,
      clear: true, ...options
    });
  },
  danger(options: ReplyOptions) {
    embedReply({
      color: settings.colors.danger,
      clear: true, ...options
    });
  },
  warning(options: ReplyOptions) {
    embedReply({
      color: settings.colors.warning,
      clear: true, ...options
    });
  },
  default(options: ReplyOptions) {
    embedReply({
      color: settings.colors.secondary,
      clear: true, ...options
    });
  }
};