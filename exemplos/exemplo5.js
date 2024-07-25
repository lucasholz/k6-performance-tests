/*

Private API
 - Buscando todos crocodilos

 Critérios
  - Performance test
    - 100 VU por 10s
  - Limites:
    - Requisição com falha inferior a 1%
    - Duração da requisição p(95) < 250

*/

import http from 'k6/http'
import { check, sleep } from 'k6'


export const options = {
  vus: 100,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate < 0.01'],
    http_req_duration: ['p(95) < 250']
  }
}

const BASE_URL = 'https://test-api.k6.io'


export function setup() {
  const USER = '0.42639256867672615@mail.com'
  const PASS = 'user123'

  const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
    username: USER,
    password: PASS
  })

  const token = loginRes.json('access')
  return token
}

export default function(token) {

  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'aplication/json'
    }
  }

  const res = http.get(`${BASE_URL}/my/crocodiles/`, params)

  check(res, {
    'status code 200': (r) => r.status === 200
  })

  sleep(1)
}