const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend работает",
  });
});

app.get("/journals", async (req, res) => {
  try {
    const journals = await prisma.journal.findMany({
      include: {
        students: {
          include: {
            attendances: true,
          },
        },

        lessons: true,
      },
    });

    const formattedJournals = journals.map((journal) => {
      const attendance = {};

      journal.students.forEach((student) => {
        student.attendances.forEach((attendanceItem) => {
          attendance[`${attendanceItem.studentId}-${attendanceItem.lessonId}`] =
            attendanceItem.value;
        });
      });

      return {
        ...journal,
        attendance,
      };
    });

    res.json(formattedJournals);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ошибка получения журналов",
    });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, login, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Логин уже занят",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        login,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({
      message: "Пользователь создан",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ошибка регистрации",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Пользователь не найден",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Неверный пароль",
      });
    }

    res.json({
      message: "Успешный вход",

      user: {
        id: user.id,
        name: user.name,
        login: user.login,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ошибка входа",
    });
  }
});

app.post("/journals", async (req, res) => {
  try {
    const { group, subject, students, lessons } = req.body;

    const journal = await prisma.journal.create({
      data: {
        group,
        subject,

        teacherId: 1,

        students: {
          create: students.map((student) => ({
            name: student.name,
          })),
        },

        lessons: {
          create: lessons.map((lesson) => ({
            date: new Date(lesson.date),

            type: lesson.type,
          })),
        },
      },

      include: {
        students: {
          include: {
            attendances: true,
          },
        },

        lessons: true,
      },
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Ошибка создания журнала",
    });
  }
});

app.patch(
  "/attendance/:journalId",

  async (req, res) => {
    try {
      const { journalId } = req.params;

      const { attendance } = req.body;

      for (const key in attendance) {
        const [studentId, lessonId] = key.split("-");

        const value = attendance[key];

        const existingAttendance = await prisma.attendance.findFirst({
          where: {
            studentId: Number(studentId),

            lessonId: Number(lessonId),
          },
        });

        if (existingAttendance) {
          await prisma.attendance.update({
            where: {
              id: existingAttendance.id,
            },

            data: {
              value,
            },
          });
        } else {
          await prisma.attendance.create({
            data: {
              value,

              studentId: Number(studentId),

              lessonId: Number(lessonId),
            },
          });
        }
      }

      res.json({
        message: "Attendance updated",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Ошибка обновления attendance",
      });
    }
  },
);

app.delete(
  "/journals/:id",

  async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.attendance.deleteMany({
        where: {
          lesson: {
            journalId: Number(id),
          },
        },
      });

      await prisma.lesson.deleteMany({
        where: {
          journalId: Number(id),
        },
      });

      await prisma.student.deleteMany({
        where: {
          journalId: Number(id),
        },
      });

      await prisma.journal.delete({
        where: {
          id: Number(id),
        },
      });

      res.json({
        message: "Journal deleted",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Ошибка удаления журнала",
      });
    }
  },
);

app.put(
  "/journals/:id",

  async (req, res) => {
    try {
      const { id } = req.params;

      const { group, subject, students, lessons } = req.body;

      await prisma.attendance.deleteMany({
        where: {
          lesson: {
            journalId: Number(id),
          },
        },
      });

      await prisma.lesson.deleteMany({
        where: {
          journalId: Number(id),
        },
      });

      await prisma.student.deleteMany({
        where: {
          journalId: Number(id),
        },
      });

      const updatedJournal = await prisma.journal.update({
        where: {
          id: Number(id),
        },

        data: {
          group,
          subject,

          students: {
            create: students.map((student) => ({
              name: student.name,
            })),
          },

          lessons: {
            create: lessons.map((lesson) => ({
              date: new Date(lesson.date),

              type: lesson.type,
            })),
          },
        },

        include: {
          students: true,
          lessons: true,
        },
      });

      res.json(updatedJournal);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Ошибка обновления журнала",
      });
    }
  },
);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
