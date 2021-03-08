const Campground = require('../models/campGround');
const {cloudinary} = require('../cloudinary/index.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN

const geoCoder = mbxGeocoding({accessToken : mapboxToken})

module.exports.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground });
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(campground)
    if(!campground)
    {
        req.flash('error','Campground Not Found')
        res.redirect('/campgrounds')
    }
    //console.log(campground)
    res.render('campgrounds/show', { campground });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground)
    {
        req.flash('error','Campground Not Found')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}


module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    const geoData = await geoCoder.forwardGeocode({
        query : campground.location,
        limit : 1
    }).send();
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(fl => ({url:fl.path, filename : fl.filename }));
    campground.author = req.user._id;
    console.log(campground)
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(fl => ({url:fl.path, filename : fl.filename }));
    campground.images.push(...imgs)
    campground.save();
    if(req.body.deleteImages) {

        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images : {filename : {$in : req.body.deleteImages}}}})
    }
    req.flash('success','Successfully Updated Campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Campground Deleted Successfully')
    res.redirect(`/campgrounds`)
}