## 📘 Gerador de Clusters Kubernetes com Interface Web

### 🔍 Sobre o Projeto

Este é um **projeto simples e inicial**, criado com o objetivo de ajudar estudantes que estão começando a aprender Kubernetes e têm dificuldade em lembrar os comandos corretos para criação de clusters locais. Ele facilita o uso de ferramentas como:

- **K3D** (mais avançado até o momento)
- **KIND** (em construção)
- **Kubeadm** (em construção)

A interface permite preencher formulários e gerar automaticamente:

- Comandos de terminal passo a passo
- Arquivos YAML de deployments e services

> ⚠️ Este projeto está em desenvolvimento. Apenas a interface do **K3D** está parcialmente funcional. As interfaces para KIND e Kubeadm ainda não foram implementadas.

---

### 🧰 Funcionalidades atuais

- Formulário dinâmico para múltiplas imagens
- Variáveis de ambiente por container
- Labels personalizadas por container
- Tipos de service (ClusterIP, NodePort, LoadBalancer)
- Geração de comandos `k3d` e arquivos `deployment.yml`

---

### 🚀 Como usar

1. Clone o repositório:
2. Abra o arquivo `index.html` no seu navegador.
3. Clique no card do K3D (único com formulário funcional).
4. Preencha as informações do cluster e dos containers.
5. Clique em "Gerar comandos".
6. Copie e cole os comandos e YAMLs no seu terminal para estudar Kubernetes localmente.

---

### 🌱 Por que esse projeto existe?

Ao iniciar os estudos com Kubernetes, é comum esquecer os comandos certos para criar clusters locais ou configurar arquivos YAML. Esta ferramenta foi feita para tornar esse processo mais visual, simples e direto, sem depender de copiar tutoriais toda vez.

---

### 👨‍💻 Autor

Este projeto foi criado por **Lucas Gonçalves** como parte de seus estudos em DevOps e Kubernetes. Ele está sendo mantido com foco em **facilitar o aprendizado de iniciantes**.

Se você também está aprendendo, sinta-se à vontade para usar, clonar, contribuir ou adaptar.

---

### 📌 Aviso

Este projeto **não é destinado a uso em produção**. Ele é voltado exclusivamente para fins de aprendizado e prática local de comandos e estruturas YAML básicas.

---

### 🌐 GitHub Pages

