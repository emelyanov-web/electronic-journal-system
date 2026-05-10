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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
