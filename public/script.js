const container = document.getElementById("aviso-container");
const timerEl = document.getElementById("timer");
let avisos = [], indice = 0, tempo = 10;

function atualizarRelogio() {
  const now = new Date().toLocaleTimeString("pt-BR", { 
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit"
  });
  document.getElementById("clock").textContent = now;
}
setInterval(atualizarRelogio, 1000);

function atualizarTimer(t) {
  timerEl.textContent = `Próximo em: ${t}s`;
}

async function carregarAvisos() {
  try {
    const res = await fetch("https://avisos-api-7oz5.onrender.com/api/avisos");
    avisos = await res.json();

    console.log("Avisos recebidos:", avisos); // DEBUG

    if (!avisos.length) {
      container.innerHTML = "<p>Nenhum aviso.</p>";
      return;
    }
    exibirAviso();
  } catch (erro) {
    console.error("Erro ao carregar avisos:", erro);
    container.innerHTML = "<p>Erro ao carregar avisos.</p>";
  }
}

function exibirAviso() {
  const aviso = avisos[indice];
  const tempoAviso = aviso.status === 'alto' ? 72 :
  aviso.status === 'medio' ? 48 : 24;

  const criado = new Date(aviso.criadoEm).getTime();
  const agora = Date.now();
  const totalMs = tempoAviso * 3600 * 1000;
  const restanteMs = Math.max(totalMs - (agora - criado), 0);
  const restantePerc = (restanteMs / totalMs) * 100;

  document.querySelector("circle.tempo").setAttribute("stroke-dashoffset", (100 - restantePerc));

  // exibição do aviso
  container.innerHTML = `<div class="aviso">
    <div class="autor">${aviso.autor || "Sem autor"} - Pedido: ${aviso.pedido || "N/A"}</div>
    <div class="mensagem">${aviso.mensagem || "Mensagem vazia"}</div>
  </div>`;

  let t = tempo;
  atualizarTimer(t);
  const int = setInterval(() => {
    t--;
    atualizarTimer(t);
    if (t <= 0) {
      clearInterval(int);
      indice = (indice + 1) % avisos.length;
      exibirAviso();
    }
  }, 1000);
}



carregarAvisos();