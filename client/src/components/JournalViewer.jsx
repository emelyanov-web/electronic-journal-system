import { useEffect, useState } from "react";

const values = ["—", "✔", "✘", "5", "4", "3", "2"];

export default function JournalViewer({
  journals,
  selectedJournal,
  setSelectedJournal,
  updateAttendance,
  editable = true,
}) {
  const [editableAttendance, setEditableAttendance] = useState({});
  const [activeCell, setActiveCell] = useState(null);

  useEffect(() => {
    if (selectedJournal) {
      setEditableAttendance(selectedJournal.attendance || {});
    }
  }, [selectedJournal]);

  const hasChanges =
    JSON.stringify(editableAttendance) !==
    JSON.stringify(selectedJournal?.attendance || {});

  function getValueColor(value) {
    switch (value) {
      case "✔":
        return "text-green-600";

      case "✘":
        return "text-red-600";

      case "5":
        return "text-green-600";

      case "4":
        return "text-blue-600";

      case "3":
        return "text-orange-500";

      case "2":
        return "text-red-600";

      default:
        return "text-gray-700";
    }
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-5">Выбор журнала</h2>

        <select
          value={selectedJournal?.id || ""}
          onChange={(e) => {
            const journal = journals.find(
              (j) => j.id === Number(e.target.value),
            );

            setSelectedJournal(journal);
          }}
          className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-violet-500"
        >
          <option value="">Выберите журнал</option>

          {journals.map((journal) => (
            <option key={journal.id} value={journal.id}>
              {journal.group} — {journal.subject}
            </option>
          ))}
        </select>
      </div>

      {selectedJournal && (
        <div className="bg-white rounded-3xl p-6 shadow-sm w-full min-w-0 overflow-hidden">
          <h2 className="text-2xl font-bold mb-2">{selectedJournal.group}</h2>

          <p className="text-gray-500 mb-6">{selectedJournal.subject}</p>

          <div className="w-full overflow-auto max-h-[70vh] border border-gray-200 rounded-2xl">
            <table className="border-separate border-spacing-0 w-max">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-50 bg-gray-50 border-b border-r border-gray-200 px-4 py-4 text-left w-[60px] min-w-[60px]">
                    №
                  </th>

                  <th className="sticky top-0 left-[60px] z-40 bg-gray-50 border-b border-r border-gray-200 px-4 py-4 text-left w-[220px] min-w-[220px]">
                    Студент
                  </th>

                  {selectedJournal.lessons.map((lesson) => (
                    <th
                      key={lesson.id}
                      className="sticky top-0 z-30 bg-gray-50 border-b border-r border-gray-200 px-4 py-4 text-center w-[120px] min-w-[120px]"
                    >
                      <div className="font-semibold text-sm whitespace-nowrap">
                        {lesson.date}
                      </div>

                      <div className="text-xs text-gray-400 mt-1 whitespace-nowrap">
                        {lesson.type}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {selectedJournal.students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-all"
                  >
                    <td className="sticky left-0 z-30 bg-white border-b border-r border-gray-200 px-4 py-4 text-sm w-[60px] min-w-[60px]">
                      {index + 1}
                    </td>

                    <td className="sticky left-[60px] z-20 bg-white border-b border-r border-gray-200 px-4 py-4 font-medium w-[220px] min-w-[220px]">
                      {student.name}
                    </td>

                    {selectedJournal.lessons.map((lesson) => (
                      <td
                        key={lesson.id}
                        className="border-b border-r border-gray-200 px-4 py-4 text-center w-[120px] min-w-[120px]"
                      >
                        <div className="relative flex justify-center">
                          {editable ? (
                            <button
                              onClick={() => {
                                const key = `${student.id}-${lesson.id}`;

                                setActiveCell(activeCell === key ? null : key);
                              }}
                              className={`w-10 h-10 rounded-xl hover:bg-violet-100 transition-all text-sm font-semibold ${getValueColor(
                                editableAttendance[
                                  `${student.id}-${lesson.id}`
                                ] || "—",
                              )}`}
                            >
                              {editableAttendance[
                                `${student.id}-${lesson.id}`
                              ] || "—"}
                            </button>
                          ) : (
                            <div
                              className={`w-10 h-10 flex items-center justify-center text-sm font-semibold ${getValueColor(
                                editableAttendance[
                                  `${student.id}-${lesson.id}`
                                ] || "—",
                              )}`}
                            >
                              {editableAttendance[
                                `${student.id}-${lesson.id}`
                              ] || "—"}
                            </div>
                          )}

                          {editable &&
                            activeCell === `${student.id}-${lesson.id}` && (
                              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl px-2 py-2 flex gap-1">
                                {values.map((value) => (
                                  <button
                                    key={value}
                                    onClick={() => {
                                      const key = `${student.id}-${lesson.id}`;

                                      setEditableAttendance({
                                        ...editableAttendance,
                                        [key]: value,
                                      });

                                      setActiveCell(null);
                                    }}
                                    className="min-w-[38px] h-9 rounded-lg hover:bg-violet-100 transition-all text-sm font-semibold"
                                  >
                                    {value}
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editable && hasChanges && (
            <div className="mt-5 text-sm text-amber-600 font-medium">
              Есть несохранённые изменения
            </div>
          )}
          {editable && (
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setEditableAttendance(selectedJournal.attendance || {});
                }}
                className="px-5 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition-all"
              >
                Отменить
              </button>

              <button
                onClick={() => {
                  updateAttendance(selectedJournal.id, editableAttendance);
                }}
                className="bg-violet-600 text-white px-5 py-3 rounded-xl hover:bg-violet-700 transition-all"
              >
                Сохранить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
