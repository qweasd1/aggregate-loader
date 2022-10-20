import http from 'k6/http';
import { check, sleep } from 'k6';
import zipfGenerator from './zipfian.js'

const generator = zipfGenerator.getGenerator(10000)

export const options = {
  stages: [
    { duration: '2s', target: 100 },
    { duration: '5s', target: 1000 },
    { duration: '15s', target: 3000 },
    { duration: '20s', target: 6000 },
    { duration: '30s', target: 9000 },
    { duration: '20s', target: 6000 },
    { duration: '15s', target: 3000 },
    { duration: '15s', target: 1000 },
    // { duration: '15s', target: 100 },
    // { duration: '15s', target: 1000 },
    // { duration: '15s', target: 500 },
    // { duration: '15s', target: 300 },
    // { duration: '15s', target: 2000 },
    { duration: '15s', target: 10 },
    // { duration: '20s', target: 6000 },
    // { duration: '30s', target: 9000 },
    // { duration: '30s', target: 12000 },
    // { duration: '30s', target: 3000 },

    // { duration: '60s', target: 6000 },
    // { duration: '30s', target: 6000 },

    // { duration: '90s', target: 9000 },
    // { duration: '30s', target: 9000 },

    // { duration: '120s', target: 12000 },
    // { duration: '30s', target: 12000 },
  ]
};

// export const options = {
//   vus: 1,
//   duration: '1s',
// };


function sample(k) {
  
  const result = new Set()
  while(true) {
    const _number = generator.nextInt() + 1
    result.add(_number)
    if(result.size == k) {
      return [...result]
    }
  }
  
}


export default function () {
  // const ids = sample(20)
  
  // const res = http.post('http://localhost:3000/posts',JSON.stringify(ids),{
  //   headers:{
  //     'Content-Type': 'application/json'
  //   }
  // });
  // check(res,{
  //   "result correct":(r)=>{
  //     const idSet = new Set(ids)
  //     const result = JSON.parse(r.body)
  //     for (const data of result) {
  //       if(!idSet.has(data["id"])){
  //         return false
  //       }
  //     }
  //     return result.length == ids.length
  //   }
  // })


  const id = sample(1)[0]
  
  const res = http.get('http://localhost:3000/posts/' + id,{
    headers:{
      'Content-Type': 'application/json'
    }
  });
  // check(res,{
  //   "result correct":(r)=>{
  //     const result = JSON.parse(r.body)
  //     return result.id === id
  //   }
  // })

  sleep(1);
}