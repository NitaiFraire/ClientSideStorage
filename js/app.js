let DB;

// Selectores de la interfaz
const formulario = document.querySelector('form'),
      mascota = document.querySelector('#mascota'),
      cliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citas = document.querySelector('#citas'),
      headingAdministra = document.querySelector('#administra');


// esperar por el DOM ready
document.addEventListener('DOMContentLoaded', () => {

    // crer db
    let crearDB = window.indexedDB.open('citas');

    // si hay error enviarlo a ala consola
    crearDB.onerror = function(){

        console.log('hubo error');
    }

    // si no hay errores, mostrar en conola y asignar la base de datos
    crearDB.onsuccess = function(){

        console.log('toodo listo');
        // asignar a la base de datos
        DB = crearDB.result;
        console.log(DB);
    }


});