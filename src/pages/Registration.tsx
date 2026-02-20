import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { RegistrationData } from '../types/auth'
import { authApi } from '../api/auth'
import { toast } from 'sonner';

export default function Registration() {
  const [formData, setFormData] = useState<RegistrationData>({
    username: 'test@name.com',
    password: 'test@name.com',
    name: 'test name'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      const response = await authApi.signUp(formData)
      if (response.ok) {
        toast.success('Регистрация успешна!');
        // Redirect to login page after successful registration
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      } else {
        setError('Ошибка регистрации')
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
      <h1 className="text-3xl font-bold text-gray-100 mb-8 text-center">Регистрация</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 text-gray-100 bg-neutral-700 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all"
            placeholder="Введите имя"
            required
          />
        </div>

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
            className="w-full px-4 text-gray-100 py-3 bg-neutral-700 rounded-xl focus:ring-2 focus:ring-neutral-500 focus:border-transparent transition-all"
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
          {loading ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-semibold text-neutral-400 hover:text-neutral-300">
          Войти
        </Link>
      </p>
    </div>
  )
}
