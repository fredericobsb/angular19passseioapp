#etapa1: build
FROM node:22-alpine AS build

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install
#Copie tudo que está na pasta que o Dockerfile está (src)  para dentro da pasta app
COPY . .

RUN npm run build --prod

#etapa2: rodar a aplicacao
FROM nginx:alpine

#deleta arquivos html padrao do servidor nginx
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/passeio-app/browser /usr/share/nginx/html

#expoe a porta do nginx
EXPOSE 80

#inicia o servidor nginx dentro do container docker
ENTRYPOINT ["nginx", "-g", "daemon off;"]

#comando para criar o container da aplicacao
#docker build --tag cursoangular-app .

#comando para subir o container da aplicacao
#docker run -p 4200:80 --name cursoangular-app-container -d cursoangular-app

#comando para verificar logs do container da aplicacao
#docker logs cursoangular-app-container

#comando para remover o container
#docker rm -f meu_container
