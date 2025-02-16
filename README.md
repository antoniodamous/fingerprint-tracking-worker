# Desafio Técnico - Cloudflare Worker com D1

## 📌 Objetivo do Desafio

Criar um Cloudflare Worker em JavaScript que capture fingerprints de sites e os armazene no Cloudflare D1. Além disso, deve fornecer uma rota autenticada para visualizar os acessos.

---

## 🛠 Configuração do Ambiente

### **1️⃣ Criar uma Conta no Cloudflare (Gratuito)**
Acesse **[https://dash.cloudflare.com/](https://dash.cloudflare.com/)**

### **2️⃣ Criando um Worker**
1. Vá até **Compute (Workers)** → **Workers & Pages** → **Create** → **Workers** → **Create Worker**
2. Insira o nome do Worker e substitua pelo código abaixo.
3. Clique em **"Save and Deploy"**.

### 2️⃣ Instalar Wrangler (CLI do Cloudflare Workers)

O Wrangler é uma ferramenta de linha de comando usada para desenvolver e gerenciar Cloudflare Workers.

1. Instale o Wrangler globalmente:
   ```
   $ npm install -g wrangler
   ```
2. Faça login no Cloudflare via Wrangler:
   ```
   $ wrangler login
   ```

### 3️⃣ Criar um Banco de Dados D1

1. No painel do Cloudflare, vá até **Workers & Pages** > **D1**.
2. Crie um novo banco de dados D1 e copie o nome para uso posterior.
3. No terminal, execute:
   ```
   $ wrangler d1 create nome-do-seu-banco
   ```
4. Para verificar a conexão:
   ```
   $ wrangler d1 list
   ```

---

## 📂 Estrutura do Projeto

```
/desafio-fingerprint/
├── wrangler.toml
├── src/
│   ├── index.js        # Código principal do Worker
│   ├── fingerprint.js  # Script enviado ao navegador
│   ├── db.js           # Funções de banco de dados D1
│   ├── auth.js         # Lógica de autenticação
├── package.json
└── README.md
```

---

## 📝 Arquivos do Projeto

### 📄 `wrangler.toml`

```toml
name = "desafio-fingerprint"
type = "javascript"
account_id = "SEU_ACCOUNT_ID"
workers_dev = true
compatibility_date = "2024-02-15"
[vars]
SECRET_KEY = "sua-chave-secreta"
[d1_databases]
DB = { binding = "DB", database_name = "nome-do-seu-banco", database_id = "SEU_DATABASE_ID" }
```

### 📄 `index.js`

```js
import { handleFingerprintScript } from "./fingerprint";
import { handleCollect } from "./db";
import { handleView } from "./auth";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            return handleOptions(request);
        }

        if (url.pathname === "/fingerprint.js") {
            return handleFingerprintScript();
        }

        if (url.pathname === "/collect") {
            return handleCollect(request, env);
        }

        if (url.pathname === "/view") {
            return handleView(request, env);
        }

        return new Response("Rota não encontrada", { status: 404 });
    }
};
```

### 📄 `fingerprint.js`

```js
export async function handleFingerprintScript() {
    const script = `
        (async () => {
            const fingerprintData = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screen: { width: screen.width, height: screen.height },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory || 'unknown'
            };
            await fetch('/collect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fingerprintData)
            });
        })();
    `;
    return new Response(script, {
        headers: { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*' }
    });
};
```

### 📄 `db.js`

```js
export async function handleCollect(request, env) {
    if (request.method !== 'POST') {
        return new Response('Método não permitido', { status: 405 });
    }
    const data = await request.json();
    await env.DB.prepare('INSERT INTO fingerprints (data) VALUES (?)').bind(JSON.stringify(data)).run();
    return new Response('Fingerprint salvo', { status: 200 });
};
```

### 📄 `auth.js`

```js
export async function handleView(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${env.SECRET_KEY}`) {
        return new Response('Não autorizado', { status: 401 });
    }
    const { results } = await env.DB.prepare('SELECT * FROM fingerprints').all();
    return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
    });
};
```

### 📄 `package.json`

```json
{
  "name": "desafio-fingerprint",
  "version": "1.0.0",
  "description": "Cloudflare Worker para captura de fingerprints",
  "main": "index.js",
  "scripts": {
    "start": "wrangler dev",
    "deploy": "wrangler publish"
  },
  "dependencies": {},
  "devDependencies": {}
};
```

---

## ✅ Testes e Deploy

### 1️⃣ Rodar localmente

```
$ wrangler dev
```

### 2️⃣ Fazer deploy no Cloudflare

```
$ wrangler publish
```

### 3️⃣ Verificar logs

```
$ wrangler tail
```

## 🙇🏻‍♂️ Apredizado
- Documentação Cloudflare - https://developers.cloudflare.com/
- Documentação Javascript - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
- DOM - https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model

## 🔗 Links

<p align="center">
 
 <a href="https://www.linkedin.com/in/antoniodamous" alt="Linkedin">
  <img src="https://img.shields.io/badge/-Linkedin-0A66C2?style=for-the-badge&logo=Linkedin&logoColor=FFFFFF&link=https://www.linkedin.com/in/antoniodamous"/> 
 </a>

 </p>
 
## 💻 Autor<br>

<center>
      <a href="https://github.com/antoniodamous"> <center>
       <p align="center"><img src="https://github.com/antoniodamous.png" width="100px;" />
        </a> </p>

<h3 align="center"> Developed by <a href="https://www.linkedin.com/in/antoniodamous/">Antônio Damous</a> and <a href="https://cloudflare.com/">Cloudflare</a> 🥋</h3>



---
