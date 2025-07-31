import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    // El destino donde se guardarán los archivos
    destination: function (req, file, cb) {
        cb(null, './src/uploads/');
    },
    filename: function (req, file, cb) {
        // Genera un nombre único para evitar sobreescribir archivos con el mismo nombre.
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: El tipo de archivo no está permitido. Solo se aceptan imágenes (jpeg, jpg, png, gif).'));
};

// Crear la instancia de Multer con la configuración
export const Upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter
});