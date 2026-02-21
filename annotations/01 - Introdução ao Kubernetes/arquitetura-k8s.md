# ☸️ Kubernetes Architecture – Passo a Passo

Este documento explica detalhadamente o fluxo de funcionamento da arquitetura do Kubernetes, desde a requisição do usuário até a execução dos containers nos Worker Nodes.

O objetivo é entender como cada componente interage dentro do cluster.

Fluxo para entender a arquitetura do K8S( Esse diagrama mostra a arquitetura de um cluster):

![architecture](../../images/kubernetes-architecture.png)

---

# 🧑‍💻 1️⃣ Usuário Interage com o Cluster

O acesso ao cluster pode acontecer de duas formas:

- 🟢 **UI** → Interface gráfica (Dashboard, Lens, etc.)
- 🟢 **CLI (kubectl)** → Linha de comando

Exemplo:

```bash
kubectl apply -f deployment.yaml
```

Nesse momento você está dizendo:

> "Eu quero que esse Deployment exista no cluster."

---

# 🌐 2️⃣ Requisição Chega no API Server

Tudo no Kubernetes passa pelo:

## 🔹 API Server

Ele é a porta de entrada do cluster.

Responsável por:

- 🔐 Autenticação
- 🛡️ Autorização (RBAC)
- ✅ Validação do YAML
- 💾 Persistência do objeto
- 📢 Notificação dos Controllers

Nada acontece no cluster sem passar pelo API Server.

---

# 💾 3️⃣ Estado é Salvo no ETCD

Após validação:

## 🔹 ETCD

- Banco de dados distribuído
- Guarda o estado desejado e atual do cluster
- Fonte única da verdade

Quando você cria um Deployment, ele é armazenado no ETCD.

---

# 🎯 4️⃣ Controller Manager Entra em Ação

O:

## 🔹 Controller Manager

Ele observa constantemente o estado do cluster.

Ele compara:

```
Estado Atual vs Estado Desejado
```

Se perceber diferença, ele age.

Exemplo:

- Você declarou 3 réplicas
- Só existem 2 Pods rodando
- Ele cria mais 1

Ele também:

- Cria ReplicaSets
- Garante disponibilidade
- Monitora objetos

---

# 📅 5️⃣ Scheduler Decide Onde Rodar

Os Pods criados ainda não têm Node definido.

Entra em ação o:

## 🔹 Scheduler

Ele analisa:

- 🧮 CPU disponível
- 💾 Memória disponível
- 🎯 Afinidade / Anti-afinidade
- 🚧 Taints e Tolerations

E decide:

- Pod 1 → Worker Node 1
- Pod 2 → Worker Node 2

---

# 🖥️ 6️⃣ Worker Nodes Executam os Pods

Agora vamos para os Worker Nodes.

Cada Worker Node contém:

---

## 🔹 kubelet

- Agente que roda no Node
- Conversa com o API Server
- Garante que os Pods definidos estejam rodando

Ele recebe a instrução:

> "Crie esse Pod aqui."

---

## 🔹 Container Runtime (Docker no diagrama)

O kubelet utiliza o runtime (Docker, containerd, etc.) para:

- 📥 Baixar a imagem
- 📦 Criar o container
- ▶️ Executar o processo

Aqui os containers realmente começam a rodar.

---

## 🔹 kube-proxy

Responsável por:

- 🌐 Regras de rede
- 🔁 Comunicação entre Pods
- ⚖️ Load balancing interno

Ele configura regras de iptables ou IPVS para permitir a comunicação entre serviços.

---

# 📦 7️⃣ Pods Rodando Dentro do Node

Dentro de cada Worker Node:

- Existem vários Pods
- Cada Pod pode ter 1 ou mais containers
- Compartilham:
  - IP
  - Network namespace
  - Volumes

Agora sua aplicação está rodando.

---

# 🔄 8️⃣ Monitoramento Contínuo (Reconciliação)

O ciclo não termina.

Se:

- 🔥 Um Pod morrer → Controller cria outro
- 💥 Um container parar → kubelet reinicia
- 🖥️ Um Node cair → Pods são reescalonados
- 📝 Você atualizar o YAML → Novo estado é aplicado

O Kubernetes está constantemente reconciliando estado.

---

# 🧠 Fluxo Completo Resumido

```
Usuário (kubectl)
      ↓
API Server
      ↓
ETCD
      ↓
Controller Manager
      ↓
ReplicaSet
      ↓
Scheduler
      ↓
Worker Node
      ↓
kubelet
      ↓
Container Runtime
      ↓
Container rodando
```

---

# 🏗️ Separação Clara de Responsabilidades

## 🧠 Control Plane (Decisão)

- API Server
- Scheduler
- Controller Manager
- ETCD

Responsável por:

- Armazenar estado
- Tomar decisões
- Garantir consistência

---

## 🛠️ Worker Nodes (Execução)

- kubelet
- kube-proxy
- Container Runtime
- Pods

Responsáveis por:

- Executar workloads
- Manter containers rodando
- Garantir comunicação de rede

---

# 🎯 Conceito Central

Nada vai direto para o Node.

Tudo passa pelo Control Plane.

Kubernetes é um sistema distribuído baseado em estado declarativo, que constantemente compara:

```
Estado Atual ≠ Estado Desejado → Ajustar
```

Essa é a essência da arquitetura do Kubernetes.