export default function JournalList({
  journals,
  onDeleteJournal,
  onOpenCreate,
  onOpenEdit,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Добавить журнал</h2>

        <div
          onClick={onOpenCreate}
          className="border-2 border-dashed border-violet-300 rounded-2xl p-6 hover:bg-violet-50 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-3xl text-violet-600">
              +
            </div>

            <div>
              <h3 className="text-xl font-semibold text-violet-700">
                Создать новый журнал
              </h3>

              <p className="text-gray-500">
                Добавьте новый журнал для группы и предмета
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Добавленные журналы</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="pb-4">Группа</th>

              <th className="pb-4">Предмет</th>

              <th className="pb-4">Действия</th>
            </tr>
          </thead>

          <tbody>
            {journals.map((journal) => (
              <tr key={journal.id} className="border-b last:border-none">
                <td className="py-5 font-medium">{journal.group}</td>

                <td className="py-5">{journal.subject}</td>

                <td className="py-5 flex gap-3">
                  <button
                    onClick={() => onOpenEdit(journal)}
                    className="bg-violet-100 text-violet-700 px-5 py-2 rounded-xl hover:bg-violet-200 transition-all"
                  >
                    Редактировать
                  </button>

                  <button
                    onClick={() => onDeleteJournal(journal.id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-all"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
