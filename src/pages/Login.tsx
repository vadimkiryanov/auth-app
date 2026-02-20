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
    <div className="bg-neutral-800 backdrop-blur-xl rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">Вход</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Логин</label>
          <input
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-100 bg-neutral-700 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all"
            placeholder="Введите логин"
            required
            minLength={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full text-gray-100 px-4 py-3 bg-neutral-700 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all"
            placeholder="Введите пароль"
            required
            minLength={6}
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-neutral-600 to-neutral-700 text-white py-3 px-4 rounded-xl font-semibold text-lg shadow-lg hover:from-neutral-500 hover:to-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Нет аккаунта?{' '}
        <Link to="/registration" className="font-semibold text-neutral-400 hover:text-neutral-300">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  )
}
