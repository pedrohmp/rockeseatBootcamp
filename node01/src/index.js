const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.time(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

app.use(logRequest);

app.use("/projects/:id", validateProjectId);

app.get("/projects", (req, resp) => {
  const { title } = req.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return resp.json(results);
});

app.post("/projects", (req, resp) => {
  const { title, owner } = req.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return resp.json(project);
});

app.put("/projects/:id", (req, resp) => {
  const { id } = req.params;
  const { title, owner } = req.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return resp.status(400).json("project not found");
  }

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project;

  return resp.json(project);
});

app.delete("/projects/:id", (req, resp) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return resp.status(400).json("project not found");
  }

  project.splice(projectIndex, 1);

  return resp.send();
});

app.listen(3333, () => {
  console.log("🚀 back-end staterd!");
});
