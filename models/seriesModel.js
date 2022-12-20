//Require Mongoose
const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const seriesSchema = new Schema({
    title:               String,
    description:         String,
    genre:               String,
    streamingService:   String

}, {toJSON:{virtuals: true} });

//Add virtual property to Note, to include (dynamic) links
seriesSchema.virtual('_links').get(
     function () {
        return {
            self: {
                href: `${process.env.BASE_URI}series/${this._id}`
            },
            collection: {
                href: `${process.env.BASE_URI}series/`
            }
        }
    }
)

//Export function to create "SomeModel" model class
module.exports = mongoose.model("Serie", seriesSchema);