import { useState } from "react";

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

export default function App() {
  const role = "teacher";

  const [journals, setJournals] = useState([]);

  return (
    <>
      {role === "student" && <StudentDashboard journals={journals} />}

      {role === "teacher" && (
        <TeacherDashboard journals={journals} setJournals={setJournals} />
      )}
    </>
  );
}
