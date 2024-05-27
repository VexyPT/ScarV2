import { Schema } from "mongoose";

export const memberSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
        //guildId: t.string,
    },
    {
        statics: {
            async get(member: { id: string }) {
                const query = { id: member.id };
                return await this.findOne(query) ?? this.create(query);
            }
            /*async get(member: { id: string, guild: { id: string } }) {
                const query = { id: member.id, guildId: member.guild.id };
                return await this.findOne(query) ?? this.create(query);
            }*/
        }
    },
);