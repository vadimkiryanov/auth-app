import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { LoginData } from '../types/auth'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/auth/useAuthStore'

export default function Login() {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const loginAuth = useAuthStore((state) => state.login)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authApi.signIn(formData)
      if (response.ok) {
        // alert('Вход успешен!')
        const data = await response.json()
        console.log(data)
        loginAuth({name: data.username, token: data.token})
        navigate('/')
      } else {
        setError('Неверный логин или пароль')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Вход</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Логин</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 text-black  border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Введите логин"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Введите пароль"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Нет аккаунта?{' '}
        <Link to="/registration" className="font-semibold text-blue-600 hover:text-blue-700">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  )
}
