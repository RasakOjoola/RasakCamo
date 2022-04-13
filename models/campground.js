const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
ImageSchema.virtual('thumbnailcrop').get(function () {
    return this.url.replace('/upload', '/upload/ar_4:5,c_crop')
})

///////////////////https://res.cloudinary.com/unkind/image/upload/v1649287826/Rasak%20Camp/j0mrbjebyoml1jmzza9e.jpg
// images: [
//     {
//     url: String,
//     filename: String
// }
// ]
////\\\\\\\\\\\\\\\\
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    price: Number,

    images: [ImageSchema],
    description: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    location: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, ref: 'Review'
        }
    ]
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong> 
    <p>${this.description.substring(0, 20)}....</p>`
})


CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)