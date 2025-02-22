import { describe, it, expect, vitest } from "vitest"

import { GetProjectByIdController } from "./get-project-by-id"
import { GetProjectByIdUseCase } from "../../use-cases/projects/get-project-by-id"

import { faker } from "@faker-js/faker"

describe("Get Project By Id Controller", () => {
  const project = {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    description: faker.lorem.paragraph(),
    imagesUrl: [faker.internet.url()],
    repositoryUrl: faker.internet.url(),
    projectUrl: faker.internet.url(),
    technologies: [faker.lorem.word()],
    userId: faker.string.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }

  class PostgresGetProjectByIdRepositoryStub {
    async execute() {
      return project
    }
  }

  const makeSut = () => {
    const postgresGetProjectByIdRepositoryStub =
      new PostgresGetProjectByIdRepositoryStub()

    const getProjectByIdUseCase = new GetProjectByIdUseCase(
      postgresGetProjectByIdRepositoryStub,
    )

    const sut = new GetProjectByIdController(getProjectByIdUseCase)

    return {
      sut,
      postgresGetProjectByIdRepositoryStub,
    }
  }

  it("should return 200 if project is found", async () => {
    const { sut } = makeSut()

    const result = await sut.execute(project.id)

    expect(result).toEqual({
      statusCode: 200,
      body: project,
    })
  })

  it("should return 400 if project id is invalid", async () => {
    const { sut } = makeSut()

    const result = await sut.execute("invalid-id")

    expect(result.statusCode).toBe(400)
  })

  it("should return 400 if project id is missing", async () => {
    const { sut } = makeSut()

    const result = await sut.execute("")

    expect(result.statusCode).toBe(400)
  })

  it("should return 404 if project is not found", async () => {
    const { sut, postgresGetProjectByIdRepositoryStub } = makeSut()

    vitest
      .spyOn(postgresGetProjectByIdRepositoryStub, "execute")
      .mockResolvedValueOnce(null)

    const result = await sut.execute(project.id)

    expect(result.statusCode).toBe(404)
  })

  it("should return 500 if any error occurs", async () => {
    const { sut, postgresGetProjectByIdRepositoryStub } = makeSut()

    vitest
      .spyOn(postgresGetProjectByIdRepositoryStub, "execute")
      .mockRejectedValueOnce(new Error())

    const result = await sut.execute(project.id)

    expect(result.statusCode).toBe(500)
  })
})
