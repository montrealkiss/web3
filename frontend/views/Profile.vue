<template>
  <div class="row justify-content-center">
    <div class="col-md-8 col-lg-6">
      <div class="card p-4">
        <h2 class="mb-4 text-center">Профіль користувача</h2>
        
        <div v-if="user" class="mb-4">
          <div class="mb-3">
            <label class="form-label">Ім'я</label>
            <input
              type="text"
              class="form-control"
              v-model="user.name"
              :disabled="!isEditing"
            >
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              v-model="user.email"
              disabled
            >
          </div>
          
          <div v-if="isEditing" class="mb-3">
            <label class="form-label">Новий пароль</label>
            <input
              type="password"
              class="form-control"
              v-model="newPassword"
              placeholder="Залиште порожнім, щоб не змінювати"
            >
          </div>
          
          <div v-if="isEditing" class="mb-3">
            <label class="form-label">Підтвердження нового паролю</label>
            <input
              type="password"
              class="form-control"
              v-model="confirmPassword"
              placeholder="Залиште порожнім, щоб не змінювати"
            >
          </div>

          <div class="alert alert-danger" v-if="error">
            {{ error }}
          </div>

          <div class="d-flex gap-2">
            <button 
              v-if="!isEditing"
              class="btn btn-primary"
              @click="startEditing"
            >
              Редагувати
            </button>
            <template v-else>
              <button 
                class="btn btn-success"
                @click="saveChanges"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Збереження...' : 'Зберегти' }}
              </button>
              <button 
                class="btn btn-secondary"
                @click="cancelEditing"
                :disabled="isLoading"
              >
                Скасувати
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const user = ref(null)
const isEditing = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

const startEditing = () => {
  isEditing.value = true
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = ''
}

const cancelEditing = () => {
  isEditing.value = false
  user.value = { ...authStore.user }
  error.value = ''
}

const saveChanges = async () => {
  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    error.value = 'Паролі не співпадають'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await axios.put('/api/user', {
      name: user.value.name,
      password: newPassword.value || undefined
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    authStore.user = response.data
    isEditing.value = false
  } catch (err) {
    error.value = 'Помилка збереження змін'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await authStore.fetchUser()
    user.value = { ...authStore.user }
  }
})
</script> 