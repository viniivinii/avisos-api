const express = require('express');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const app = express();
const DB_FILE = 'avisos.json';

// Azure define a porta como variável de ambiente
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// Inicializa o arquivo de avisos, se não existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// Rota para receber avisos do Power Automate (POST)
app.post('/api/avisos', (req, res) => {
  const novoAviso = {
    autor: req.body.autor,
    pedido: req.body.pedido,
    mensagem: req.body.mensagem,
    criadoEm: new Date().toISOString()
  };

  const avisos = JSON.parse(fs.readFileSync(DB_FILE));
  avisos.unshift(novoAviso); // Adiciona no início
  fs.writeFileSync(DB_FILE, JSON.stringify(avisos));

  console.log("Aviso recebido:", novoAviso);
  res.status(201).send({ status: 'ok' });
});

// Rota para o telão buscar os avisos (GET)
app.get('/api/avisos', (req, res) => {
  const avisos = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(avisos.slice(0, 10));
});

// Rota para limpar os avisos (DELETE)
app.delete('/api/avisos', (req, res) => {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
  console.log("Todos os avisos foram apagados.");
  res.status(200).send({ status: 'apagado' });
});

// Iniciar servidor
if (IS_PROD) {
  // Em produção (ex: Azure), usa HTTP simples na porta fornecida
  http.createServer(app).listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
} else {
  // Em desenvolvimento, usa HTTPS com certificados do mkcert
  const options = {
    key: fs.readFileSync(path.join(__dirname, '10.10.2.94-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '10.10.2.94.pem'))
  };

  https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor HTTPS local rodando em https://localhost:${PORT}`);
  });
}