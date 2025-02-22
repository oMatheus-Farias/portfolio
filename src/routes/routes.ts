import { Router, Request, Response } from "express"
import {
  makeAuthUserController,
  makeCreateProjectController,
  makeCreateUserController,
  makeDeleteProjectController,
  makeGetProjectByIdController,
  makeGetProjectByNameController,
  makeGetProjectsByUserIdController,
  makeGetUserByEmailController,
  makeGetUserByIdController,
  makeUpdateProjectController,
} from "../factories/controllers"

import { isAuthenticated } from "../middlewares/is-authenticated"

export const router = Router()

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running 🚀" })
})

router.post("/api/user", async (req: Request, res: Response) => {
  const createUserController = makeCreateUserController()

  const { statusCode, body } = (await createUserController.execute({
    httRequest: req.body,
  })) as {
    statusCode: number
    body: {
      id: string
      firstName: string
      lastName: string
      email: string
      password: string
    }
  }

  res.status(statusCode).json(body)
})

router.get("/api/user/:email", async (req: Request, res: Response) => {
  const getUserByEmailController = makeGetUserByEmailController()

  const { statusCode, body } = (await getUserByEmailController.execute(
    req.params.email,
  )) as unknown as {
    statusCode: number
    body: {
      email: string
    }
  }

  res.status(statusCode).json(body)
})

router.get(
  "/api/user/id/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(
      req.params.userId,
    )

    res.status(statusCode).json(body)
  },
)

router.post("/api/user/auth", async (req: Request, res: Response) => {
  const authUserController = makeAuthUserController()

  const { statusCode, body } = await authUserController.execute(
    req.body.email,
    req.body.password,
  )

  res.status(statusCode).json(body)
})

router.post(
  "/api/project",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const createProjectController = makeCreateProjectController()

    const { statusCode, body } = (await createProjectController.execute({
      httpRequest: req.body,
    })) as {
      statusCode: number
      body: {
        name: string
        description: string
        imagesUrl: string[]
        repositoryUrl: string
        projectUrl: string
        technologies: string[]
        userId: string
      }
    }

    res.status(statusCode).json(body)
  },
)

router.get(
  "/api/project/name/:name",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const getProjectByNameController = makeGetProjectByNameController()

    const { statusCode, body } = await getProjectByNameController.execute(
      req.params.name,
    )

    res.status(statusCode).json(body)
  },
)

router.get(
  "/api/project/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const getProjectByIdController = makeGetProjectByIdController()

    const { statusCode, body } = await getProjectByIdController.execute(
      req.params.id,
    )

    res.status(statusCode).json(body)
  },
)

router.get(
  "/api/projects/:userId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const getProjectsByUserIdController = makeGetProjectsByUserIdController()

    const { statusCode, body } = await getProjectsByUserIdController.execute(
      req.params.userId,
    )

    res.status(statusCode).json(body)
  },
)

router.patch(
  "/api/project/:projectId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const updateProjectController = makeUpdateProjectController()

    const { statusCode, body } = await updateProjectController.execute({
      projectId: req.params.projectId,
      userId: req.body.userId,
      updateParams: req.body,
    })

    res.status(statusCode).json(body)
  },
)

router.delete(
  "/api/project/delete/:projectId",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const deleteProjectController = makeDeleteProjectController()

    const { statusCode, body } = await deleteProjectController.execute(
      req.params.projectId,
      req.body.userId,
    )

    res.status(statusCode).json(body)
  },
)
