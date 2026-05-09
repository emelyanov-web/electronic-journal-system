import { useState } from "react";
import Sidebar from "../components/Sidebar";
import JournalList from "../components/JournalList";
import Modal from "../components/Modal";
import CreateJournalForm from "../components/CreateJournalForm";
import JournalViewer from "../components/JournalViewer";

export default function TeacherDashboard({ journals, setJournals }) {
  const [activePage, setActivePage] = useState("journals");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [editingJournal, setEditingJournal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function saveJournal(journalData) {
    setJournals([...journals, journalData]);
  }

  function deleteJournal(id) {
    setJournals(journals.filter((journal) => journal.id !== id));
  }

  function updateJournal(updatedJournal) {
    setJournals(
      journals.map((journal) =>
        journal.id === updatedJournal.id ? updatedJournal : journal,
      ),
    );
  }

  function updateAttendance(journalId, newAttendance) {
    setJournals(
      journals.map((journal) => {
        if (journal.id !== journalId) {
          return journal;
        }

        return {
          ...journal,
          attendance: newAttendance,
        };
      }),
    );

    setSelectedJournal((prev) => ({
      ...prev,
      attendance: newAttendance,
    }));
  }

  function openCreateModal() {
    setEditingJournal(null);
    setIsModalOpen(true);
  }

  function openEditModal(journal) {
    setEditingJournal(journal);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 p-10 min-w-0 overflow-hidden">
        {activePage === "journals" && (
          <div>
            <h1 className="text-4xl font-bold mb-2">Просмотр всех журналов</h1>

            <p className="text-gray-500 mb-8">Просмотр и работа с журналами</p>

            <JournalViewer
              journals={journals}
              selectedJournal={selectedJournal}
              setSelectedJournal={setSelectedJournal}
              updateAttendance={updateAttendance}
            />
          </div>
        )}

        {activePage === "create" && (
          <div>
            <h1 className="text-4xl font-bold mb-2">Все журналы</h1>

            <p className="text-gray-500 mb-8">
              Создание и управление журналами
            </p>

            <JournalList
              journals={journals}
              onDeleteJournal={deleteJournal}
              onOpenCreate={openCreateModal}
              onOpenEdit={openEditModal}
            />
          </div>
        )}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <CreateJournalForm
              onSaveJournal={saveJournal}
              onUpdateJournal={updateJournal}
              onClose={() => setIsModalOpen(false)}
              editingJournal={editingJournal}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
