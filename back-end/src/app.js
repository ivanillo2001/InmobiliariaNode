"use strict";
//Instalamos el paquete express
/**
 * El paquete express (que se instala con npm i express) es el framework de back-end
 * más popular de node. Proporciona un conjunto de herramientas para aplicaciones web,
 * peticiones y respuestas http, enrutamiento y middlewawre para construir y desplegar aplicaciones
 * a gran escala
 */
import express from "express";
import router from "./routes/inmobiliaria.routes.js";
import cors from 'cors';

import { PORT } from "./config.js"; //importamos el port

// import './config.js';
//crear un objeto con la instancia de express
const app = express();

//configuramos el puerto
// const PORT = 3000;

//habilitar CORS (se instala npm i cors)
app.use(cors());
//middleware
app.use(express.json()); //para que reconozca el json para crear usuarios
app.use(router);
//middlewarre, controlar si se pasa una ruta en la url
app.use((req, res) => {
  res.status(404).json({
    message: "endpoint no encontrado",
  });
});
//servidor a la escucha por el puerto 3000
app.listen(PORT, () => {
  console.log("Escuchando solicitudes");
});
