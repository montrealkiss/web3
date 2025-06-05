<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light mb-4">
      <div class="container">
        <router-link class="navbar-brand" to="/">Скороченя посилання</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/' }" to="/">Головна</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/register' }" to="/register">Реєстрація</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/login' }" to="/login">Вхід</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/profile' }" to="/profile">Профіль</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.path === '/about' }" to="/about">Про додаток</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">Вихід</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mb-5">
      <router-view></router-view>
    </main>

    <footer>
      <div class="container">
        &copy; 2025 Мій Додаток. Всі права захищено.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
footer {
  padding: 1rem 0;
  text-align: center;
  background-color: #f8f9fa;
  margin-top: 2rem;
}
</style> 