import { describe, it, expect } from "vitest"

import request from "supertest"
import { app } from "../app"

import { faker } from "@faker-js/faker"

describe("User routes E2E tests", () => {
  it("POST /api/user should return 201 when user is created", async () => {
    const response = await request(app)
      .post("/api/user")
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 8,
        }),
      })

    expect(response.status).toBe(201)
  })

  it("GET /api/user/email should return 200 when user is found", async () => {
    const { body } = await request(app)
      .post("/api/user")
      .send({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 8,
        }),
      })

    const email = body.email

    const response = await request(app).get("/api/user/email").send({
      email,
    })

    expect(response.status).toBe(200)
  })
})
