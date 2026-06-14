import axios from 'axios'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Добавляем токен к каждому запросу
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Перехватчик ответов
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Если 401 и это не запрос refresh и не запрос логина
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Не редиректим если мы уже на логине
            if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                return Promise.reject(error)
            }

            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (!refreshToken) {
                    throw new Error('No refresh token')
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
                    { refreshToken }
                )

                const { accessToken, refreshToken: newRefreshToken } = response.data

                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('refreshToken', newRefreshToken)

                originalRequest.headers.Authorization = `Bearer ${accessToken}`
                return apiClient(originalRequest)
            } catch (refreshError) {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')

                // Редиректим только если мы НЕ на публичных страницах
                const publicPages = ['/login', '/register', '/', '/home']
                if (!publicPages.includes(window.location.pathname)) {
                    window.location.href = '/login'
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient