import { formatDate } from "../../utils.js";
import { Excercise, User } from "./user.model.js"


export const createNewUser = async (user) => {
    try {
        const newUser = new User(user);
        await newUser.save()
        return { username: newUser.username, _id: newUser._id }
    }
    catch (error) {
        console.error(error)
        return undefined
    }
}
export const findUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username: username })
        if (!user) {
            throw new Error("user not found")
        }
        return user
    }
    catch (error) {
        console.error(error)
        return undefined
    }
}
export const findUserById = async (uid) => {
    try {
        const user = await User.findById(uid)
        if (!user) {
            throw new Error("user not found")
        }
        return user
    }
    catch (error) {
        console.error(error)
        return undefined
    }
}

export const getAllUsers = async () => {
    try {
        const users = await User.find().select({ _id: 1, username: 1, }).exec();
        return users
    }
    catch (error) {
        console.error(error)
        return undefined
    }
}
export const addExcerciseToUser = async (user, excercise) => {
    try {

        const exercise = new Excercise({ ...excercise, user: user._id });
        await exercise.save();
        return exercise.toJSON();
    }
    catch (error) {
        console.error(error)
        return undefined
    }
}

export const getLogsById = async (uid, filters) => {
    const query = { user: uid }
    const dateQuery = {}
    if (filters.from) {
        dateQuery.$gte = new Date(filters.from);
    }
    if (filters.to) {
        dateQuery.$lte = new Date(filters.to);
    }
    if (dateQuery.$gte || dateQuery.$lte) {
        query.date = { ...dateQuery }
    }

    try {
        const user = await User.findOne({ _id: uid })
        const excercises = await Excercise.find(query).limit(filters.limit)
            .select({ description: 1, duration: 1, date: 1, _id: 0 });
        const log = excercises.map(excercise => ({ ...excercise.toJSON(), date: formatDate(excercise.date) }))

        return {
            username: user.username,
            _id: user._id,
            count: log.length,
            log,
        }
    }
    catch (error) {
        console.error(error)
        return undefined
    }
}
