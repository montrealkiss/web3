<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card p-4 mb-4">
        <h2 class="mb-4 text-center">Скоротіть ваше посилання</h2>
        <form @submit.prevent="generateShortUrl">
          <div class="mb-3">
            <label for="fullUrl" class="form-label">Повне посилання</label>
            <input 
              type="url" 
              class="form-control" 
              id="fullUrl" 
              v-model="fullUrl"
              placeholder="https://example.com/your-long-url"
              required
            >
          </div>
          <div class="mb-3">
            <label for="shortUrl" class="form-label">Скорочене посилання</label>
            <input 
              type="text" 
              class="form-control" 
              id="shortUrl" 
              v-model="shortUrl"
              placeholder="https://cutt.ly/xyz123" 
              disabled
            >
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
            {{ isLoading ? 'Генерація...' : 'Генерувати скорочення' }}
          </button>
        </form>
      </div>

      <div class="card p-4">
        <h3 class="mb-3">Ваші посилання</h3>
        <div class="table-responsive">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Повне посилання</th>
                <th>Скорочене</th>
                <th style="min-width: 140px;">Дії</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(url, index) in userUrls" :key="url.id">
                <td>{{ index + 1 }}</td>
                <td class="text-break">{{ url.fullUrl }}</td>
                <td>
                  <a :href="url.shortUrl" target="_blank">{{ url.shortUrl }}</a>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <button 
                      class="btn btn-sm btn-outline-secondary"
                      @click="editUrl(url)"
                    >
                      Редагувати
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      @click="deleteUrl(url.id)"
                    >
                      Видалити
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
const fullUrl = ref('')
const shortUrl = ref('')
const userUrls = ref([])
const isLoading = ref(false)

const generateShortUrl = async () => {
  if (!fullUrl.value) return
  
  isLoading.value = true
  try {
    const response = await axios.post('/api/urls', {
      fullUrl: fullUrl.value
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    shortUrl.value = response.data.shortUrl
    await fetchUserUrls()
  } catch (error) {
    console.error('Error generating short URL:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchUserUrls = async () => {
  try {
    const response = await axios.get('/api/urls', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    userUrls.value = response.data
  } catch (error) {
    console.error('Error fetching URLs:', error)
  }
}

const editUrl = async (url) => {
  // Implement edit functionality
}

const deleteUrl = async (urlId) => {
  try {
    await axios.delete(`/api/urls/${urlId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    await fetchUserUrls()
  } catch (error) {
    console.error('Error deleting URL:', error)
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserUrls()
  }
})
</script> 