#baixará uma imagem do node do dockerhub, na versão 22-alpine
FROM node:22-alpine

#criacao de uma pasta qualquer, pode ser qualquer nome. tudo ficará dentro dela.
WORKDIR /app

#instalao json server de maneira global
RUN npm install -g json-server@0.17.4

#copie o arquivo db.production.json para a pasta "app" ( o ponto no final refere-se à pasta app)
COPY db.production.json .

#exponha a porta 4000 do container
EXPOSE 4000

#iniciando o container e monitorando o arquivo db.production.json
ENTRYPOINT json-server --watch db.production.json --host 0.0.0.0 --port 4000

#comando para subir o container
#docker run -p 4000:4000 name cursoangular-api-container -d passeioapp-api