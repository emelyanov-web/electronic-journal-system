export default function Sidebar({ activePage, setActivePage, setCurrentUser }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-6">
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>

          <p className="text-sm text-gray-400">Электронный журнал</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setActivePage("journals")}
            className={`p-3 rounded-xl text-left font-medium transition-all ${
              activePage === "journals"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Журналы
          </button>

          <button
            onClick={() => setActivePage("create")}
            className={`p-3 rounded-xl text-left font-medium transition-all ${
              activePage === "create"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Добавить журнал
          </button>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("user");

          setCurrentUser(null);
        }}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all"
      >
        Выйти
      </button>
    </div>
  );
}
