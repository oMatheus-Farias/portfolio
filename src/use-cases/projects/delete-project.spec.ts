import { describe, it, expect, vitest } from "vitest"

import { DeleteProjectUseCase } from "./delete-project"

import { faker } from "@faker-js/faker"

describe("Delete Project UseCase", () => {
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

  class PostgresDeleteProjectRepositoryStub {
    async execute() {
      return project
    }
  }

  class PostgresGetProjectByIdRepositoryStub {
    async execute() {
      return project
    }
  }

  const makeSut = () => {
    const postgresDeleteProjectRepositoryStub =
      new PostgresDeleteProjectRepositoryStub()
    const postgresGetProjectByIdRepositoryStub =
      new PostgresGetProjectByIdRepositoryStub()

    const sut = new DeleteProjectUseCase(
      postgresDeleteProjectRepositoryStub,
      postgresGetProjectByIdRepositoryStub,
    )

    return {
      sut,
      postgresDeleteProjectRepositoryStub,
      postgresGetProjectByIdRepositoryStub,
    }
  }

  it("should successfully delete a project", async () => {
    const { sut } = makeSut()

    const result = await sut.execute(project.id, project.userId)

    expect(result).not.toBeNull()
    expect(result).toEqual(project)
  })
})
