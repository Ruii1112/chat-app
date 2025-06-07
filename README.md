# リアルタイムチャットアプリ

## 概要
このプロジェクトは、Node.js（Express） + Socket.IO + Vue 3（Vite） を使用して、リアルタイムにチャットできるアプリケーションを構築するためのチュートリアルです。

主な構成：
- バックエンド: Node.js + Express + Socket.IO
- フロントエンド: Vue 3 + Vite + Socket.IO-client
- 機能: WebSocket を使ったリアルタイムチャット（全員にブロードキャスト）

## 前提条件
このプロジェクトを動かすには、以下がインストールされている必要があります。

### Node.js（npm 含む）の確認
```bash
node -v
npm -v
```

出力例（バージョンは異なってもOK）
```bash
v22.14.0
10.9.2
```

### 入っていない場合は公式サイトからインストール
[Node.js 公式サイト](https://nodejs.org/ja/)より「LTS（推奨）」バージョンをダウンロードしてください。  
Macの場合はHomebrewでもインストール可能です。

## ディレクトリ構成
```bash
chat-app/
├── backend/       # Node.js + Socket.IO サーバー
│   └── index.js
└── frontend/      # Vue + Vite フロントエンド
    ├── src/
    │   └── App.vue
    └── vite.config.js
```

## セットアップ手順
1. ルートフォルダ作成
```bash
mkdir chat-app
cd chat-app
```

2. バックエンド作成（Node.js + Express + Socket.IO）
```bash
mkdir backend
cd backend
npm init -y
npm install express socket.io cors
```

`backend/index.js`を作成
```js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors()); // フロントエンドとの通信を許可

const server = http.createServer(app);

// Socket.IO サーバー作成
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // フロントエンドURL
    methods: ["GET", "POST"]
  }
});

// クライアント接続処理
io.on('connection', (socket) => {
  console.log('ユーザー接続:', socket.id);

  // チャットメッセージ受信→全員に送信
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // 切断ログ
  socket.on('disconnect', () => {
    console.log('ユーザー切断:', socket.id);
  });
});

// サーバー起動
server.listen(3000, () => {
  console.log('サーバー起動: http://localhost:3000');
});
```

3. フロントエンド作成（Vue 3 + Vite）
```bash
cd ../
npm create vite@latest frontend
# ✔ Project name: frontend
# ✔ Select a framework: Vue
# ✔ Select a variant: JavaScript
cd frontend
npm install
npm install socket.io-client
npm install vue-router
```

`frontend/src/App.vue`を編集

```vue
<template>
  <div style="max-width: 600px; margin: auto;">
    <h1>🗨️ チャットアプリ</h1>
    <ul>
      <li v-for="(msg, i) in messages" :key="i">{{ msg }}</li>
    </ul>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="メッセージを入力"
      style="width: 100%; padding: 8px;"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'

// Socket.IO クライアントを初期化
const socket = io('http://localhost:3000')

const messages = ref([])      // 受信したメッセージ一覧
const newMessage = ref('')    // 入力中のメッセージ

// 接続時に、メッセージ受信イベントを監視
onMounted(() => {
  socket.on('chat message', (msg) => {
    messages.value.push(msg)
  })
})

// メッセージ送信
function sendMessage() {
  if (newMessage.value.trim()) {
    socket.emit('chat message', newMessage.value)
    newMessage.value = ''
  }
}
</script>
```

## アプリの起動
### バックエンド（サーバー）起動
```bash
cd chat-app/backend
node index.js
```
→ `http://localhost:3000`にてWebSocketサーバーが起動します。

### フロントエンド（Vue アプリ）起動
```bash
cd chat-app/frontend
npm run dev
```
→ ブラウザで`http://localhost:5173`にアクセス

### 起動確認
- 複数のタブ・ブラウザで同じページを開くと、リアルタイムでメッセージが同期されます。
- メッセージ入力 → Enterキーで送信 → 全員に表示