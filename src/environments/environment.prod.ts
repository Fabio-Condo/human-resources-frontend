export const environment = {
  production: true,
  apiUrl: 'http://192.168.11.44:85'               // DOCKER // O IP é da minha máquina física dentro da rede. O backend aceita fazer request nesse indereco atraves do postman
  
  // O Docker por padrao tem um bridge network que um tem swich que esta conectado a minha rede local, porque isso que usei o IP da minha rede local para fazer a comunicacao entre o backend e o frontend
};
