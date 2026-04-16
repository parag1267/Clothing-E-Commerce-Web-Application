const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadImage = (buffer,folder) => {
    return new Promise((resolve,reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: folder,
                timeout: 60000
             },
            (error,result) => {
                if(error){
                    reject(error);
                }
                else {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id 
                    })
                }
            }
        )

        streamifier.createReadStream(buffer).pipe(stream);
    })
}

const deleteImage = async (public_id) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        console.log("Delete Success:", result);
        return result;
    } catch (error) {
        console.log("Delete Error:", error);
        throw error;
    }
}

module.exports = {uploadImage,deleteImage}