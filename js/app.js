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

        mostrarCitas();
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

        // en indexdb se utilizan las transacciones para insertar
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');

        let peticion = objectStore.add(nuevaCita);
        console.log(peticion);

        peticion.onsuccess = () => {

            formulario.reset();
        }

        transaction.oncomplete = () => {

            mostrarCitas();
        }

        transaction.onerror = () => {

            console.log('error al agregar');
        }
    });


    function mostrarCitas(){

        // limpiar las citas anteriores
        while(citas.firstChild){

            citas.removeChild(citas.firstChild);
        }

        // crear objectstore
        let objectStore = DB.transaction('citas').objectStore('citas');

        // esto retorna una peticion
        objectStore.openCursor().onsuccess = e => {

            // cursos se va aubicar en el registro indicado pra acceder a los datos
            let cursor = e.target.result;

            if(cursor){

                let citaHtml = document.createElement('li');
                citaHtml.setAttribute('data-cita-id', cursor.value.key);
                citaHtml.classList.add('list-group-item');

                citaHtml.innerHTML = `
                                        <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
                                        <p class="font-weight-bold">Cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
                                        <p class="font-weight-bold">Telefono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
                                        <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
                                        <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
                                        <p class="font-weight-bold">Sintomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                                        `;
                
                // boton de borrar
                const botonBorrar = document.createElement('button');
                botonBorrar.classList.add('borrar', 'btn', 'btn-danger');
                botonBorrar.innerHTML = '<span aria-hidden="true">X</span> Borrar';
                botonBorrar.onclick = borrarCita;
                citaHtml.appendChild(botonBorrar);

                // apend en el pader
                citas.appendChild(citaHtml);

                // consultar proximos registros
                cursor.continue();
            
            }else{
                
                if(!citas.firstChild){
                    
                    // no hay registros
                    headingAdministra.textContent = 'Agrega citas para comenzar';
                    let listado = document.createElement('p');
                    listado.classList.add('text-center');
                    listado.textContent = 'No hay registros';
                    citas.appendChild(listado);
                
                }else{

                    headingAdministra.textContent = 'Administra tus citas';
                }
            }
        }
    }


    function borrarCita(e){

        let citaId = Number(e.target.parentElement.getAttribute('data-cita-id'));

        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');
        let peticion = objectStore.delete(citaId);

        transaction.oncomplete = () => {

            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            console.log(`se elimino la cita con el id: ${citaId}`);

            if(!citas.firstChild){
                    
                // no hay registros
                headingAdministra.textContent = 'Agrega citas para comenzar';
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = 'No hay registros';
                citas.appendChild(listado);
            
            }else{

                headingAdministra.textContent = 'Administra tus citas';
            }
        }

    }
});