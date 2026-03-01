# 📦 Utilizando Volumes no Kubernetes com ConfigMap

Até agora utilizamos ConfigMap para injetar variáveis de ambiente via:

```
envFrom
```

Mas existe outra forma muito poderosa de utilizar ConfigMap:

```
Montando como Volume
```

Isso permite disponibilizar arquivos dentro do container.

---

# 🧠 Quando Usar ConfigMap como Volume?

Use essa abordagem quando:

- Você precisa montar arquivos de configuração
- Sua aplicação lê arquivos físicos
- Você quer simular um `.env`
- Quer atualizar configs sem rebuild de imagem

---

# 🎯 Cenário Base

Estamos usando:

- Aplicação Node.js
- Deployment `nodeserver`
- ConfigMap `node-server`

Agora vamos montar esse ConfigMap como arquivo dentro do container.

---

# 🧩 1️⃣ Criando um ConfigMap com Arquivo

Arquivo: `configmap-volume.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: node-config-file
data:
  app-config.env: |
    NAME=Felipe Ken
    AGE=30
```

Aqui criamos um arquivo chamado:

```
app-config.env
```

O conteúdo dele será montado dentro do container.

---

# 🛠️ 2️⃣ Alterando o Deployment para Usar Volume

Agora adicionamos duas seções:

- volumes
- volumeMounts

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeserver
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodeserver
  template:
    metadata:
      labels:
        app: nodeserver
    spec:
      containers:
        - name: nodeserver
          image: felipeken/node-k8s:v2
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: config-volume
              mountPath: /usr/src/app/config
      volumes:
        - name: config-volume
          configMap:
            name: node-config-file
```

---

# 🔍 O Que Está Acontecendo?

## 🔹 volumes

Define que existe um volume baseado no ConfigMap:

```yaml
volumes:
  - name: config-volume
    configMap:
      name: node-config-file
```

---

## 🔹 volumeMounts

Monta o volume dentro do container:

```yaml
volumeMounts:
  - name: config-volume
    mountPath: /usr/src/app/config
```

Isso significa que dentro do container será criado:

```
/usr/src/app/config/app-config.env
```

---

# 📁 Estrutura Dentro do Container

Depois de rodar o Pod, você pode verificar:

```bash
kubectl exec -it NOME_DO_POD -- ls /usr/src/app/config
```

Saída esperada:

```
app-config.env
```

Ver o conteúdo:

```bash
kubectl exec -it NOME_DO_POD -- cat /usr/src/app/config/app-config.env
```

---

# 🧠 Como a Aplicação Pode Usar Esse Arquivo?

No Node.js, você poderia:

- Ler o arquivo manualmente
- Usar dotenv
- Carregar configurações customizadas

Exemplo simples:

```javascript
const fs = require("fs");

const config = fs.readFileSync("/usr/src/app/config/app-config.env", "utf-8");
console.log(config);
```

---

# 🔄 Atualizando o ConfigMap

Se você alterar o ConfigMap:

```bash
kubectl apply -f k8s/configmap-volume.yaml
```

O arquivo será atualizado automaticamente no volume.

⚠️ Mas:

Se a aplicação já carregou o arquivo na inicialização, pode ser necessário reiniciar o Pod.

---

# 🔁 Reiniciando o Deployment

```bash
kubectl rollout restart deployment nodeserver
```

Isso garante que a aplicação carregue as novas configurações.

---

# 🧠 Diferença: Env vs Volume

| Método | Quando Usar |
|--------|------------|
| env / envFrom | Variáveis simples |
| Volume (ConfigMap) | Arquivos completos |

---

# 📊 Fluxo Mental

```
ConfigMap
      ↓
Volume
      ↓
Montado no container
      ↓
Aplicação lê arquivo
```

---

# 📌 Importante

ConfigMap NÃO é ideal para dados sensíveis.

Para:

- Senhas
- Tokens
- Chaves privadas

Use:

```
Secret
```

---

# 🎯 Conclusão

ConfigMap como volume permite:

- Separar configuração do código
- Evitar rebuild de imagem
- Atualizar arquivos dinamicamente
- Manter arquitetura limpa

Essa abordagem é muito utilizada para:

- Nginx config
- Arquivos YAML
- Configurações JSON
- Aplicações Node, Java, Python