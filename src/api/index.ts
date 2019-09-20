import * as bodyParser from "body-parser"
import express from "express"
import {  Router } from "express"
import { Server } from "http"
import morgan from "morgan"

// import controllers
import { versionsController } from "./ocpi/v2_2/versions.controller"

// set basic home route
const homeController = Router()
homeController.get("/", async (_, res) => {
    res.send("OCN Bridge v0.1.0")
})

// bootstrap function
export const startServer = async (logger: boolean = true): Promise<Server> => {

    const app = express()
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(homeController)
    app.use("/ocpi/versions", versionsController)

    if (logger) {
        app.use(morgan("dev"))
    }

    return new Promise((resolve, reject) => {
        const server = app.listen(3000, (err?: Error) => {
            err ? reject(err) : resolve(server)
        })
    })
}

// stop server cleanly
export const stopServer = async (app: Server) => {
    return new Promise((resolve, reject) => {
        app.close((err?: Error) => {
            err ? reject(err) : resolve()
        })
    })
}
