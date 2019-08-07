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

        // asignar a la base de datos
        DB = crearDB.result;
    }

    // método que solo corre una vez y es ideal para crear el Schema
    crearDB.onupgradeneeded = function(e){

        // el evento es la misma base de datos
        let db = e.target.result;
        
        // definir object store, 2 parametros: db y las opciones
        // keypath es el indice de la base de datos
        let objectStore = db.createObjectStore('citas', { keyPath: 'key', autoIncrement: true });

        // crear indices y campos de la db, createIndex: 3 parametros, nombre, keypath y opciones
        objectStore.createIndex('mascota', 'mascota', { unique: false });
        objectStore.createIndex('cliente', 'cliente', { unique: true });
        objectStore.createIndex('telefono', 'telefono', { unique: true });
        objectStore.createIndex('fecha', 'fecha', { unique: false });
        objectStore.createIndex('hora', 'hora', { unique: false });
        objectStore.createIndex('sintomas', 'sintomas', { unique: false });

        console.log('base de datos lista');


    }


    formulario.addEventListener('submit', function(e){

        e.preventDefault();

        const nuevaCita = {
            
            mascota: mascota.value,
            cliente: cliente.value,
            telefono: telefono.value,
            fecha: fecha.value,
            hora: hora.value,
            sintomas: sintomas.value
        }

        console.log(nuevaCita);

    });
});