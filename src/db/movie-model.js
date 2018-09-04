import mongoose, { Schema } from 'mongoose'
const MovieSchema = new Schema ({
    _id: { type: Number, default: Date.now },
    title: { type: String, required: true },
    url: { type: String, required: true },
    synopsis: { type: String, required: true }
})

export const Movie = mongoose.model("Movie", MovieSchema)