# ⚠️ Limitações do ReplicaSet (Por que ele não é ideal para updates)

Até agora entendemos que o ReplicaSet:

- ✅ Garante número fixo de Pods
- ✅ Recria Pods se algum morrer
- ✅ Permite escalabilidade horizontal

Mas existe um problema importante.

---

# 🧨 Problema: Atualização de Versão da Aplicação

Imagine o seguinte cenário:

Você possui um ReplicaSet rodando:

```
felipeken/node-k8s:v1
```

Agora você:

1️⃣ Gera uma nova imagem Docker  
2️⃣ Publica a nova versão  

```
felipeken/node-k8s:v2
```

3️⃣ Atualiza o `replica-set.yaml` trocando a imagem para `v2`  
4️⃣ Executa:

```bash
kubectl apply -f replica-set.yaml
```

---

# 😨 O que acontece?

Nada.

Os Pods continuam rodando a versão antiga (`v1`).

---

# 🧠 Por que isso acontece?

O ReplicaSet NÃO foi projetado para gerenciar versionamento.

Ele apenas garante:

```
Quantidade de Pods == replicas
```

Ele não monitora mudanças na imagem do container.

Se os Pods já estão rodando e o número de réplicas está correto, ele considera que o estado desejado já foi atingido.

---

# 🔍 Exemplo Prático do Problema

## 🎯 Situação Atual

```yaml
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: nodeserver
          image: felipeken/node-k8s:v1
```

Resultado:

```
Pod A → v1
Pod B → v1
```

---

## 🚀 Atualizando para v2

Você altera para:

```yaml
image: felipeken/node-k8s:v2
```

E roda:

```bash
kubectl apply -f replica-set.yaml
```

### ❌ Resultado

Nada muda.

Os Pods continuam rodando `v1`.

Porque:

- O ReplicaSet não recria Pods automaticamente só porque a imagem mudou.
- Ele só recria se o número de réplicas estiver diferente.

---

# 🔥 Por que isso é "ruim"?

## 1️⃣ Sem Atualização Automática

Você precisa:

- Deletar manualmente os Pods
- Ou deletar o ReplicaSet inteiro
- Ou criar outro ReplicaSet

Isso pode causar:

- Downtime
- Perda temporária de disponibilidade

---

## 2️⃣ Sem Rolling Update

ReplicaSet não faz:

- Atualização gradual
- Substituição controlada
- Estratégia zero downtime

Ele simplesmente mantém a quantidade.

---

## 3️⃣ Risco de Conflito

Se você criar um novo ReplicaSet com a nova imagem:

Você pode ter:

```
ReplicaSet v1 → 2 Pods
ReplicaSet v2 → 2 Pods
```

Agora você tem 4 Pods rodando.

Isso pode:

- Consumir mais recursos
- Gerar inconsistência
- Criar comportamento inesperado

---

# 💥 Cenário Real Problemático

Imagine em produção:

- 10 Pods rodando v1
- Você atualiza para v2
- ReplicaSet não faz nada
- Usuários continuam usando versão antiga

Ou pior:

Você deleta todos os Pods manualmente ao mesmo tempo:

```
Downtime total da aplicação
```

---

# 🧠 Por que o ReplicaSet é limitado?

Porque ele foi criado apenas para:

```
Manter número fixo de réplicas
```

Ele NÃO foi criado para:

- Versionamento
- Estratégia de rollout
- Atualização controlada

---

# 🚀 Como Resolver Esse Problema?

Existem duas abordagens:

## ❌ 1️⃣ Criar novo ReplicaSet manualmente

Funciona, mas é trabalhoso e arriscado.

---

## ✅ 2️⃣ Usar Deployment (Forma Correta)

O Deployment:

- Cria ReplicaSets automaticamente
- Controla versionamento
- Faz Rolling Updates
- Permite rollback
- Garante zero downtime

Ele resolve exatamente o problema que o ReplicaSet não resolve.

---

# 📊 Comparação Final

| ReplicaSet | Deployment |
|------------|------------|
| Garante réplicas | Garante réplicas |
| Autocura | Autocura |
| ❌ Não faz versionamento | ✅ Faz versionamento |
| ❌ Não faz rolling update | ✅ Faz rolling update |
| ❌ Sem rollback | ✅ Possui rollback |