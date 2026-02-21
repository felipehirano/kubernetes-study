# 🎯 O que é Kubernetes?

- ☸️ É um **orquestrador de containers**
- 📦 Produto **Open Source**
- ⚙️ Automatiza:
  - Implantação (Deploy)
  - Escalonamento (Scaling)
  - Gerenciamento de aplicações containerizadas

Segundo a documentação oficial:

> Kubernetes é um sistema open-source para automatizar a implantação, o dimensionamento e o gerenciamento de aplicações em containers.

---

# 🧠 Conceitos Fundamentais

## 🔌 API First

- Tudo no Kubernetes acontece através de **APIs**
- Cada ação é uma chamada para o **API Server**
- Utilizamos o CLI `kubectl` como interface para essas APIs

Fluxo:

```
kubectl → API Server → Cluster
```

---

## 🎯 Desired State (Estado Desejado)

Kubernetes trabalha baseado em **estado declarativo**.

Você define o estado desejado, e o cluster se encarrega de convergir para esse estado.

Exemplo:

- Você declara que quer 3 Pods rodando
- Se 1 cair
- O Kubernetes automaticamente cria outro

Ele está sempre reconciliando:

```
Estado Atual ≠ Estado Desejado → Ajustar
```

---

## 📄 Declarativo vs Imperativo

### 📌 Declarativo (mais utilizado)

- Utiliza arquivos `.yaml`
- Você descreve o que quer
- O K8S executa

Exemplo:

```bash
kubectl apply -f deployment.yaml
```

### ⚡ Imperativo

- Comandos diretos via CLI
- Mais comum para testes rápidos

---

# 🏗️ Arquitetura do Cluster

## 🌐 Cluster

Um cluster é um conjunto de máquinas (Nodes).

Cada máquina possui:

- 🧮 vCPU
- 💾 Memória

O Kubernetes soma todos esses recursos e gerencia a distribuição das aplicações.

---

## 🧠 Control Plane (Master)

É o cérebro do cluster.

Responsável por:

- Receber requisições
- Validar objetos
- Armazenar estado
- Tomar decisões
- Agendar Pods

Ele decide **onde** e **como** as aplicações serão executadas.

---

## 🛠️ Worker Nodes

São os nós de trabalho.

Responsáveis por:

- Executar Pods
- Rodar containers
- Reportar status ao Control Plane

Eles obedecem às instruções do Master.

---

# 📦 Objetos Principais

Trabalhar com Kubernetes é trabalhar com **objetos da API**.

---

## 🧩 Pods

- Menor unidade implantável no Kubernetes
- Contém um ou mais containers
- Representa processos rodando no cluster

Normalmente:

```
1 Pod = 1 Container
```

Mas pode existir:

```
1 Pod = Múltiplos Containers (sidecar pattern)
```

---

## 🚀 Deployment

- É um **objeto da API do Kubernetes**
- NÃO é um Node
- NÃO é uma máquina
- NÃO executa containers diretamente

Ele é apenas uma **definição de estado desejado**.

Ele é responsável por:

- Criar Pods
- Gerenciar réplicas
- Atualizações
- Garantir disponibilidade

Ele utiliza **ReplicaSets** para manter o número desejado de Pods.

---

## 🧠 Deployment NÃO é um Node

### ❌ Deployment não é um Node  
### ❌ Deployment não é uma máquina  
### ❌ Deployment não roda containers diretamente  

### ✅ Node é a máquina onde os Pods rodam  
### ✅ Deployment é apenas um objeto declarativo  

---

## 📊 Hierarquia Real de Execução

Quando você cria um Deployment, o fluxo real é:

```
Deployment
   ↓
ReplicaSet
   ↓
Pods
   ↓
Containers
   ↓
Node (onde roda de verdade)
```

Ou seja:

- O Deployment cria um ReplicaSet
- O ReplicaSet cria os Pods
- O Scheduler escolhe um Node
- O Node executa o container

---

## 📊 Exemplo de Replicação

- Backend → 3 réplicas
- Frontend → 2 réplicas

Se uma réplica cair:

✅ O Deployment sobe automaticamente outra

Se você quiser escalar:

```
2 → 3 réplicas
```

O Kubernetes cria um novo Pod automaticamente.

---

# ⚖️ Agendamento e Recursos

## ❌ Falta de Recursos

Se não houver CPU ou memória suficiente:

- O Pod fica em estado **Pending**
- O cluster informa indisponibilidade de recursos

---

## ✅ Recursos Disponíveis em Outro Node

Se existir outro Node com capacidade:

- O K8S agenda automaticamente o Pod nele

---

# 🩺 Autocura (Self-Healing)

Kubernetes se preocupa com a saúde do cluster.

Se:

- 🔥 Um Pod travar → Ele recria
- 💥 Um container parar → Ele reinicia
- 🖥️ Um Node cair → Ele redistribui workloads

Ele está constantemente monitorando o estado do sistema.

---

# 🧠 Analogia Mental (Para Fixar)

Pense assim:

- 🏢 Cluster → Condomínio
- 🏠 Node → Prédio
- 🛏️ Pod → Apartamento
- 📦 Container → Pessoa dentro do apartamento
- 📜 Deployment → Contrato dizendo quantos apartamentos precisam estar ocupados

O Deployment não é o prédio.  
Ele é o contrato que define quantos apartamentos devem existir.

---

# 🔁 Como o Kubernetes Funciona Mentalmente

Fluxo simplificado:

1️⃣ Declarando o estado desejado (YAML)  
2️⃣ O API Server recebe  
3️⃣ O Control Plane compara estado atual vs desejado  
4️⃣ O Scheduler decide onde rodar  
5️⃣ Os Worker Nodes executam  

Kubernetes é, essencialmente, um grande sistema de reconciliação de estado.