import { Router } from 'express';
import { addPlantController, deleteController, getAllController, getByIdController, getPlantsBySellerController, searchPlantController, updateController } from './Dependecncias';
import { Upload } from './middleware/Upload';
import { isAuthenticated, hasRole } from '../../core/middlewares/authMiddleware';

const plantRouter = Router();

// Rutas protegidas para usuarios y vendedores
plantRouter.get(
    '/plants/search',
    isAuthenticated,
    (req, res) => searchPlantController.run(req, res)
);
plantRouter.get(
    '/plants',
    isAuthenticated,
    (req, res) => getAllController.run(req, res)
);
plantRouter.get(
    '/plants/:id', 
    isAuthenticated,
    (req, res) => getByIdController.run(req, res)
);

// Rutas protegigas solo para vendedor (eliminar)
plantRouter.delete(
    '/plants-delete/:id', 
    isAuthenticated,
    hasRole(['Vendedor']),
    (req, res) => deleteController.run(req, res)
);

// Rutas protegigas solo para vendedor (registro y actualizacion)
plantRouter.post(
    '/plants/add', 
    isAuthenticated,
    hasRole(['Vendedor']),
    Upload.single('plantImage'),
    (req, res) => addPlantController.run(req, res)
);

plantRouter.put(
    '/plants/update/:id',
    isAuthenticated,
    hasRole(['Vendedor']),
    Upload.single('plantImage'),
    (req, res) => updateController.run(req, res)
);

plantRouter.get(
    '/my-plants',
    isAuthenticated,
    hasRole(['Vendedor']),
    getPlantsBySellerController.run.bind(getPlantsBySellerController)
);

export default plantRouter;