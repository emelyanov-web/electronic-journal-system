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
        students: true,
        lessons: true,
      },
    });

    res.json(journals);
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
        students: true,
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
