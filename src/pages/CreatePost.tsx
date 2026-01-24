// src/pages/CreatePost.tsx
import { useState, type FormEvent } from 'react'
import { postsApi } from '../api/posts';
import { useAuthStore } from '../store/auth/useAuthStore';

function CreatePost() {
  const [title, setTitle] = useState('Тестовый пост');
  const [description, setDescription] = useState('Тестовый текст');
  const user = useAuthStore((state) => state.user);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // тут вместо console.log можешь дернуть свой API
    console.log({
      title,
      body: description,
    })

    if (!user) {
      alert('Пожалуйста, войдите в систему');
      return;
    }

    postsApi.create({ title, description, userName: user?.name }).then((res) => {
      console.log(res);
    });

    // очистка полей
    setTitle('')
    setDescription('')
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4 text-gray-800">
          Создать пост
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Заголовок
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Например: Мой первый пост"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         min-h-[120px] resize-y"
              placeholder="Напишите что-нибудь..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                       py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
