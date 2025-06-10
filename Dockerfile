# Estágio de desenvolvimento
FROM node:18-alpine as development-stage

WORKDIR /app

# Adiciona o diretório global do npm ao PATH
# Onde os pacotes globais do npm são instalados em imagens node-alpine é: /usr/local/lib/node_modules/
# Onde os executáveis são linkados: /usr/local/bin
ENV PATH="/usr/local/bin:$PATH"

# Instala o Quasar CLI globalmente
RUN npm install -g @quasar/cli

# Copia os arquivos de dependência primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta padrão do Quasar dev server
EXPOSE 9000

# Comando para iniciar o servidor de desenvolvimento
CMD ["quasar", "serve"]