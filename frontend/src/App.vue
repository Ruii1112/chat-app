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

const socket = io('http://localhost:3000')
const messages = ref([])
const newMessage = ref('')

onMounted(() => {
  socket.on('chat message', (msg) => {
    messages.value.push(msg)
  })
})

function sendMessage() {
  if (newMessage.value.trim()) {
    socket.emit('chat message', newMessage.value)
    newMessage.value = ''
  }
}
</script>
