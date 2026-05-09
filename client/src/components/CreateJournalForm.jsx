import { useEffect, useState } from "react";

export default function CreateJournalForm({
  onSaveJournal,
  onClose,
  editingJournal,
  onUpdateJournal,
}) {
  const [group, setGroup] = useState("");
  const [subject, setSubject] = useState("");

  const [students, setStudents] = useState([]);

  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (editingJournal) {
      setGroup(editingJournal.group);

      setSubject(editingJournal.subject);

      setStudents(editingJournal.students);

      setLessons(editingJournal.lessons);
    } else {
      setGroup("");

      setSubject("");

      setStudents([
        { id: 1, name: "Емельянов Д. Ю." },
        { id: 2, name: "Петров К. А." },
      ]);

      setLessons([
        {
          id: 1,
          date: "2026-05-16",
          type: "Лекция",
        },

        {
          id: 2,
          date: "2026-05-17",
          type: "Практика",
        },
      ]);
    }
  }, [editingJournal]);

  function addStudent() {
    setStudents([
      ...students,
      {
        id: Date.now(),
        name: "Новый студент",
      },
    ]);
  }

  function addLesson() {
    setLessons([
      ...lessons,
      {
        id: Date.now(),
        date: "2026-05-20",
        type: "Лекция",
      },
    ]);
  }

  function updateStudentName(id, value) {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, name: value } : student,
      ),
    );
  }

  function updateLessonDate(id, value) {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, date: value } : lesson,
      ),
    );
  }

  function updateLessonType(id, value) {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, type: value } : lesson,
      ),
    );
  }

  function handleSaveJournal() {
    const journalData = {
      id: editingJournal ? editingJournal.id : Date.now(),

      group,
      subject,
      students,
      lessons,
      attendance: editingJournal?.attendance || {},
    };

    if (editingJournal) {
      onUpdateJournal(journalData);
    } else {
      onSaveJournal(journalData);
    }

    onClose();
  }

  return (
    <div className="flex flex-col h-[85vh]">
      <h1 className="text-3xl font-bold mb-6">Добавление журнала</h1>

      <div className="grid grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block mb-2 font-medium text-sm">Группа</label>

          <input
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="Введите группу"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm">Предмет</label>

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Введите предмет"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-3xl p-4 flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-auto rounded-2xl border border-gray-200 relative bg-white">
          <table className="min-w-max border-separate border-spacing-0">
            <thead className="sticky top-0 z-[200] bg-white">
              <tr>
                <th className="sticky top-0 left-0 z-[220] bg-white border-b border-r border-gray-200 px-3 py-3 text-sm text-left w-[55px] min-w-[55px]">
                  №
                </th>

                <th className="sticky top-0 left-[55px] z-[210] bg-white border-b border-r border-gray-200 px-3 py-3 text-sm text-left w-[170px] min-w-[170px] shadow-[4px_0_10px_rgba(0,0,0,0.06)]">
                  Студент
                </th>

                {lessons.map((lesson) => (
                  <th
                    key={lesson.id}
                    className="border-b border-r border-gray-200 px-2 py-3 w-[125px] min-w-[125px] bg-white"
                  >
                    <input
                      type="date"
                      value={lesson.date}
                      onChange={(e) =>
                        updateLessonDate(lesson.id, e.target.value)
                      }
                      className="w-full text-xs border border-gray-300 rounded-lg px-2 py-2 mb-2 outline-none"
                    />

                    <select
                      value={lesson.type}
                      onChange={(e) =>
                        updateLessonType(lesson.id, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs outline-none bg-white"
                    >
                      <option>Лекция</option>
                      <option>Практика</option>
                      <option>Семинар</option>
                    </select>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-100 transition-all"
                >
                  <td className="sticky left-0 z-[90] bg-white border-b border-r border-gray-200 px-3 py-4 text-sm min-w-[55px]">
                    {index + 1}
                  </td>

                  <td className="sticky left-[55px] z-[80] bg-white border-b border-r border-gray-200 px-3 py-4 text-sm font-medium min-w-[170px] shadow-[4px_0_10px_rgba(0,0,0,0.06)]">
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) =>
                        updateStudentName(student.id, e.target.value)
                      }
                      className="w-full bg-transparent outline-none"
                    />
                  </td>

                  {lessons.map((lesson) => (
                    <td
                      key={lesson.id}
                      className="border-b border-r border-gray-200 px-2 py-4 text-center text-gray-400 text-sm min-w-[125px]"
                    >
                      —
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={addStudent}
              className="bg-violet-100 text-violet-700 px-5 py-3 rounded-xl hover:bg-violet-200 transition-all text-sm"
            >
              + Студент
            </button>

            <button
              onClick={addLesson}
              className="bg-violet-600 text-white px-5 py-3 rounded-xl hover:bg-violet-700 transition-all text-sm"
            >
              + Занятие
            </button>
          </div>

          <button
            onClick={handleSaveJournal}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-all text-sm"
          >
            Сохранить журнал
          </button>
        </div>
      </div>
    </div>
  );
}
