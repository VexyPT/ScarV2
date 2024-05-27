import { Schema } from "mongoose";

export const guildSchema = new Schema(
    {
        id: {
            type: String,
            required: true
        },
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);