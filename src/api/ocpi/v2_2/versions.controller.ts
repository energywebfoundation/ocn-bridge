import { Router } from "express"

export const versionsController = Router()

versionsController.get("/", async (_, res) => {
    // TODO: token authorization middleware
    res.send({
        versions: [
            {
                version: "2.2",
                // TODO: configurable public IP
                url: "http://localhost:3000/ocpi/versions/2.2"
            }
        ]
    })
})

versionsController.get("/2.2", async (_, res) => {
    // TODO: token authorization middleware
    res.send({
        version: "2.2",
        endpoints: [
            // TODO: add implemented endpoints
        ]
    })
})
