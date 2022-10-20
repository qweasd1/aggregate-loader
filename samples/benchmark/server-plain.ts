import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";

const client = new PrismaClient();

const fastify = Fastify({
  logger: false,
});

// Declare a route
fastify.post("/posts", async function (request, reply) {
  const ids = request.body as number[];
  
  const result = await client.post.findMany({
    where:{
      id:{
        in:ids
      }
    }
  });

  reply.send(result)
});

fastify.get("/posts/:id", async function (request, reply) {
  const id = Number((request.params as any).id)
  reply.send(await client.post.findUnique({where:{id:id}}))
});

const PORT = 3000
console.log(`server running on ${PORT}`)
// Run the server!
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
