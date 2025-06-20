import { Router } from 'express';
import { addPlantController, deleteController, getAllController, getByIdController, searchPlantController, updateController } from './Dependecncias';

const plantRouter = Router();

plantRouter.get('/plants/search', (req, res) => searchPlantController.run(req, res));
plantRouter.post('/plants', (req, res) => addPlantController.run(req, res));
plantRouter.put('/plants/:id', (req, res) => updateController.run(req, res));
plantRouter.delete('/plants/:id', (req, res) => deleteController.run(req, res));
plantRouter.get('/plants', (req, res) => getAllController.run(req, res));
plantRouter.get('/plants/:id', (req, res) => getByIdController.run(req, res));

export default plantRouter;