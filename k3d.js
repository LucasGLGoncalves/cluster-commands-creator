// k3d.js
let imagemIndex = 0;

function createImagemBlock(index) {
  return `
    <div class="imagem-entry border p-4 rounded bg-gray-50 space-y-4" data-index="${index}">
      <input name="imagem_${index}" placeholder="Imagem (ex: nginx:alpine)" class="w-full border p-2 rounded" required>
      <input name="port_${index}" placeholder="Container Port (ex: 80)" class="w-full border p-2 rounded">
      <select name="protocol_${index}" class="w-full border p-2 rounded">
        <option value="TCP">TCP</option>
        <option value="UDP">UDP</option>
        <option value="SCTP">SCTP</option>
      </select>
      <label class="inline-flex items-center">
        <input type="checkbox" name="interage_${index}" class="mr-2"> Interage com outras imagens
      </label>

      <div class="labelsContainer_${index} space-y-2">
        <input name="label_app_${index}" placeholder="Label app (ex: myapp)" class="w-full border p-2 rounded">
        <div class="flex gap-2">
          <input name="label_${index}[]" placeholder="Label chave=valor" class="w-full border p-2 rounded">
          <button type="button" class="remove-label text-red-500 text-sm">Remover</button>
        </div>
      </div>
      <button type="button" class="add-label bg-blue-200 px-2 py-1 rounded text-sm">+ Label</button>

      <div class="variaveisContainer_${index} space-y-2">
        <div class="flex gap-2">
          <input name="variaveis_${index}[]" placeholder="VAR=valor" class="w-full border p-2 rounded">
          <button type="button" class="remove-var text-red-500 text-sm">Remover</button>
        </div>
      </div>
      <button type="button" class="add-var bg-blue-200 px-2 py-1 rounded text-sm">+ Variável</button>

      <div>
        <label class="block font-semibold mt-2">Tipo de Service:</label>
        <select name="service_type_${index}" class="border p-2 w-full service-select">
          <option value="ClusterIP">ClusterIP</option>
          <option value="NodePort">NodePort</option>
          <option value="LoadBalancer">LoadBalancer</option>
        </select>
        <div class="service-fields hidden mt-2">
          <input name="targetPort_${index}" placeholder="Target Port" class="w-full border p-2 rounded mt-2">
          <input name="nodePort_${index}" placeholder="Node Port (somente NodePort)" class="w-full border p-2 rounded">
          <select name="service_protocol_${index}" class="w-full border p-2 rounded mt-2">
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="SCTP">SCTP</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

document.getElementById('addImagem').addEventListener('click', () => {
  const container = document.getElementById('imagensContainer');
  container.insertAdjacentHTML('beforeend', createImagemBlock(imagemIndex));
  imagemIndex++;
});

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('add-var')) {
    const container = e.target.previousElementSibling;
    const index = container.className.match(/variaveisContainer_(\d+)/)[1];
    const input = document.createElement('div');
    input.className = 'flex gap-2';
    input.innerHTML = `<input name="variaveis_${index}[]" placeholder="VAR=valor" class="w-full border p-2 rounded"><button type="button" class="remove-var text-red-500 text-sm">Remover</button>`;
    container.appendChild(input);
  }

  if (e.target.classList.contains('remove-var')) {
    e.target.parentElement.remove();
  }

  if (e.target.classList.contains('add-label')) {
    const container = e.target.previousElementSibling;
    const index = container.className.match(/labelsContainer_(\d+)/)[1];
    const input = document.createElement('div');
    input.className = 'flex gap-2';
    input.innerHTML = `<input name="label_${index}[]" placeholder="Label chave=valor" class="w-full border p-2 rounded"><button type="button" class="remove-label text-red-500 text-sm">Remover</button>`;
    container.appendChild(input);
  }

  if (e.target.classList.contains('remove-label')) {
    e.target.parentElement.remove();
  }
});

document.addEventListener('change', function(e) {
  if (e.target.classList.contains('service-select')) {
    const fields = e.target.parentElement.querySelector('.service-fields');
    fields.classList.toggle('hidden', e.target.value !== 'NodePort');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('k3dForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const nome = form.get('nome');
    const porta = form.get('porta');
    const servers = form.get('servers');
    const agents = form.get('agents');

    const clusterCmd = `1. Crie o cluster:\nk3d cluster create ${nome} --servers ${servers} --agents ${agents} -p "${porta}@loadbalancer"`;

    let yamlOutput = '', deployCount = 0;
    for (let i = 0; i < imagemIndex; i++) {
      const img = form.get(`imagem_${i}`);
      if (!img) continue;
      const labels = [`app: ${form.get(`label_app_${i}`) || `app${i}`}`];
      (form.getAll(`label_${i}[]`) || []).forEach(l => { if (l.includes('=')) labels.push(l.replace('=', ': ')); });

      const vars = form.getAll(`variaveis_${i}[]`).filter(v => v.includes('='));
      const containerPort = form.get(`port_${i}`);
      const protocol = form.get(`protocol_${i}`);
      const svcType = form.get(`service_type_${i}`);
      const targetPort = form.get(`targetPort_${i}`);
      const nodePort = form.get(`nodePort_${i}`);
      const svcProtocol = form.get(`service_protocol_${i}`);

      const deploy = `
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-${i}
spec:
  replicas: 1
  selector:
    matchLabels:
      ${labels.join('\n      ')}
  template:
    metadata:
      labels:
        ${labels.join('\n        ')}
    spec:
      containers:
        - name: container-${i}
          image: ${img}
          ${containerPort ? `ports:\n            - containerPort: ${containerPort}\n              protocol: ${protocol}` : ''}
          ${vars.length ? `env:\n${vars.map(v => {
            const [k, val] = v.split('=');
            return `            - name: ${k}\n              value: \"${val}\"`;
          }).join('\n')}` : ''}
---
apiVersion: v1
kind: Service
metadata:
  name: svc-${i}
spec:
  selector:
    ${labels.join('\n    ')}
  type: ${svcType}
  ports:
    - port: ${targetPort || 80}
      targetPort: ${targetPort || 80}
      ${svcType === 'NodePort' && nodePort ? `nodePort: ${nodePort}` : ''}
      protocol: ${svcProtocol || 'TCP'}
        `.trim();
      yamlOutput += `\n${deploy}\n`;
      deployCount++;
    }

    const final = `${clusterCmd}\n\n2. Crie os arquivos de deployment:\n${yamlOutput}\n3. Aplique:\nkubectl apply -f deployment.yml`;
    document.getElementById('outputComandos').textContent = final;
    document.getElementById('resultado').classList.remove('hidden');
  });
});