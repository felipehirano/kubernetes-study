# 🌍 Expondo Aplicações para Fora do Cluster

Até agora vimos o Service do tipo **ClusterIP**, que permite acesso apenas dentro do cluster.

Mas e se quisermos acessar a aplicação de fora do Kubernetes?

Para isso temos dois tipos principais:

- NodePort
- LoadBalancer

---

# 🚪 Service do Tipo NodePort

O **NodePort** permite acessar a aplicação externamente através de uma porta aberta em cada Node do cluster.

---

## 🧠 Como Funciona?

Quando criamos um Service do tipo NodePort:

- O Kubernetes gera uma porta
- Essa porta é aberta em TODOS os Nodes
- Qualquer requisição feita para essa porta será encaminhada para o Service
- O Service distribui para os Pods

Ou seja:

```
IP_DO_NODE:NodePort → Service → Pod
```

---

## 🔢 Intervalo de Portas

O Kubernetes utiliza um range padrão:

```
30000 – 32767
```

Essas são as portas reservadas para NodePort.

---

## 🧱 Exemplo de NodePort

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nodeserver-service
spec:
  selector:
    app: nodeserver
  type: NodePort
  ports:
    - name: nodeserver-server
      port: 80
      protocol: TCP
      targetPort: 3000
      nodePort: 30001
```

---

## 🔎 Entendendo as Portas

- `port: 80` → Porta interna do Service
- `targetPort: 3000` → Porta do container
- `nodePort: 30001` → Porta aberta no Node

---

## 🌐 Como Acessar

Se o IP do Node for:

```
192.168.1.10
```

Você pode acessar via:

```
http://192.168.1.10:30001
```

Independente de qual Node receber a requisição, ela será encaminhada para o Service.

---

# ⚖️ Vantagens e Limitações do NodePort

## ✅ Vantagens

- Simples
- Funciona em qualquer cluster
- Ideal para testes

## ❌ Limitações

- Exposição direta do Node
- Porta não amigável (ex: 30001)
- Não recomendado para produção pública

---

# ☁️ Service do Tipo LoadBalancer

O **LoadBalancer** é utilizado principalmente em clusters gerenciados (Cloud).

Exemplos:

- GKE (Google Kubernetes Engine)
- EKS (Amazon Elastic Kubernetes Service)
- AKS (Azure Kubernetes Service)

---

## 🧠 Como Funciona?

Quando criamos um Service do tipo LoadBalancer:

- O provedor de cloud cria um Load Balancer externo
- Um IP público é gerado automaticamente
- O tráfego externo é direcionado para o Service
- O Service distribui entre os Pods

Fluxo:

```
IP Público → LoadBalancer → Service → Pods
```

---

## 🧱 Exemplo de LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nodeserver-service
spec:
  selector:
    app: nodeserver
  type: LoadBalancer
  ports:
    - name: nodeserver-server
      port: 80
      protocol: TCP
      targetPort: 3000
```

---

## 🌐 O Que Acontece ao Criar?

Ao executar:

```bash
kubectl apply -f service.yaml
```

E depois:

```bash
kubectl get svc
```

Você verá algo como:

```
NAME                  TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)
nodeserver-service    LoadBalancer   10.96.23.145    34.125.88.210   80:31234/TCP
```

O campo:

```
EXTERNAL-IP
```

É o IP público gerado automaticamente.

Qualquer pessoa que acessar:

```
http://34.125.88.210
```

Acessará sua aplicação.

---

# 🧠 LoadBalancer Herda Funcionalidades

O Service do tipo LoadBalancer:

- Possui ClusterIP
- Possui NodePort
- E ainda cria um IP externo

Ou seja, ele combina os dois tipos anteriores e adiciona acesso externo público.

---

# 📊 Comparação Final

| Tipo | Acesso | Uso Ideal |
|------|--------|----------|
| ClusterIP | Interno | Comunicação entre Pods |
| NodePort | Externo via IP do Node | Testes / ambientes simples |
| LoadBalancer | Externo via IP público | Produção em Cloud |

---

# 🎯 Conclusão

Se a aplicação está:

- Apenas dentro do cluster → ClusterIP
- Testando localmente → NodePort
- Em produção na Cloud → LoadBalancer

Entender esses três tipos é essencial para dominar exposição de aplicações no Kubernetes.