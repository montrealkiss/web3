<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card p-4">
        <h2 class="mb-4 text-center">Вхід</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="email"
              required
            >
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Пароль</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="password"
              required
            >
          </div>
          <div class="alert alert-danger" v-if="error">
            {{ error }}
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? 'Вхід...' : 'Увійти' }}
          </button>
        </form>
        <div class="mt-3 text-center">
          <router-link to="/register">Немає акаунту? Зареєструватися</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      router.push('/')
    } else {
      error.value = 'Невірний email або пароль'
    }
  } catch (err) {
    error.value = 'Помилка входу. Спробуйте ще раз.'
  } finally {
    isLoading.value = false
  }
}
</script> 