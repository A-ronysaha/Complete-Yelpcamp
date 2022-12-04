const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name : process.env.CLOUDENARY_CLOUD_NAME,
    api_key :process.env.CLOUDENARY_KEY,
    api_secret : process.env.CLOUDENARY_SECRET
})

 
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Arghya_YelpCamp',
        allowedFormats: ['jpeg' ,'png' , 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}