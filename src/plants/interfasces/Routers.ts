import { Router } from 'express';
import { addPlantController, deleteController, getAllController, getByIdController, searchPlantController, updateController } from './Dependecncias';
import { Upload } from './middleware/Upload';

const plantRouter = Router();

plantRouter.get('/plants/search', (req, res) => searchPlantController.run(req, res));
plantRouter.delete('/plants/:id', (req, res) => deleteController.run(req, res));
plantRouter.get('/plants', (req, res) => getAllController.run(req, res));
plantRouter.get('/plants/:id', (req, res) => getByIdController.run(req, res));

plantRouter.post(
    '/plants', 
    Upload.single('plantImage'),
    (req, res) => addPlantController.run(req, res)
);

plantRouter.put(
    '/plants/:id', 
    Upload.single('plantImage'), // <-- AÑADIDO AQUÍ
    (req, res) => updateController.run(req, res)
);


export default plantRouter;