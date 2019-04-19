const formularioContactos = document.querySelector('#contacto'),
	  listadoContatos = document.querySelector('#listado-contactos tbody'),
	  buscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
	// Cuando el formualrio de crear o editar se ejecuta
	formularioContactos.addEventListener('submit', leerFormulario);
	// Eliminar contactos
	if (listadoContatos) {
		listadoContatos.addEventListener('click', eliminarContactos);
	}
	if(buscador){
		buscador.addEventListener('input', buscadorContactos);
	}
	
	numeroContactos();
	
}

function leerFormulario(e) {
	e.preventDefault();

	const nombre = document.querySelector('#nombre').value,
		empresa = document.querySelector('#empresa').value,
		telefono = document.querySelector('#telefono').value,
		accion = document.querySelector('#accion').value;
	if (nombre === '' || empresa === '' || telefono === '') {
		mostrarNotificacion('Todos los campos son obligatorios', 'error');
	} else {
		

		const infoContacto = new FormData();
		infoContacto.append('nombre', nombre);
		infoContacto.append('empresa', empresa);
		infoContacto.append('telefono', telefono);
		infoContacto.append('accion', accion);

		if (accion == 'crear') {
			// Crear contacto
			insertarBD(infoContacto);
		} else {
			// Editar Contacto
			const idRegistro = document.querySelector('#id').value;
			infoContacto.append('id', idRegistro);
			actualizarRegistro(infoContacto);
		}
	}
}
// Inserta en la base de datos via ajax
function insertarBD(datos) {
	fetch('inc/modelos/modelo-contactos.php', {
		method: 'POST',
		body: datos
	})
		.then(res => res.json() )
		.then(respuesta => {
			console.log(respuesta);
			const nuevoContacto = document.createElement('tr');

			nuevoContacto.innerHTML = `
				<td>${respuesta.datos.nombre}</td>
				<td>${respuesta.datos.empresa}</td>
				<td>${respuesta.datos.telefono}</td>
			`;

			// Crear contenedor para los botones
			const contenedorAcciones = document.createElement('td');

			// Crear el icono de editar
			const iconoEditar = document.createElement('i');
			iconoEditar.classList.add('fas', 'fa-pen-square');

			// Crear el enlace para editar
			const btnEditar = document.createElement('a');
			btnEditar.appendChild(iconoEditar);
			btnEditar.href = `editar.php?id${respuesta.datos.id_insertado}`;
			btnEditar.classList.add('btn-editar', 'btn');
			// Agregar al padre
			contenedorAcciones.appendChild(btnEditar);

			// Crear boton de elminar 
			const iconoEliminar = document.createElement('i');
			iconoEliminar.classList.add('fas', 'fa-trash-alt');

			// Crear btnEliminar
			const btnEliminar = document.createElement('button');
			btnEliminar.appendChild(iconoEliminar);
			btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
			btnEliminar.classList.add('btn-borrar', 'btn');
			// Agregar al padre
			contenedorAcciones.appendChild(btnEliminar);
			
			// Agregar al tr
			nuevoContacto.appendChild(contenedorAcciones);

			listadoContatos.appendChild(nuevoContacto);



			// Restear el formulario
			document.querySelector('form').reset();
			// Mostrar notificacion
			mostrarNotificacion('Datos agregados correctamente', 'correcto');

			// Actualizamos el numero
			numeroContactos();
		});

	// // crear un objeto
	// const xhr = new XMLHttpRequest();
	// // abrir la conexion
	// xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
	// // Pasar los datos
	// xhr.onload = function() {
	// 	if (this.status === 200) {
	// 		console.log(JSON.parse(xhr.responseText));
	// 	}
	// }

	// xhr.send(datos);
}


// Actualizar Registro
function actualizarRegistro(datos){
	fetch('inc/modelos/modelo-contactos.php', {
		method: 'POST',
		body: datos
	})
	.then( res => res.json() )
	.then(respuesta => {
		console.log(respuesta);
		
		if(respuesta.respuesta === 'correcto'){
			mostrarNotificacion('Contacto Editado Correctamente', 'correcto');
		}else {
			mostrarNotificacion('Actaulizar el Contacto Correctamente', 'error');
		}

		setTimeout( function(){
			window.location.href = 'index.php';
		}, 4000);
	})

}

// Eliminar el contacto
function eliminarContactos(e){

	if(e.target.parentElement.classList.contains('btn-borrar')){
		// Tomar id
		const id = e.target.parentElement.getAttribute('data-id');
		console.log(id);
		// Preguntar al usuario
		const respuesta = confirm('¿ Estas seguro (a) ?');
		
		if(respuesta){
			fetch(`inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`)
			.then(res => res.json())
			.then( data => {
				 
				if(data.respuesta === "correcto"){
					e.target.parentElement.parentElement.parentElement.remove();
					mostrarNotificacion('Contacto eliminado...', 'correcto');
					// Actualizamos el numero
					numeroContactos();
				} else {
					mostrarNotificacion('Hubo un error...', 'error');
				}
			})

		}
	}
}

/// Mostrar notificacion en pantalla
function mostrarNotificacion(mensaje, clase) {
	const notificacion = document.createElement('div');
	notificacion.classList.add(clase, 'notificacion');
	notificacion.textContent = mensaje;

	formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

	setTimeout(() => {
		notificacion.classList.add('visible');
		setTimeout(() => {
			notificacion.classList.remove('visible');
			setTimeout(() => {
				notificacion.remove();
			}, 500);
		}, 3000);
	}, 1000);
}

// Buscador de registros
function buscadorContactos(e){
	const expresion = new RegExp(e.target.value, "i"),
		  registros = document.querySelectorAll('tbody tr');

		  registros.forEach(registro => {
			  registro.style.display = 'none';

			  if(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1){
				registro.style.display = 'table-row';
			  }
			  numeroContactos();
		  })
}

// Muestra el numero de contactos
function numeroContactos(){
	const totalContacto = document.querySelectorAll('tbody tr'),
		  contenedorNumero = document.querySelector('.total-contactos span');
	
		  let total = 0;

	totalContacto.forEach( contacto => {
		if(contacto.style.display == '' || contacto.style.display == 'table-row'){
			total++
		}
	});

	contenedorNumero.textContent = total;
}
