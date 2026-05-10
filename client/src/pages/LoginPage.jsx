import { useState } from "react";

export default function LoginPage({ setCurrentUser }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);

        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      setCurrentUser(data.user);
    } catch (error) {
      console.error(error);

      setError("Ошибка сервера");
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Journal</h1>

          <p className="text-gray-500 mt-2">Вход в систему</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Логин
            </label>

            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Пароль
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-semibold transition-all"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
