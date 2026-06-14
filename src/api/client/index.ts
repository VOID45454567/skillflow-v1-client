import axios from 'axios'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Добавляем токен к каждому запросу
// В client/index.ts
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Защита от бесконечного цикла refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem('refreshToken')
                if (!refreshToken) {
                    // Не редиректим, просто выбрасываем ошибку
                    localStorage.clear()
                    return Promise.reject(error)
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
                localStorage.clear()
                // РЕДИРЕКТ ТОЛЬКО ЕСЛИ МЫ НЕ НА ЛОГИНЕ
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)
