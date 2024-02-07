"use strict"
/**
 * Importaciones necesarias:
 */
import { Router } from "express";
import {cargarZonas, grabarDatosApartamento, mostrarInmuebles} from "../controllers/inmobiliaria.controllers.js";//con esto importamos las funciones desde controller

const router = Router(); //declaración del router

router.get("/zonas",cargarZonas);//dirección de la funcion de mostrar zonas
router.get("/inmuebles/:numHabitaciones/:precio/:idZona",mostrarInmuebles)//Direccion de la funcion para mostrar los inmuebles
router.post('/reserva/',grabarDatosApartamento)//función encargada de grabar los datos en la bbdd
export default router;//lo exportamos.
