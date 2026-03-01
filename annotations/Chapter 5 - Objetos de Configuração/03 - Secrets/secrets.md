# 🔐 Utilizando Secrets no Kubernetes

Até agora utilizamos:

- ConfigMap → Para configurações não sensíveis
- Volumes → Para montar arquivos
- Env → Para variáveis simples

Mas quando precisamos armazenar:

- Senhas
- Tokens
- Chaves privadas
- Strings de conexão
- Credenciais de banco

Devemos usar:

```
Secret
```

---

# 🧠 O Que é um Secret?

Um Secret é um objeto do Kubernetes utilizado para armazenar informações sensíveis.

Ele é parecido com o ConfigMap, porém:

- Os dados são armazenados em base64
- Pode ter políticas de acesso via RBAC
- É a forma correta para credenciais

---

# ⚠️ Importante

Base64 NÃO é criptografia.

É apenas codificação.

Mas o Kubernetes pode:

- Criptografar em repouso (se configurado)
- Controlar acesso via RBAC

---

# 🧩 1️⃣ Criando um Secret Manualmente (via YAML)

Arquivo: `secret-env.yaml`

Primeiro, codifique os valores em base64.

Exemplo:

```bash
echo -n "felipe" | base64
echo -n "123456" | base64
```

Supondo que gere:

```
felipe → ZmVsaXBl
123456 → MTIzNDU2
```

Agora o YAML:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: node-secret
type: Opaque
data:
  DB_USER: ZmVsaXBl
  DB_PASSWORD: MTIzNDU2
```

---

# 🛠️ Aplicando o Secret

```bash
kubectl apply -f k8s/secret-env.yaml
```

Verificando:

```bash
kubectl get secrets
```

---

# 🌱 2️⃣ Utilizando Secret como Variável de Ambiente

Agora alteramos o Deployment:

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
          env:
            - name: DB_USER
              valueFrom:
                secretKeyRef:
                  name: node-secret
                  key: DB_USER
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: node-secret
                  key: DB_PASSWORD
```

---

# 🔎 Verificando no Container

```bash
kubectl exec -it NOME_DO_POD -- printenv DB_USER
```

O valor será exibido já decodificado.

---

# 📦 3️⃣ Utilizando Secret como Volume

Assim como ConfigMap, Secret também pode ser montado como volume.

```yaml
volumeMounts:
  - name: secret-volume
    mountPath: /usr/src/app/secrets
    readOnly: true

volumes:
  - name: secret-volume
    secret:
      secretName: node-secret
```

Isso criará arquivos dentro do container:

```
/usr/src/app/secrets/DB_USER
/usr/src/app/secrets/DB_PASSWORD
```

---

# 🔍 Visualizando os Arquivos

```bash
kubectl exec -it NOME_DO_POD -- ls /usr/src/app/secrets
```

Ver conteúdo:

```bash
kubectl exec -it NOME_DO_POD -- cat /usr/src/app/secrets/DB_USER
```

---

# 🧠 Fluxo Mental

```
Secret
     ↓
Deployment referencia
     ↓
Variável de ambiente OU Volume
     ↓
Container recebe credencial
```

---

# 📊 Diferença Entre ConfigMap e Secret

| Característica | ConfigMap | Secret |
|---------------|-----------|--------|
| Dados sensíveis | ❌ | ✅ |
| Base64 obrigatório | ❌ | ✅ |
| Uso comum | Configuração | Senhas / Tokens |
| Pode virar volume | ✅ | ✅ |

---

# ⚠️ Atualização de Secret

Se você alterar o Secret:

```bash
kubectl apply -f k8s/secret-env.yaml
```

Os Pods NÃO atualizam automaticamente as variáveis.

É necessário:

```bash
kubectl rollout restart deployment nodeserver
```

---

# 🎯 Conclusão

Use:

- ConfigMap → Para configuração
- Secret → Para dados sensíveis

Separar:

```
Código
Configuração
Credenciais
```

É fundamental em ambientes de produção.