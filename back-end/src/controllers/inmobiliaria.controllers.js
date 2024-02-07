import conexion from "../mysql_conector.js";

/**
 * @description Funcion encargada de hacer la petición a la bbdd para
 * obtener los cursos.
 * @param {*} req 
 * @param {*} res 
 */
export const cargarZonas = async (req, res) => {
  try {
    const [result] = await conexion.query("Select * from zonas"); 
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
};
/**
 * @description Función encargada de mostrar los inmuebles obteniéndolos de la bbdd
 * @param {*} req 
 * @param {*} res 
 */
export const mostrarInmuebles = async(req,res)=>{
  try {
    const { numHabitaciones, precio, idZona } = req.params; //obtenemos los parametros
    const [result]= await conexion.query("Select * from inmuebles WHERE habitaciones=? and precio<=? and zona=?",[numHabitaciones, precio, idZona]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error en el servidor",
    });
  }
}

/**
 * @description Función encargada de insertar las reservas en la bbdd
 * @param {*} req 
 * @param {*} res 
 */
export const grabarDatosApartamento = async(req,res)=>{
  try {
    const {dni, idinmuebles}=req.body;
    const [result]= await conexion.query("INSERT INTO reservas VALUES(NULL,?,?, CURDATE())",[dni,idinmuebles])
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al insertar los datos",
      error: error.message
    });
  }
}