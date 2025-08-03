import { PlantMySQLRepository } from "./db/Plants_MySQLRepository";

import { AddPlantUseCase } from "../application/AddPlant_UseCase";
import { GetAllUseCase } from "../application/GetAll_UseCase";
import { GetByIdUseCase } from "../application/GetById_UseCase";
import { UpdatePlantUseCase } from "../application/Update_UseCase";
import { DeletePlantUseCase } from "../application/Delete_UseCase";
import { SearchPlantUseCase } from "../application/SearchPlant_UseCase";
import { GetPlantsBySellerUseCase } from "../application/FindBySellerId_UseCase";

import { GetAllController } from "./controllers/GetAll_Controller";
import { AddPlantController } from "./controllers/AddPlant_Controller";
import { GetByIdController } from "./controllers/GetById_Controller";
import { UpdatePlantController } from "./controllers/Update_Controller";
import { DeletePlantController } from "./controllers/Delete_Controller";
import { SearchPlantController } from "./controllers/SearchPlant_Controller";
import { GetPlantsBySellerController } from "./controllers/FindBySellerId_Controller";

const plantRepository = new PlantMySQLRepository();

const addPlantUseCase = new AddPlantUseCase(plantRepository);
const getAllUseCase = new GetAllUseCase(plantRepository);
const getByIdUseCase = new GetByIdUseCase(plantRepository);
const updateUseCase = new UpdatePlantUseCase(plantRepository);
const deleteUseCase = new DeletePlantUseCase(plantRepository);
const searchPlantUseCase = new SearchPlantUseCase(plantRepository);
const getPlantsBySellerUseCase = new GetPlantsBySellerUseCase(plantRepository);

export const addPlantController = new AddPlantController(addPlantUseCase);
export const getAllController = new GetAllController(getAllUseCase);
export const getByIdController = new GetByIdController(getByIdUseCase);
export const updateController = new UpdatePlantController(updateUseCase);
export const deleteController = new DeletePlantController(deleteUseCase);
export const searchPlantController = new SearchPlantController(searchPlantUseCase);
export const getPlantsBySellerController = new GetPlantsBySellerController(getPlantsBySellerUseCase);