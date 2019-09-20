import fastify from "fastify"

const home = (fastifyInstance: fastify.FastifyInstance, _: object, done: (err?: fastify.FastifyError) => void) => {
    fastifyInstance.get("/", async () => {
        return "OCN Bridge v0.1.0"
    })
    done()
}

export const startServer = async (): Promise<fastify.FastifyInstance> => {
    const app = fastify({
        // logger: { level: "info" },
        ignoreTrailingSlash: true,
        // trustProxy: true // tells fastify that it is sitting behind proxy and accepts X-Forwarded-* headers
    })
    app.register(home)
    await app.listen(3000)
    return app
}

export const stopServer = async (app: fastify.FastifyInstance) => {
    await app.close()
}
