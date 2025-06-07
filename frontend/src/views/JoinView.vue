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

const name = ref('');
const router = useRouter();

const enterChat = () => {
    if (name.value.trim()) {
        router.push({ path: 'chat', query: { name: name.value } });
    }
}
</script>

<style scoped>
.join {
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
    width: 250px;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
}

button {
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