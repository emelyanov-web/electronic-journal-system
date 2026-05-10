import { useEffect, useState } from "react";

import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";

export default function App() {
  const role = "teacher";

  const [journals, setJournals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/journals")
      .then((res) => res.json())
      .then((data) => {
        setJournals(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      {role === "student" && <StudentDashboard journals={journals} />}

      {role === "teacher" && (
        <TeacherDashboard journals={journals} setJournals={setJournals} />
      )}
    </>
  );
}
