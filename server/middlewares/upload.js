import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import folders from '../helpers/folders';

/**
 *@desc upload photo to Cloudinary
 **/

export async function uploadImage(image, key) {
    try {
        let imageFile = image;

        //image file path
        const filePath = `./src/photos/image${Date.now()}.jpg`;

        //move image to the photo directory
        await imageFile.mv(filePath);

        // conditionals to know folder name t
        const folder_name = (key === 1) ? folders.users : (key === 2) ? folders.category : folders.foods;

        //upload image
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder_name
        });

        // Delete image on server after upload
        fs.unlinkSync(filePath);
        console.log('Photo deleted');

        return result.secure_url
    } catch (e) {
        console.error(e.message)
    }
}