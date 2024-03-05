const prisma = require("../db/prisma");
const { userAuth } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();

router.use(userAuth);

router.get("/all", async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
      }
    });

    res.status(200).send({
      status: "success",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: "error",
        message: "Integer Task ID is required",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(400).send({
        status: "error",
        message: "Task not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/add", async (req, res, next) => {
  try {
    const require = ["title", "description", "dueDate"];

    const missing = require.filter((key) => !req.body[key]);

    if (missing.length) {
      return res.status(400).send({
        error: `Please provide ${missing.join(", ")}`,
      });
    }

    if (new Date(req.body.dueDate).toString() === "Invalid Date") {
      return res.status(400).send({
        status: "error",
        message: "Invalid date format",
      });
    }

    if (new Date(req.body.dueDate) < new Date()) {
      return res.status(400).send({
        status: "error",
        message: "Due date should be in the future",
      });
    }

    const taskExists = await prisma.task.findFirst({
      where: {
        title: req.body.title,
        userId: req.user.id,
      },
    });

    if (taskExists) {
      return res.status(400).send({
        status: "error",
        message: "Task already exists",
      });
    }

    const task = await prisma.task.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        dueDate: new Date(req.body.dueDate),
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(200).send({
      status: "success",
      message: "Task added successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/update/:id", async (req, res, next) => {
  try {
    const valid = ["title", "description", "dueDate", "status"];

    const updates = Object.keys(req.body);

    const isValid = updates.every((update) => valid.includes(update));

    if (!isValid) {
      return res.status(400).send({
        status: "error",
        message: "Invalid updates!",
      });
    }

    if (new Date(req.body.dueDate).toString() === "Invalid Date") {
      return res.status(400).send({
        status: "error",
        message: "Invalid date format",
      });
    }

    if (new Date(req.body.dueDate) < new Date()) {
      return res.status(400).send({
        status: "error",
        message: "Due date should be in the future",
      });
    }

    const taskExists = await prisma.task.findFirst({
      where: {
        title: req.body.title,
        userId: req.user.id,
      },
    });

    if (taskExists && taskExists.id !== parseInt(req.params.id)) {
      return res.status(400).send({
        status: "error",
        message: "Task already exists",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(400).send({
        status: "error",
        message: "Task not found"
      });
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title: req.body.title || task.title,
        description: req.body.description || task.description,
        dueDate: new Date(req.body.dueDate) || task.dueDate,
        status: req.body.status || task.status,
      },
    });

    res.status(200).send({
      status: "success",
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async (req, res, next) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: "error",
        message: "Integer Task ID is required",
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(400).send({
        status: "error",
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.status(200).send({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;