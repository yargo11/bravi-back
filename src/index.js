const express = require("express");
const { uuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const listaDeContatos = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  return next();
}

app.use(logRequests);

app.get("/contatos", (request, response) => {
  const { name } = request.query;

  const results = name
    ? listaDeContatos.filter((listaDeContatos) =>
        listaDeContatos.name.includes(name)
      )
    : listaDeContatos;

  return response.json(results);
});

app.post("/contatos", (request, response) => {
  const { name, contatos } = request.body;

  const contato = { id: uuid(), name, contatos };

  listaDeContatos.push(contato);

  return response.json(contato);
});

app.put("/contatos/:id", (request, response) => {
  const { id } = request.params;
  const { name, contatos } = request.body;

  const contactIndex = listaDeContatos.findIndex(
    (contato) => contato.id === id
  );

  if (contactIndex < 0) {
    return response.status(400).json({ error: "Contact not found" });
  }

  const contato = {
    id,
    name,
    contatos,
  };

  listaDeContatos[contactIndex] = contato;

  return response.json(contato);
});

app.delete("/contatos/:id", (request, response) => {
  const { id } = request.params;

  const contactIndex = listaDeContatos.findIndex(
    (contato) => contato.id === id
  );

  if (contactIndex < 0) {
    return response.status(400).json({ error: "Contact not found" });
  }

  listaDeContatos.splice(contactIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("Back-end started! 😊");
});
