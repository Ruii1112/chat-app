<template>
  <div class="chat">
    <div class="chat-window">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { io } from 'socket.io-client'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const name = route.query.name || '匿名'

const socket = io('http://localhost:3000')
const messages = ref([])
const input = ref('')

onMounted(() => {
  socket.on('chat message', (msg) => {
    messages.value.push(msg)
  })
})

const sendMessage = () => {
  if (input.value.trim()) {
    socket.emit('chat message', { sender: name, text: input.value })
    input.value = ''
  }
}

const exitChat = () => {
  router.push('/')
}
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  font-family: sans-serif;
}

.chat-window {
  flex: 1;
  max-height: 80vh;
  overflow-y: auto;
  margin-bottom: 1rem;
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
  display: flex;
  gap: 10px;
  align-items: center;
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
  background-color: #4caf50;
  color: white;
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