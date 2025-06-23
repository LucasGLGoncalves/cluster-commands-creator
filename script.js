function gerarComandoK3D(dados) {
  const { nome, servers, agents, porta } = dados;
  return `k3d cluster create ${nome} --servers ${servers} --agents ${agents} -p "${porta}@loadbalancer"`;
}

function gerarComandoKind(dados) {
  return `kind create cluster --name ${dados.nome} --config kind-config.yaml`;
}

function gerarYamlKind(dados) {
  return `
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
${'  - role: control-plane\n'.repeat(dados.servers)}${'  - role: worker\n'.repeat(dados.agents)}
`;
}

function gerarComandoKubeadm(dados) {
  return `kubeadm init --pod-network-cidr=${dados.podNetwork}`;
}