const express = require("express")
const router = express.Router()
const cloudinary = require("cloudinary").v2

// cloudinary configuration
cloudinary.config({
    cloud_name: "dsvc4kfvh",
    api_key: "545287793619738",
    api_secret: "sWccqW67uZ33IPj56MmTzIn1iwA",
});

// image upload API
router.post("/", (req, res) => {
    // collected image from a user
    const data = {
        image: req.body.image,
    }

    // upload image here
    cloudinary.uploader.upload(data.image)
        .then((result) => {
            res.status(200).send({
                message: "success",
                result,
            })
        }).catch((error) => {
            res.status(500).send({
                message: "failure",
                error,
            })
        })
})

module.exports = router