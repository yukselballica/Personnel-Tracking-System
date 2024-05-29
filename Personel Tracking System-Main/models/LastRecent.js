import mongoose, { Schema } from "mongoose";
import { formatDate } from "../config/formatDate.js";

const LastRecent = new Schema({
    name: String,
    email: String,
    image: String,
    type: String,
    date: {
        type: String,
        default: formatDate()
    }
})

export const LastRecentModel = mongoose.model('LastRecent', LastRecent)
