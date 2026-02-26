# 🟢 Criando uma Aplicação Node.js para Rodar no Kubernetes

Nesta etapa, criamos uma aplicação simples em Node.js, empacotamos em uma imagem Docker e publicamos no Docker Hub para que ela possa ser utilizada posteriormente no Kubernetes.

---

# 🧱 1️⃣ Criando a Aplicação Node

Primeiro, foi criada uma aplicação Node simples que imprime **"Hello World"** na tela.

Passos realizados:

```bash
npm init -y
```

Depois, foi criado um arquivo `index.js` com o seguinte conteúdo:

```javascript
const http = require('node:http');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

---

## 🧠 Observação Importante

O hostname foi definido como:

```
0.0.0.0
```

Isso é essencial para rodar dentro de containers, pois permite que o servidor aceite conexões externas ao container.

---

# 🐳 2️⃣ Criando o Dockerfile

Para gerar a imagem da aplicação, foi criado um arquivo `Dockerfile` com o seguinte conteúdo:

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

## 🧠 O que esse Dockerfile faz?

### 📦 FROM node:20-alpine
Utiliza a imagem oficial do Node.js baseada em Alpine (leve e otimizada).

### 📂 WORKDIR
Define o diretório de trabalho dentro do container.

### 📄 COPY package*.json
Copia apenas os arquivos de dependências primeiro (melhora cache de build).

### 📥 RUN npm install
Instala as dependências.

### 📁 COPY . .
Copia o restante da aplicação.

### 🌐 EXPOSE 3000
Expõe a porta 3000 (documentação da porta usada).

### ▶️ CMD
Executa `npm start` quando o container iniciar.

---

# 🏗️ 3️⃣ Buildando a Imagem Docker

Para gerar a imagem:

```bash
docker build -t felipeken/node-k8s .
```

### 📌 O que esse comando faz?

- `-t` → Define a tag da imagem
- `felipeken/node-k8s` → Nome da imagem no Docker Hub
- `.` → Usa o diretório atual como contexto de build

Após isso, a imagem estará disponível localmente.

---

# ▶️ 4️⃣ Rodando o Container Localmente

Para testar a aplicação:

```bash
docker run -p 3000:3000 felipeken/node-k8s
```

### 📌 Explicação

- `-p 3000:3000`
  - Primeira porta → Host
  - Segunda porta → Container

Agora é possível acessar:

```
http://localhost:3000
```

E visualizar:

```
Hello World
```

---

# ☁️ 5️⃣ Publicando a Imagem no Docker Hub

Após validar que tudo está funcionando:

```bash
docker push felipeken/node-k8s
```

Isso publica a imagem no Docker Hub.

Agora ela pode ser utilizada por:

- Kubernetes
- Outros desenvolvedores
- CI/CD
- Qualquer ambiente que tenha acesso ao Docker Hub

---

# 🧠 Fluxo Mental Completo

```
Criar aplicação Node
        ↓
Criar Dockerfile
        ↓
Buildar imagem
        ↓
Testar container localmente
        ↓
Publicar no Docker Hub
        ↓
Usar no Kubernetes
```