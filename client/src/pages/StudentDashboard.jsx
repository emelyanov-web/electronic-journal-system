function StudentDashboard({ journals }) {
  const currentStudentName = "Емельянов Д. Ю.";

  const studentJournal = journals.find((journal) =>
    journal.students.some((student) => student.name === currentStudentName),
  );

  const currentStudent = studentJournal?.students.find(
    (student) => student.name === currentStudentName,
  );

  const attendance = studentJournal?.attendance || {};

  const lessons =
    studentJournal?.lessons.map((lesson) => {
      const value = attendance[`${currentStudent?.id}-${lesson.id}`] || "—";

      return {
        date: lesson.date,
        type: lesson.type,
        value,
      };
    }) || [];

  const presentValues = ["✔", "5", "4", "3", "2"];

  const gradeValues = ["5", "4", "3", "2"];

  const presentCount = lessons.filter((lesson) =>
    presentValues.includes(lesson.value),
  ).length;

  const attendancePercent = lessons.length
    ? Math.round((presentCount / lessons.length) * 100)
    : 0;

  const grades = lessons
    .filter((lesson) => gradeValues.includes(lesson.value))
    .map((lesson) => Number(lesson.value));

  const averageGrade = grades.length
    ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800">Journal</h1>

          <p className="text-gray-500 mt-1">Электронный журнал</p>
        </div>

        <nav className="flex flex-col gap-3">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#7c3aed] text-white shadow-md">
            <span>📚</span>
            Главная
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition">
            <span>👤</span>
            Профиль
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition">
            <span>📈</span>
            Успеваемость
          </button>
        </nav>

        <div className="mt-auto">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition">
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {/* Top */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Добро пожаловать
            </h1>

            <p className="text-gray-500 mt-2 text-lg">Панель ученика</p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Студент</p>

            <p className="font-semibold text-gray-800">{currentStudentName}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-2">Посещаемость</p>

            <h2 className="text-4xl font-bold text-gray-800">
              {attendancePercent}%
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-2">Средний балл</p>

            <h2 className="text-4xl font-bold text-gray-800">{averageGrade}</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-2">Пропуски</p>

            <h2 className="text-4xl font-bold text-red-500">2</h2>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Посещаемость</h2>

              <p className="text-gray-500">История посещений занятий</p>
            </div>

            <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2 rounded-xl transition">
              Скачать
            </button>
          </div>

          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-100 hover:shadow-md transition"
              >
                <div className="text-sm text-gray-500 mb-2">{lesson.type}</div>

                <div className="font-bold text-lg text-gray-800">
                  {lesson.date}
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold">
                    {lesson.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
