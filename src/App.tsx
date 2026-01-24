import { Routes, Route, Link } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { AuthLayout } from './layouts/AuthLayout';
import { useAuthStore } from './store/auth/useAuthStore';
import CreatePost from './pages/CreatePost';
import AllPosts from './pages/AllPosts';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

//   console.log(JSON.parse(localStorage.getItem('auth-store')).state.user.token);
  
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="bg-blue-300 text-white p-4 flex items-center justify-between">
        <h4 className="font-semibold">Личный кабинет</h4>
        <div>
          <span>{user?.name ?? 'Авторизуйтесь'}</span>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Выйти
            </button>
          )}
        </div>
      </div>

      <nav className="flex items-center justify-between bg-blue-200 p-4">
        <ul className="flex items-center gap-4">
          <li>
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              Главная
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/posts/create" className="text-blue-500 hover:text-blue-700">
                  Создать пост
                </Link>
              </li>
              <li>
                <Link to="/posts/all" className="text-blue-500 hover:text-blue-700">
                  Посты
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="px-4 py-8 text-blue-300 text-center">
        <Routes>
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />

          <Route element={<AuthLayout />}>
            <Route path="/" element={<>MAIN PAGE</>} />
            <Route path="/posts/create" element={<CreatePost />} />
            <Route path="/posts/all" element={<AllPosts />} />
            {/* <Route path="/post/me" element={<MePosts />} /> */}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
