<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card p-4">
        <h2 class="mb-4 text-center">Реєстрація</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="name" class="form-label">Ім'я</label>
            <input
              type="text"
              class="form-control"
              id="name"
              v-model="name"
              required
            >
          </div>
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
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Підтвердження паролю</label>
            <input
              type="password"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
              required
            >
          </div>
          <div class="alert alert-danger" v-if="error">
            {{ error }}
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? 'Реєстрація...' : 'Зареєструватися' }}
          </button>
        </form>
        <div class="mt-3 text-center">
          <router-link to="/login">Вже є акаунт? Увійти</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  error.value = ''
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Паролі не співпадають'
    return
  }

  isLoading.value = true

  try {
    const success = await authStore.register(email.value, password.value, name.value)
    if (success) {
      router.push('/')
    } else {
      error.value = 'Помилка реєстрації. Спробуйте ще раз.'
    }
  } catch (err) {
    error.value = 'Помилка реєстрації. Спробуйте ще раз.'
  } finally {
    isLoading.value = false
  }
}
</script> 