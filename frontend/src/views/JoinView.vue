<template>
  <div class="join">
    <h2>名前を入力して入室</h2>
    <input v-model="name" type="text" placeholder="名前を入力" />
    <button @click="enterChat">入室</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// 状態：名前入力
const name = ref('');
const router = useRouter();

// 入室処理
const enterChat = () => {
  const trimmedName = name.value.trim();
  if (!trimmedName) return;

  router.push({ path: 'chat', query: { name: trimmedName } });
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.join {
  width: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  font-family: sans-serif;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #45a049;
}
</style>