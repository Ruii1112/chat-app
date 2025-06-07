import { createRouter, createWebHistory } from 'vue-router'
import JoinView from './views/JoinView.vue'
import ChatView from './views/ChatView.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: JoinView },
        { path: '/chat', component: ChatView, props: true }
    ]
})