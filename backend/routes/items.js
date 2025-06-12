const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../cloudinary');
const streamifier = require('streamifier');
const Item = require('../models/item');
const upload = multer(); // Subidas en memoria

router.post('/', upload.single('img'), async (req, res) => {
  try {
    const { nombre, descripcion, precio } = req.body;
    console.log('➡️ req.body:', req.body);
    console.log('📁 req.file:', req.file);

    if (!nombre || !descripcion || !precio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    let imgUrl = null;

    if (req.file && req.file.buffer) {
      // Subir imagen a Cloudinary
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'store-products' },
            (error, result) => {
              if (error) {
                console.error('❌ Cloudinary error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };

      const uploadResult = await streamUpload(req.file.buffer);
      imgUrl = uploadResult.secure_url;
      console.log('✅ Imagen subida a Cloudinary:', imgUrl);
    }

    const parsedPrecio = parseFloat(precio);
    if (isNaN(parsedPrecio)) {
      return res.status(400).json({ error: 'Precio no válido' });
    }

    const newItem = new Item({
      nombre,
      descripcion,
      precio: parsedPrecio,
      img: imgUrl
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (error) {
    console.error('💥 Error en /api/items POST:', error);
    res.status(500).json({
      error: 'Error al crear el item',
      message: error.message,
      stack: error.stack
    });
  }
});
 
module.exports = router;
