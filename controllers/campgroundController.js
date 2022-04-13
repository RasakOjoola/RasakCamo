const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken })



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("invalid Campground Data", 400);
    try {
        const geodata = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()
        const campground = new Campground(req.body.campground)


        campground.geometry = geodata.body.features[0].geometry;

        campground.author = req.user._id
        campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))

        await campground.save();
        req.flash('success', 'Successfully made a new Campground');
        res.redirect(`/campgrounds/${campground._id}`)
    } catch (e) {
        console.log(e)
        req.flash('error', 'Fake Location,please check and try again');
        res.redirect('/campgrounds/new')
    }


}
module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }

    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }

    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find campground')
        return res.redirect('/campgrounds')
    }


    res.render('campgrounds/edit', { campground })
}
module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    const updateCampground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    updateCampground.images.push(...images)
    await updateCampground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updateCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })

    }
    req.flash('success', 'Successfully updated Campground')
    res.redirect(`/campgrounds/${updateCampground._id}`)


}
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deleteCampground = await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campground')

    res.redirect(`/campgrounds`)
}

