/*

Private API
 - Buscando todos crocodilos

 Critérios
  - Realizar consulta a API de listagem de crocodilos e busca por id de crocodilos
  - É esperado um RPS de 200 REQ/S para a API de listagem de crocodilos durante 30s
  - Para busca por id, o sistema deve atender 50 usuários onde cada usuário realizará 20 solicitação em até 1min.
    - Usuários par devem realizar buscar ao crocodilo de ID 2
    - Usuários impar devem realizar buscar ao crocodilo de ID 1
  - Ambos os testes devem ser executados simultaneamente

 __ENV.URL = https://test-api.k6.io/public/
*/
import http from 'k6/http'

export const options = {
  scenarios:{
    listar: {
      executor: 'constant-arrival-rate',
      exec: 'listar',
      duration: '30s',
      rate: 200,
      timeUnit: '1s',
      preAllocatedVus: 150,
      gracefulStop: '10s',
      tags: {teste_type: 'listagem_de_crocodilos'}
    },
    buscar: {
      executor: 'per-vu-iterations',
      exec: 'buscar',
      vus: 50,
      iterations: 20,
      maxDuration: '1m',
      gracefulStop: '10s',
      tags: {teste_type: 'busca_de_crocodilos'}
    }
  }
}

export function listar() {
  http.get(__ENV.URL+'crocodiles')
}

export function buscar() {
  if(__VU % 2 === 0){
    http.get(__ENV.URL+'crocodiles/2')
  }else{
    http.get(__ENV.URL+'crocodiles/1')
  }
}
