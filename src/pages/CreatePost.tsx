// src/pages/CreatePost.tsx
import { useState, type FormEvent } from 'react'
import { postsApi } from '../api/posts';
import { useAuthStore } from '../store/auth/useAuthStore';
import { toast } from 'sonner';

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
      toast.error('Пожалуйста, войдите в систему');
      return;
    }

    postsApi.create({ title, description, userName: user?.name }).then((res) => {
      console.log(res);
      toast.success('Пост успешно создан!');
    });

    // очистка полей
    setTitle('')
    setDescription('')
  }

  return (
    <div className="bg-neutral-900 flex items-center justify-center">
      <div className="w-full max-w-md bg-neutral-800 shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4 text-gray-200">
          Создать пост
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Заголовок
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 rounded-xl text-sm text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-neutral-500"
              placeholder="Например: Мой первый пост"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Текст
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 rounded-xl text-sm text-gray-200
                         focus:outline-none focus:ring-2 focus:ring-neutral-500
                         min-h-[120px] resize-y"
              placeholder="Напишите что-нибудь..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neutral-600 hover:bg-neutral-500 text-white text-sm font-medium
                       py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            Создать
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
