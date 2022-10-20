benchmark

# plain server
3000 avg=1.01s    min=2.15ms med=1.02s max=2.81s    p(90)=1.73s p(95)=1.78s
6000 avg=2.04s   min=2.17ms   med=2.16s max=10.75s   p(90)=3.78s p(95)=4.06s
9000 avg=3.94s    min=2.14ms   med=2.82s max=36.88s   p(90)=6.26s p(95)=8.87s 
9000[no check] avg=3.29s    min=1.92ms med=2.44s max=42.54s  p(90)=4.68s p(95)=6.74s

data_received..................: 701 MB 8.5 MB/s
     data_sent......................: 16 MB  193 kB/s
     http_req_blocked...............: avg=330.19ms min=0s     med=3µs   max=19.52s  p(90)=271µs p(95)=304.32ms
     http_req_connecting............: avg=330.17ms min=0s     med=0s    max=19.52s  p(90)=216µs p(95)=304.2ms 
     http_req_duration..............: avg=3.25s    min=0s     med=2.42s max=42.54s  p(90)=4.64s p(95)=6.74s   
       { expected_response:true }...: avg=3.29s    min=1.92ms med=2.44s max=42.54s  p(90)=4.68s p(95)=6.74s   
     http_req_failed................: 1.37%  ✓ 1047       ✗ 75364 
     http_req_receiving.............: avg=61.1µs   min=0s     med=36µs  max=19.17ms p(90)=66µs  p(95)=88µs    
     http_req_sending...............: avg=43.29µs  min=0s     med=14µs  max=21.08ms p(90)=60µs  p(95)=99µs    
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s    max=0s      p(90)=0s    p(95)=0s      
     http_req_waiting...............: avg=3.25s    min=0s     med=2.42s max=42.54s  p(90)=4.64s p(95)=6.74s   
     http_reqs......................: 76411  928.866259/s
     iteration_duration.............: avg=4.92s    min=1s     med=3.54s max=47.05s  p(90)=7.15s p(95)=20.51s  
     iterations.....................: 76411  928.866259/s
     vus............................: 76     min=0        max=8993
     vus_max........................: 9000   min=621      max=9000

3000 avg=594.68ms min=2.15ms med=567.8ms  max=3.1s     p(90)=1.12s p(95)=1.36s
6000 avg=767.69ms min=1.97ms med=716.3ms  max=3.05s    p(90)=1.6s p(95)=1.68s
9000 avg=1.72s    min=1.98ms med=1.23s max=21.08s   p(90)=3.87s p(95)=5.09s
9000[no check] avg=953.76ms min=2.04ms med=915.76ms max=11.21s   p(90)=1.62s p(95)=2.03s

# aggregate-fetcher server
data_received..................: 1.7 GB 23 MB/s
     data_sent......................: 39 MB  521 kB/s
     http_req_blocked...............: avg=41.07µs  min=1µs    med=3µs      max=207.27ms p(90)=5µs   p(95)=59µs 
     http_req_connecting............: avg=32.39µs  min=0s     med=0s       max=206.43ms p(90)=0s    p(95)=0s   
     http_req_duration..............: avg=953.76ms min=2.04ms med=915.76ms max=11.21s   p(90)=1.62s p(95)=2.03s
       { expected_response:true }...: avg=953.76ms min=2.04ms med=915.76ms max=11.21s   p(90)=1.62s p(95)=2.03s
     http_req_failed................: 0.00%  ✓ 0           ✗ 183632
     http_req_receiving.............: avg=47.84µs  min=14µs   med=32µs     max=108.43ms p(90)=55µs  p(95)=72µs 
     http_req_sending...............: avg=46.96µs  min=6µs    med=12µs     max=137.45ms p(90)=50µs  p(95)=103µs
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s       max=0s       p(90)=0s    p(95)=0s   
     http_req_waiting...............: avg=953.67ms min=1.95ms med=915.68ms max=11.21s   p(90)=1.62s p(95)=2.03s
     http_reqs......................: 183632 2468.761593/s
     iteration_duration.............: avg=1.95s    min=1s     med=1.91s    max=12.22s   p(90)=2.62s p(95)=3.03s
     iterations.....................: 183632 2468.761593/s
     vus............................: 3313   min=0         max=8960
     vus_max........................: 9000   min=559       max=9000


