# 📢 Avisos API

Esta API foi desenvolvida para receber mensagens enviadas automaticamente por um fluxo do Power Automate e exibi-las em um painel (telão) com HTTPS local. Ela utiliza Node.js, Express e arquivos JSON como banco de dados local. Ideal para ambientes internos onde o uso de autenticação pesada ou bancos de dados externos não é necessário.

---

## 🚀 Funcionalidades

- Recebe avisos via requisição `POST` (Power Automate ou outros).
- Exibe os 10 avisos mais recentes via `GET` (para o telão).
- Permite apagar todos os avisos via `DELETE`.
- Utiliza HTTPS com certificados locais (`mkcert`).
- Pode ser exposta para fora via `ngrok` ou hospedada remotamente.

---

## 🔧 Tecnologias Utilizadas

- Node.js
- Express
- HTTPS (certificados locais com `mkcert`)
- JSON como banco de dados simples
- PM2 (opcional) para manter o servidor ativo

---

## 📦 Endpoints da API

### `POST /api/avisos`

Cria um novo aviso.

#### Exemplo de corpo da requisição:
```json
{
  "autor": "Vinicius",
  "pedido": "123",
  "mensagem": "Aviso importante!"
}

