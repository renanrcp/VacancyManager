# Vacancy Manager
Um gerenciador de férias para colaboradores

## Rodar o projeto
Como requisito desse projeto usaremos o [docker](https://www.docker.com/), e é necessário o possuir instalado.

Dentro da pasta do projeto rodar o comando
```bash
docker compose up
```

Acessar o rails pela url [api.localhost](http://api.localhost/) para rodar todas as migrações, uma vez que o banco virá vazio, basta clicar no botão "Run Pending Migrations".

Acessar o frontend da aplicação em [localhost](http://localhost).

## Considerações
- Apesar de não estar explicitamente escrito nas especificações, o projeto também verifica se a quantia de dias escolhida para um período deixará dias suficientes para o próximo período.
- O projeto também verifica se é necessário finalizar as férias para um período.
- As validações foram feitas no frontend pois acredito ter mais experiência e conforto para trabalhar com datas usando a lib [dayjs](https://day.js.org/), e por mais que o cadastro de colaboradores pudesse ser tranquilamente validado no backend, ficou no frontend para padronizar a análise.
- É possível rodar o projeto sem `docker compose`, mas precisará rodar um postgres, editar a conexão do banco no arquivo [database.yml](/config/database.yml), editar as portas do frontend ou backend, e alterar a url base do API Client no arquivo [axios.ts](/frontend/src/services/axios.ts).
- Para evitar maiores configurações o projeto não usa volumes do docker, então você terá que repetir o processo de rodar migrações caso você derrube o docker compose.
- O projeto foi feito usando [NextJS](https://nextjs.org/) ao invés de React cru pois possue um setup e desenvolvimento melhor e mais fácil.
- Apesar de usar a versão mais nova do NextJS todas as páginas foram inteiramente definidas como client-side para deixar o projeto menos complexo.