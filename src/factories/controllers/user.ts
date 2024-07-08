import {
  PasswordCompareAdapter,
  PasswordHasherAdapter,
  SignToken,
} from "../../adapters"

import {
  CreateUserController,
  GetUserByEmailController,
  GetUserByIdController,
} from "../../controllers"
//FIXME: Refactor imports
import { AuthUserController } from "../../controllers/user/auth-user"

import {
  PostgresCreateUserRepository,
  PostgresGetUserByEmailRepository,
  PostgresGetUserByIdRepository,
} from "../../repositories/postgres"

import {
  CreateUserUseCase,
  GetUserByEmailUseCase,
  GetUserByIdUseCase,
} from "../../use-cases"
import { AuthUserUseCase } from "../../use-cases/user/auth-user"

export const makeCreateUserController = () => {
  const createUserRepository = new PostgresCreateUserRepository()
  const postgresGetUserByEmailRepository =
    new PostgresGetUserByEmailRepository()
  const passwordHasherAdapter = new PasswordHasherAdapter()

  const createUserUseCase = new CreateUserUseCase(
    createUserRepository,
    postgresGetUserByEmailRepository,
    passwordHasherAdapter,
  )

  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}

export const makeGetUserByEmailController = () => {
  const postgresGetUserByEmailRepository =
    new PostgresGetUserByEmailRepository()

  const getUserByEmailUseCase = new GetUserByEmailUseCase(
    postgresGetUserByEmailRepository,
  )

  const getUserByEmailController = new GetUserByEmailController(
    getUserByEmailUseCase,
  )

  return getUserByEmailController
}

export const makeAuthUserController = () => {
  const postgresGetUserByEmailRepository =
    new PostgresGetUserByEmailRepository()
  const passwordCompareAdapter = new PasswordCompareAdapter()
  const signToken = new SignToken()

  const authUserUseCase = new AuthUserUseCase(
    postgresGetUserByEmailRepository,
    passwordCompareAdapter,
    signToken,
  )

  const authUserController = new AuthUserController(authUserUseCase)

  return authUserController
}

export const makeGetUserByIdController = () => {
  const postgresGetUserByIdRepository = new PostgresGetUserByIdRepository()

  const getUserByIdUseCase = new GetUserByIdUseCase(
    postgresGetUserByIdRepository,
  )

  const getUserByIdController = new GetUserByIdController(getUserByIdUseCase)

  return getUserByIdController
}
