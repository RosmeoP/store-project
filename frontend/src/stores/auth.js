import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),

  actions: {
    async login(email, password) {
      try {
        const res = await axios.post('http://localhost:4000/api/auth/login', {
          email,
          password
        })

        this.token = res.data.token
        this.user = res.data.user
        localStorage.setItem('token', this.token)
        return true
      } catch (err) {
        throw err
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
