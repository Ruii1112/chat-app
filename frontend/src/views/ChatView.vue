<template>
  <div class="chat">
    <div class="main-content">
      <div class="user-list">
        <h3>入室者</h3>
        <ul>
          <li v-for="(user, i) in users" :key="i">{{ user }}</li>
        </ul>
      </div>

      <div class="chat-section">
        <div class="chat-window" ref="chatWindow">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            :class="['message', msg.sender === name ? 'me' : 'other']"
          >
            <span class="sender">{{ msg.sender }}</span>
            <div class="bubble">{{ msg.text }}</div>
          </div>
        </div>
        <div class="chat-controls">
          <input v-model="input" @keyup.enter="sendMessage" placeholder="メッセージを入力" />
          <button @click="sendMessage">送信</button>
          <button @click="exitChat">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { io } from 'socket.io-client';
import { useRoute, useRouter } from 'vue-router';

// ルーティング情報
const route = useRoute();
const router = useRouter();
const name = route.query.name || '匿名';

// Socket.IO接続
const socket = io('http://localhost:3000');

// 状態定義
const messages = ref([]);
const input = ref('');
const users = ref([]);
const chatWindow = ref(null);

// チャットに入室する処理
const joinChat = () => {
  socket.emit('join', name);

  socket.on('chat message', receiveMessage);
  socket.on('user list', updateUserList);
};

// メッセージ受信時の処理
const receiveMessage = (msg) => {
  messages.value.push(msg);
};

// ユーザーリスト更新
const updateUserList = (list) => {
  users.value = list;
};

// スクロールを最下部へ移動
const scrollToBottom = async () => {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

// メッセージ送信処理
const sendMessage = () => {
  const text = input.value.trim();
  if (!text) return;

  socket.emit('chat message', { sender: name, text });
  input.value = '';
};

// チャットから退出する処理
const exitChat = () => {
  socket.disconnect();
  router.push('/');
};

// 初期処理
onMounted(joinChat);

// メッセージ数が変わったらスクロール
watch(() => messages.value.length, scrollToBottom);
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

.chat {
  display: flex;
  justify-content: center;
  padding: 20px;
  font-family: sans-serif;
}

.main-content {
  display: flex;
  flex-direction: row;
  gap: 100px;
}

.user-list {
  width: 200px;
  background: #eee;
  padding: 10px;
  border-radius: 8px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.user-list ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.chat-section {
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 0;
  padding-bottom: 10px;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.message.me {
  align-items: flex-end;
}

.message.other {
  align-items: flex-start;
}

.bubble {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  margin-top: 2px;
}

.message.me .bubble {
  background-color: #d4f9c2;
}

.message.other .bubble {
  background-color: #ffffff;
}

.sender {
  font-size: 0.75rem;
  color: gray;
}

.chat-controls {
  flex-shrink: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
}

.chat-controls input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.chat-controls button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chat-controls button:first-of-type {
  background-color: #4caf50;
  color: white;
}

.chat-controls button:first-of-type:hover {
  background-color: #45a049;
}

.chat-controls button:last-of-type {
  background-color: #f44336;
  color: white;
}

.chat-controls button:last-of-type:hover {
  background-color: #d32f2f;
}

</style>