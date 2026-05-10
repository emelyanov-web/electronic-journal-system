import { useEffect, useState } from "react";

import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [journals, setJournals] = useState([]);

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

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

  if (!currentUser) {
    return <LoginPage setCurrentUser={setCurrentUser} />;
  }

  return (
    <>
      {currentUser.role === "TEACHER" ? (
        <TeacherDashboard
          journals={journals}
          setJournals={setJournals}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      ) : (
        <StudentDashboard
          journals={journals}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
    </>
  );
}
