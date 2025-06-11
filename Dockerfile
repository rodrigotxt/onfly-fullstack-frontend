# Estágio de desenvolvimento
FROM node:18-alpine AS development-stage

WORKDIR /app

# Onde os executáveis são linkados: /usr/local/bin
ENV PATH="/usr/local/bin:$PATH"

# Copia os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala o Quasar CLI globalmente
RUN npm install -g @quasar/cli

RUN npm install --ignore-scripts

# Copia o restante dos arquivos
COPY . .

RUN quasar prepare

# Expõe a porta padrão do Quasar dev server
EXPOSE 9000

# Comando para iniciar o servidor de desenvolvimento
CMD ["quasar", "dev"]