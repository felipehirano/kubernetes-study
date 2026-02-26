# 🔄 Rollout e Revisões no Kubernetes

Quando utilizamos **Deployment**, ganhamos uma funcionalidade extremamente importante:

```
Versionamento + Rollback
```

Mas e se algo der errado após um deploy?

Exemplo:

- Nova versão contém bug
- Aplicação começa a falhar
- Erro em produção

O Kubernetes permite voltar para uma versão anterior facilmente.

---

# 📜 Histórico de Deploy (Rollout History)

Para visualizar o histórico de versões de um Deployment:

```bash
kubectl rollout history deployment NOME_DO_DEPLOYMENT
```

Caso não saiba o nome do Deployment:

```bash
kubectl get deployments
```

Exemplo de saída:

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
nodeserver   2/2     2            2           10m
```

Agora verificando o histórico:

```bash
kubectl rollout history deployment nodeserver
```

---

# 📊 Exemplo de Tabela de Revisões

Saída simulada:

```
deployment.apps/nodeserver
REVISION  CHANGE-CAUSE
1         Initial deployment (v1)
2         Update image to v2
3         Update image to v3
```

Cada número representa uma revisão do Deployment.

---

# 🔙 Fazendo Rollback (Voltando Versão)

## ✅ Voltar para a versão anterior

```bash
kubectl rollout undo deployment nodeserver
```

Isso volta automaticamente para a revisão anterior.

---

## 🎯 Voltar para uma revisão específica

```bash
kubectl rollout undo deployment nodeserver --to-revision=1
```

Isso força o Deployment a voltar para a revisão 1.

---

# 🧠 O Que Acontece Internamente?

Quando você executa o rollback:

1️⃣ O Deployment cria um novo ReplicaSet baseado na revisão escolhida  
2️⃣ Reduz o ReplicaSet atual  
3️⃣ Escala o ReplicaSet antigo novamente  
4️⃣ Atualiza os Pods gradualmente  

Isso também acontece como Rolling Update.

---

# 🔎 Verificando se o Rollback Funcionou

## 1️⃣ Verifique os Pods

```bash
kubectl get pods
```

---

## 2️⃣ Verifique a imagem do container

```bash
kubectl describe pod NOME_DO_POD
```

Procure pela seção:

```
Containers:
  nodeserver:
    Image: felipeken/node-k8s:v1
```

Se estiver mostrando a versão antiga, o rollback funcionou.

---

## 3️⃣ Verifique os ReplicaSets

```bash
kubectl get replicasets
```

Exemplo antes do rollback:

```
nodeserver-abc123   0   0   0
nodeserver-def456   2   2   2
```

Após rollback:

```
nodeserver-abc123   2   2   2
nodeserver-def456   0   0   0
```

O ReplicaSet antigo volta a ser utilizado.

---

# 🔍 Inspecionando o Deployment

Você também pode inspecionar o Deployment completo:

```bash
kubectl describe deployment NOME_DO_DEPLOYMENT
```

Esse comando mostra:

- Estratégia de atualização
- Número de réplicas desejadas
- Eventos recentes
- Histórico de scaling
- Status do rollout
- ReplicaSets associados

É extremamente útil para troubleshooting.

---

# 🧠 Fluxo Mental Completo

```
Deploy v1
      ↓
Deploy v2
      ↓
Deploy v3 (com erro)
      ↓
Detecta problema
      ↓
kubectl rollout undo
      ↓
ReplicaSet anterior volta
      ↓
Pods recriados com versão antiga
```

---

# ⚡ Comandos Importantes de Rollout

Ver histórico:

```bash
kubectl rollout history deployment nodeserver
```

Desfazer última alteração:

```bash
kubectl rollout undo deployment nodeserver
```

Desfazer para revisão específica:

```bash
kubectl rollout undo deployment nodeserver --to-revision=1
```

Ver status do rollout:

```bash
kubectl rollout status deployment nodeserver
```

Descrever deployment:

```bash
kubectl describe deployment nodeserver
```

---

# 🎯 Por que isso é tão poderoso?

Porque permite:

- Atualizações seguras
- Rollback rápido
- Zero downtime
- Histórico de versões
- Controle total do ciclo de vida da aplicação

---

# 📌 Conclusão

O Deployment não apenas:

- Cria ReplicaSets
- Gerencia Pods
- Faz Rolling Update

Ele também:

```
Mantém histórico
Permite rollback
Garante segurança em produção
```

Essa é uma das funcionalidades mais importantes do Kubernetes em ambientes reais.