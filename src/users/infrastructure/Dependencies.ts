import { CreateUserUseCase } from "../application/CreateUser_UseCase";
import { DeleteUserUseCase } from "../application/DeleteUser_UseCase";
import { GetAllUseCase } from "../application/GetAll_UseCase";
import { GetByIdUseCase } from "../application/GetById_UseCase";
import { UpdateUserUseCase } from "../application/UpdateUser_UseCase";
import { UserMySQLRepository } from "./db/User_MySQLRepository";
import { FinedByEmailUseCase } from "../application/FinedByEmail_UseCase";

import { CreateUserController } from './controllers/CreateUser_Controller';
import { GetByIdController } from './controllers/GetById_Controller';
import { GetAllController } from './controllers/GetAll_Controller';
import { UpdateUserController } from './controllers/UpdateUser_Controller';
import { DeleteUserController } from './controllers/DeleteUser_Controller';
import { FinedByEmailController } from "./controllers/FinedByEmail_Controller";

// Repositorio
const userRepository = new UserMySQLRepository();

// Casos de uso
const createUserUseCase = new CreateUserUseCase(userRepository);
const getByIdUseCase = new GetByIdUseCase(userRepository);
const getAllUseCase = new GetAllUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const finedByEmailUsecase = new FinedByEmailUseCase(userRepository);

// Controllers
export const createUserController = new CreateUserController(createUserUseCase);
export const getAllController = new GetAllController(getAllUseCase);
export const getByIdController = new GetByIdController(getByIdUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const finedByEmailController = new FinedByEmailController(finedByEmailUsecase)