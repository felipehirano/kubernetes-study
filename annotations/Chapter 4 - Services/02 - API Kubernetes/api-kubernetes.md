# 🌐 Como o Kubernetes Funciona em Relação à API

O Kubernetes é totalmente orientado à API.

Tudo o que acontece dentro do cluster é feito através da:

```
Kubernetes API
```

Criar Pods, Deployments, Services, escalar aplicações, fazer rollback…  
Tudo é uma chamada para a API.

---

# 🧠 Kubernetes é API-First

O Kubernetes funciona assim:

```
Cliente → API Server → Cluster
```

Não existe ação direta nos Nodes.

Sempre existe uma requisição HTTP para o API Server.

---

# 🖥️ O Que é o kubectl?

O `kubectl` é um binário executável (CLI – Command Line Interface).

Ele:

- Se comunica com a API do Kubernetes
- Utiliza certificados autenticados
- Usa o arquivo `~/.kube/config`
- Faz requisições HTTPS para o API Server

Fluxo:

```
kubectl → Certificados → API Server → ETCD
```

---

# 🔐 Autenticação

O acesso à API do Kubernetes é protegido por:

- Certificados TLS
- Tokens
- RBAC
- Service Accounts

O arquivo:

```
~/.kube/config
```

Contém:

- Endereço da API
- Certificados
- Contextos
- Credenciais

---

# 🌍 A API Pode Ser Acessada Diretamente?

Sim.

A API do Kubernetes é uma API RESTful.

Ela pode ser acessada diretamente via HTTP/HTTPS.

Porém:

- Normalmente está em rede privada
- Protegida por autenticação
- Não é exposta publicamente

---

# 🔁 Como Acessar a API Localmente?

Se o cluster estiver rodando em uma rede fechada (como no Kind), podemos usar:

```
kubectl proxy
```

---

# 🚀 Criando um Proxy para a API

Execute:

```bash
kubectl proxy --port=8080
```

O que isso faz?

- Cria um proxy local
- Liga sua máquina ao cluster
- Encaminha requisições HTTP para a API
- Usa automaticamente seus certificados

Agora, ao acessar:

```
http://localhost:8080
```

Você está acessando a API do Kubernetes.

---

# 🔎 Acessando os Endpoints da API

Exemplo:

```
http://localhost:8080/api
```

Isso retorna informações da API principal.

Exemplo de resposta:

```json
{
  "kind": "APIVersions",
  "versions": ["v1"],
  "serverAddressByClientCIDRs": [...]
}
```

Você pode navegar pelos recursos disponíveis.

---

# 📚 Explorando a API

Alguns exemplos:

Listar Pods via API:

```
http://localhost:8080/api/v1/pods
```

Listar Deployments:

```
http://localhost:8080/apis/apps/v1/deployments
```

Isso é exatamente o que o kubectl faz por baixo dos panos.

---

# 🌐 Kubernetes é RESTful

A API do Kubernetes segue princípios REST:

- GET → Listar recursos
- POST → Criar recurso
- PUT/PATCH → Atualizar
- DELETE → Remover

Exemplo mental:

```
kubectl get pods
```

Internamente vira:

```
GET /api/v1/pods
```

---

# 🧠 Fluxo Mental Completo

```
kubectl apply -f deployment.yaml
        ↓
Requisição HTTPS
        ↓
API Server
        ↓
Validação
        ↓
Armazenamento no ETCD
        ↓
Controllers entram em ação
```

---

# 🎯 Conclusão

Kubernetes não é apenas um orquestrador.

Ele é:

```
Uma grande API distribuída
```

O `kubectl` é apenas um cliente.

Tudo que fazemos:

- Criar Pods
- Escalar
- Atualizar
- Fazer rollback
- Criar Services

É apenas comunicação com a API.