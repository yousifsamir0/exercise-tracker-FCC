import mongoose from "mongoose";
import { formatDate } from "../../utils.js";


const excerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        // get: formatDate,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})


export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

})
// userSchema.set('toJSON', { getters: true });
// userSchema.set('toObject', { getters: true });
export const User = mongoose.model("User", userSchema);
export const Excercise = mongoose.model("Excercise", excerciseSchema);

