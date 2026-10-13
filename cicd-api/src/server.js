const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
require("dotenv").config();

const { User, Post, Category, Comment, PostLike } = require("./models/models");

const app = express();

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "API is running",
  });
});

// CRUD reutilizável para os models
function createCrudRoutes(Model) {
  const router = express.Router();

  // CREATE
  router.post("/", async (req, res) => {
    try {
      const document = await Model.create(req.body);

      res.status(201).json(document);
    } catch (error) {
      handleError(error, res);
    }
  });

  // READ ALL
  router.get("/", async (req, res) => {
    try {
      const documents = await Model.find();

      res.status(200).json(documents);
    } catch (error) {
      handleError(error, res);
    }
  });

  // READ ONE
  router.get("/:id", async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid ID",
        });
      }

      const document = await Model.findById(req.params.id);

      if (!document) {
        return res.status(404).json({
          message: "Resource not found",
        });
      }

      res.status(200).json(document);
    } catch (error) {
      handleError(error, res);
    }
  });

  // UPDATE
  router.put("/:id", async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid ID",
        });
      }

      const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!document) {
        return res.status(404).json({
          message: "Resource not found",
        });
      }

      res.status(200).json(document);
    } catch (error) {
      handleError(error, res);
    }
  });

  // DELETE
  router.delete("/:id", async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          message: "Invalid ID",
        });
      }

      const document = await Model.findByIdAndDelete(req.params.id);

      if (!document) {
        return res.status(404).json({
          message: "Resource not found",
        });
      }

      res.status(200).json({
        message: "Resource deleted successfully",
      });
    } catch (error) {
      handleError(error, res);
    }
  });

  return router;
}

// Error handling
function handleError(error, res) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "A resource with this unique value already exists",
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}

app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Register CRUD routes
app.use("/users", createCrudRoutes(User));
app.use("/posts", createCrudRoutes(Post));
app.use("/categories", createCrudRoutes(Category));
app.use("/comments", createCrudRoutes(Comment));
app.use("/post-likes", createCrudRoutes(PostLike));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "CI/CD Studies API - Swagger",
  }),
);

// Start application
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
    process.exit(1);
  }
}

startServer();
