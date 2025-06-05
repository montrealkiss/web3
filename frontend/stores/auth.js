import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(email, password) {
      try {
        const response = await axios.post('/api/login', { email, password })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },

    async register(email, password, name) {
      try {
        const response = await axios.post('/api/register', { email, password, name })
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        return true
      } catch (error) {
        console.error('Registration error:', error)
        return false
      }
    },

    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },

    async fetchUser() {
      if (!this.token) return

      try {
        const response = await axios.get('/api/user', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
        this.user = response.data
      } catch (error) {
        console.error('Fetch user error:', error)
        this.logout()
      }
    }
  }
}) 