import { PrismaClient } from "@prisma/client";
import { Chance } from "chance";

const client = new PrismaClient()

const chance = new Chance(1234)

async function seed(){
  console.time("generating posts")
  for (let i = 0; i < 1000; i++) {
    const batch = new Array(1000).fill(1).map(x=>({
      title:chance.sentence({words:10}),
      desciprtion:chance.sentence({words:50}),
      img:chance.url(),
      like:chance.integer({min:0,max:100000}),
      shared:chance.integer({min:0,max:10000})
    }))

    await client.post.createMany({
      data:batch,
      skipDuplicates:true
    })
  }
  
  console.timeEnd("generating posts")
}


seed().then(()=>{
  console.log("seed successfully")
})
