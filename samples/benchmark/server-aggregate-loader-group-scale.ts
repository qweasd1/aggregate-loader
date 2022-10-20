import { Post, PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import { AggregateLoader, fixed, scale,scaleGroup } from "../../index";

const client = new PrismaClient();

const fastify = Fastify({
  logger: false,
});

const group = scaleGroup({
  maxWorkerSize:30,
  onWorkerSizeChange(n){
    console.log(`group: ${n}`)
  }
})


const aggLoader = new AggregateLoader<number, Post>({
  batchSize: 150,
  // batchStartHook(keys) {
  //     console.log(keys.length)
  // },
  batchLoadFn: async (keys: number[]) => {
    const data = await client.post.findMany({
      where: {
        id: {
          in: keys,
        },
      },
    });
    const result = {} as any;
    for (const post of data) {
      result[post.id] = post;
    }
    return result;
  },
  scalar: group.scale({
    maxWorkerSize: 20,
    maxBatchSize: 150,
    onWorkerSizeChange(scale) {
      console.log(`scalar 1: ${scale}`);
    },
  }),
  // scalar: fixed(30),
});

const aggLoader2 = new AggregateLoader<number, Post>({
  batchSize: 150,
  // batchStartHook(keys) {
  //     console.log(keys.length)
  // },
  batchLoadFn: async (keys: number[]) => {
    const data = await client.post.findMany({
      where: {
        id: {
          in: keys,
        },
      },
    });
    const result = {} as any;
    for (const post of data) {
      result[post.id] = post;
    }
    return result;
  },
  scalar: group.scale({
    maxWorkerSize: 20,
    maxBatchSize: 150,
    onWorkerSizeChange(scale) {
      console.log(`scalar 2: ${scale}`);
    },
  }),
  // scalar: fixed(30),
});

// fastify.post("/posts", async function (request, reply) {
//   const ids = request.body as number[];
//   reply.send(await aggLoader.fetch(ids));
//   reply.send(await aggLoader.fetch(ids));
// });

fastify.post("/posts", async function (request, reply) {
  const ids = request.body as number[];
  await aggLoader2.fetch(ids)
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
