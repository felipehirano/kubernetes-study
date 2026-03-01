# 🌱 Utilizando Variáveis de Ambiente no Kubernetes

Em aplicações reais, é comum precisarmos utilizar variáveis de ambiente para:

- Configuração da aplicação
- Credenciais
- Feature flags
- Informações dinâmicas

Vamos ver duas formas de fazer isso no Kubernetes:

1️⃣ Definindo variáveis diretamente no Deployment  
2️⃣ Utilizando ConfigMap (boa prática)

---

# 🧱 Etapa 1 — Variáveis Hardcoded no Deployment

## 1️⃣ Atualizando a Aplicação Node

Primeiro, adicionamos suporte a variáveis de ambiente no código Node.js.

Exemplo:

```javascript
const name = process.env.NAME || "Default";
const age = process.env.AGE || "0";
```

Depois disso, geramos uma nova versão da imagem.

---

## 🐳 Gerando Nova Imagem

```bash
docker build -t felipeken/node-k8s:v2 .
```

Se necessário:

```bash
docker login -u YOUR_USERNAME
```

Publicando no Docker Hub:

```bash
docker push felipeken/node-k8s:v2
```

---

## 🛠️ Atualizando o Deployment

Alteramos o Deployment para:

- 1 réplica
- Nova imagem
- Variáveis definidas diretamente no manifesto

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeserver
  labels:
    app: nodeserver
spec:
  selector:
    matchLabels:
      app: nodeserver
  replicas: 1
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
          env:
            - name: NAME
              value: "Felipe Ken"
            - name: AGE
              value: "30"
```

---

## 🚀 Aplicando as Alterações

```bash
kubectl apply -f k8s/deployment.yaml
```

---

## 🔎 Testando com Port Forward

```bash
kubectl port-forward svc/node-service 8000:3000
```

Agora acesse:

```
http://localhost:8000
```

---

# ⚠️ Problema Dessa Abordagem

As variáveis estão:

```
Hardcoded no YAML
```

Isso não é ideal para:

- Produção
- Reutilização
- Versionamento limpo
- Separação de responsabilidade

Por isso usamos:

```
ConfigMap
```

---

# 🧩 Etapa 2 — Utilizando ConfigMap (Boa Prática)

## 📄 Criando o ConfigMap

Arquivo: `configmap-env.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: node-server
data:
  NAME: "Felipe Ken"
  AGE: "30"
```

---

## 🛠️ Alterando o Deployment

Agora removemos o `env` e usamos `envFrom`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeserver
  labels:
    app: nodeserver
spec:
  selector:
    matchLabels:
      app: nodeserver
  replicas: 1
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
          envFrom:
            - configMapRef:
                name: node-server
```

---

## 🚀 Aplicando ConfigMap e Deployment

```bash
kubectl apply -f k8s/configmap-env.yaml
kubectl apply -f k8s/deployment.yaml
```

---

## 🔎 Testando Novamente

```bash
kubectl port-forward svc/node-service 8000:3000
```

---

# 🔁 O Que Acontece Se Alterar o ConfigMap?

Se você alterar o ConfigMap:

```bash
kubectl apply -f k8s/configmap-env.yaml
```

O Pod NÃO atualiza automaticamente as variáveis.

Ele continuará usando as antigas.

---

# 🔎 Verificando Variáveis no Pod

Execute:

```bash
kubectl exec -it NOME_DO_POD -- printenv NOME_DA_VARIAVEL
```

Exemplo:

```bash
kubectl exec -it nodeserver-abc123 -- printenv NAME
```

Se estiver com valor antigo, precisamos reiniciar o Pod.

---

# 🔄 Atualizando Pods

## Opção 1 — Deletar o Pod

```bash
kubectl delete pod NOME_DO_POD
```

O Deployment recriará automaticamente.

---

## Opção 2 — Reiniciar o Deployment (Recomendado)

Se houver múltiplas réplicas:

```bash
kubectl rollout restart deployment nodeserver
```

Isso recria todos os Pods com as novas variáveis.

---

# 🧠 Fluxo Mental Completo

```
Aplicação usa process.env
        ↓
Variáveis definidas no Deployment
        ↓
Melhor prática → ConfigMap
        ↓
Deployment consome ConfigMap
        ↓
Se alterar ConfigMap → Reiniciar Pods
```

---

# 📌 Quando Usar ConfigMap?

Use ConfigMap para:

- Configurações não sensíveis
- Variáveis de ambiente
- Arquivos de configuração
- Feature flags

Para dados sensíveis, utilize:

```
Secret
```

---

# 🎯 Conclusão

Existem duas formas de trabalhar com variáveis de ambiente no Kubernetes:

1️⃣ Direto no Deployment (simples, mas não ideal)  
2️⃣ Utilizando ConfigMap (melhor prática)

O Kubernetes permite separar:

```
Código
Configuração
Infraestrutura
```

Essa separação é essencial em ambientes reais.