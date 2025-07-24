import { PasswordHashService } from "../domain/service/PasswordHashService";
import { UserMySQLRepository } from "./db/User_MySQLRepository";

import { CreateUserUseCase } from "../application/usecases/CreateUser_UseCase";
import { DeleteUserUseCase } from "../application/usecases/DeleteUser_UseCase";
import { GetAllUseCase } from "../application/usecases/GetAll_UseCase";
import { GetByIdUseCase } from "../application/usecases/GetById_UseCase";
import { UpdateUserUseCase } from "../application/usecases/UpdateUser_UseCase";
import { FinedByEmailUseCase } from "../application/usecases/FinedByEmail_UseCase";

import { CreateUserController } from './controllers/CreateUser_Controller';
import { GetByIdController } from './controllers/GetById_Controller';
import { GetAllController } from './controllers/GetAll_Controller';
import { UpdateUserController } from './controllers/UpdateUser_Controller';
import { DeleteUserController } from './controllers/DeleteUser_Controller';
import { FinedByEmailController } from "./controllers/FinedByEmail_Controller";

// Incriptacion servicio
const passwordHashService = new PasswordHashService();

// Repositorio
const userRepository = new UserMySQLRepository();

// Casos de uso
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHashService);
const updateUserUseCase = new UpdateUserUseCase(userRepository, passwordHashService);
const getByIdUseCase = new GetByIdUseCase(userRepository);
const getAllUseCase = new GetAllUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const finedByEmailUsecase = new FinedByEmailUseCase(userRepository);

// Controllers
export const createUserController = new CreateUserController(createUserUseCase);
export const getAllController = new GetAllController(getAllUseCase);
export const getByIdController = new GetByIdController(getByIdUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const finedByEmailController = new FinedByEmailController(finedByEmailUsecase)