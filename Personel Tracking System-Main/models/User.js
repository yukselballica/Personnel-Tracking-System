import mongoose, { Schema } from "mongoose";

const User = new Schema({
    name: String,
    departman: String,
    email: String,
    phone: String,
    password: String,
    image: String,
    salary: {
        type: Number,
        default: 0
    },
    performans: {
        type: Number,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

export const UserModel = mongoose.model('User', User)
