"use strict";
//declaración de variables globales
let xmlHttp;
let tabla;

//Script
$(() => {
  xmlHttp = crearConexion();
  if (xmlHttp != undefined) {
    cargarZonas();
  } else {
    Swal.fire("El navegador no soporta AJAX. Debe actualizar el navegador");
  }
  validarFormulario();
});

/**
 * @description Función para validar el formulario
 */
const validarFormulario = () => {
  $(".formInmo").validate({
    errorElement: "em", //establece el tipo de letra en el mensaje que muestra
    errorPlacement: function (error, element) {
      // Add the `help-block` class to the error element 
      error.addClass("invalid-feedback"); //en caso de error se le añade el invalid-feedback. (Borde en rojo y un icono)

      if (element.prop("type") === "radio") {
        error.insertAfter(element.parent("div").parent());
      } else {
        error.insertAfter(element);
      }
    },
    //poner borde alrededor de la casilla
    highlight: function (element, errorClass, validClass) {
      if (element.type != "radio") {
        $(element).addClass("is-invalid").removeClass("is-valid"); //en caso de que haya un error, se añade la clase is-invalid y quita is-valid
      }
    },
    unhighlight: function (element, errorClass, validClass) {
      if (element.type != "radio") {
        $(element).addClass("is-valid").removeClass("is-invalid");
      }
    },
    //Establecemos las reglas de nuestro formulario.
    //Todos los campos deben estar rellenos y validado el dni
    rules: {
      dni: {
        required: true,
        validacionDni: true,
      },
      zona: {
        required: true,
      },
      numhab: {
        required: true,
      },
      precio: {
        required: true,
      },
    },
    //Mensajes que saltan al haber un error
    messages: {
      dni: {
        required: "<span class='error'>Campo obligatorio</span>", //mensaje que salta cuando el campo está vacío
        validacionDni: "DNI incorrecto",//mensaje que salta cuando no cumple el formato del dni
      },
      zona: {
        required: "<span class='error'>Campo obligatorio</span>",
      },
      numhab: {
        required: "<span class='error'>Campo obligatorio</span>",
      },
      precio: {
        required: "<span class='error'>Campo obligatorio</span>",
      },
    },
    submitHandler: (form, event) => {
      event.preventDefault()
      mostrarInmuebles();//al hacerse el submit se llama  la funcion mostrarInmuebles()
    },
  });
};

/**
 * @description Con este método creamos la validacion de DNI mediante expresión
 * regular
 */
$.validator.addMethod("validacionDni", function (value, element) {
  let validDni = true;
  //desarrollamos la funcion
  //Primero debemos crear la expresión regular que contenga el dni:
  const regex = /^\d{8}[A-Za-z]$/;
  if (!regex.test(value)) {
    validDni = false;
  } else {
    var numero = value.slice(0, -1); //extraemos todos los valores menos el ultimo
    var letra = value[value.length - 1].toUpperCase(); //extraemos la letra
    //Calculamos la letra correspondiente al numero:
    let letrasValidas = "TRWAGMYFPDXBNJZSQVHLCKE";
    let letraCalculada = letrasValidas.charAt(numero % 23); //con esto obtenemos el resto de dividir el número entre 23. El numero que salga de resto es la letra
    if (letra != letraCalculada) {
      validDni = false;
    }
  }
  return validDni;
});

/**
 * @description Función para cargar las zonas de a partir del fichero zonas.php
 * Lo hacemos mediante xml
 */
function cargarZonas() {
  //llamamos al fichero de zonas.php
  let param = "http://localhost:3000/zonas";
  //preparamos el objeto xmlHttp
  xmlHttp.open("GET", param, true);
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //obtenemos los datos si va todo correcto:
      let datos = JSON.parse(xmlHttp.responseText);
      //recorremos el array de los datos y los añadimos al select
      $(datos).each((ind, zona) => {
        $("#zona").append(
          `<option id=${zona.idzona}>${zona.descripcion} </option>`
        );
      });
    }
  };
  xmlHttp.send();
}

// /**
//  * @description Función que muestra los inmuebles que haya según los parámetros que se hayan introducido
//  * en el formulario.
//  */
const mostrarInmuebles = () => {
  /**
   * Primero debemos obtener el valor de habitaciones precio y zona de la búsqueda.
   * Realizamos la peticion AJAX para obtener los inmbuebles según los parámetros pedudos en inmuebles.php
   */
  //obtenemos los valores del formulario
  const precio = $("#precio").val();
  const idZona = $("#zona option:selected").attr("id");
  const numHab = $(":radio[name=numhab]:checked").val(); //cogemos el radio que esté seleccionado
  let param = "http://localhost:3000/inmuebles/" + numHab + "/" + precio + "/" + idZona;
  //preparamos el objeto xmlHttp
  xmlHttp.open("GET", param, true);
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      //obtenemos los datos si va todo correcto:
      let datos = JSON.parse(xmlHttp.responseText);
      //recorremos el array de los datos y los añadimos al select
      tabla = $(".table").DataTable({
        data:datos,
        columns: [
          {
              data: "idinmuebles",
              
          },
          {
              data: "domicilio"
          },
          {
              data: "precio"
              
          },
          
      ],
      "sPaginationType": "full_numbers", //muestra los botones de first y last
      "select":{
        style:'os',
        selector:'td:first-child',
        style:'multi' //se pueden seleccionar varios
       
    },
    "language":{
      url:'../assets/librerias/DataTables/es-ES.json',
      select:{
          //personalizar un mensaje cuando se selecciona una fila
          rows:{
              _:'Ha seleccionado %d filas',
              0:'Haga click en una fila para seleccionarla',
              1:'solo 1 fila sleccionada'
          }
      }
  }
})
    }
  };
  xmlHttp.send();

  // creamos el boton de grabar
  const botonGrabar = $("<button>")
    .text("Grabar")
    .addClass("grabar btn btn-primary btn-lg")
    .on("click", function () {
      grabarDatosApartamento()
      limpiarFormulario();
    });

  // Añadir el botón al DOM
    $(".capaGrabar").append(botonGrabar);
};
/**
 * @description Funcion encargada de guardar los datos en la bbdd
 */
function grabarDatosApartamento(){
      //obtenemos los valores de cada inmueble de la tabla
      const inmuebleSeleccionado = tabla.rows({selected:true}).data().toArray();
      //ahora obtenemos los ids de los inmuebles seleccionados:
      const dniEscrito=$("#dni").val();   
      inmuebleSeleccionado.forEach(inmueble => {
        const id = inmueble.idinmuebles
        const datos={
          dni:dniEscrito,
          idinmuebles:id
        }
        fetch("http://localhost:3000/reserva",{
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(datos)
        })
        .then((datos)=>{
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Insertado con éxito!",
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch((error) => {
          alert("Error al insertar los datos")
        });
      });
      
}

/**
 * @description Funcion encargada de resetear todo el formulario
 */
function limpiarFormulario() {
  $("#dni").val("");
  $("#zona").val("");
  $("#precio").val("");
  $(".capaGrabar").empty(); // Eliminamos el contenido de la capaGrabar, que incluye el botón
  $(".table").empty();
  // Desmarcamos el radio button seleccionado
  $(":radio[name=numhab]").prop("checked", false);
}