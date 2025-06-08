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
import { ref, onMounted, watch, nextTick } from 'vue'
import { io } from 'socket.io-client'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const name = route.query.name || '匿名'

const socket = io('http://localhost:3000')
const messages = ref([])
const input = ref('')
const users = ref([])
const chatWindow = ref(null)

onMounted(() => {
    socket.emit('join', name);

    socket.on('chat message', (msg) => {
        messages.value.push(msg)
    });

    socket.on('user list', (list) => {
        users.value = list;
    });
})

watch(() => messages.value.length, async () => {
    await nextTick();
    if (chatWindow.value) {
        chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
    }
})

const sendMessage = () => {
    if (input.value.trim()) {
        socket.emit('chat message', { sender: name, text: input.value })
        input.value = ''
    }
}

const exitChat = () => {
    socket.disconnect();
    router.push('/')
}
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