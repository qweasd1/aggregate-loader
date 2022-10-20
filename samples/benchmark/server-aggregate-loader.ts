import { Post, PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import {
  AggregateLoader,
  fixed,
  scale,
  scaleGroup,
  arrayToRecord,
} from "../../index";

const client = new PrismaClient();

const fastify = Fastify({
  logger: false,
});

const group = scaleGroup({
  maxWorkerSize: 30,
  onWorkerSizeChange(n) {
    console.log(`group: ${n}`);
  },
});

const aggLoader = new AggregateLoader<number, Post>({
  batchSize: 150,
  // batchStartHook(keys) {
  //     console.log(keys.length)
  // },
  batchLoadFn: arrayToRecord(
    async (keys) => {
      return client.post.findMany({
        where: {
          id: {
            in: keys,
          },
        },
      });
    },
    (entity) => entity.id
  ),
  scalar: group.scale({
    maxWorkerSize: 30,
    maxBatchSize: 150,
    onWorkerSizeChange(scale) {
      console.log(`scalar 1: ${scale}`);
    },
  }),
  // scalar: fixed(30),
});

fastify.post("/posts", async function (request, reply) {
  const ids = request.body as number[];
  reply.send(await aggLoader.fetch(ids));
});

fastify.get("/posts/:id", async function (request, reply) {
  const id = Number((request.params as any).id);
  reply.send(await aggLoader.fetchOne(id));
});

const PORT = 3000;
console.log(`server running on ${PORT}`);
// Run the server!
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
