// Variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const listaCursos = document.querySelector('#lista-cursos');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Cuando agregas un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Muestra los cursos de localStorage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito') || []);

        carritoHTML();
    })

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];
        localStorage.clear()    // clear localStorage
        limpiarHTML();
    })
}

// Funciones 
// Agrega curso al carrito
function agregarCurso(e) {
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement
        // console.log('Agregando al carrito...', cursoSeleccionado);

        leerDatosCurso(cursoSeleccionado)
    }
    // console.log(e.target.classList, 'Presionando en cursos');
}

// Eimina un curso del arrito
function eliminarCurso(e) {
    // console.log('Desde eliminar curso', e.target.classList);
    if (e.target.classList.contains('borrar-curso')){
        // console.log(e.target.getAttribute('data-id'));
        const cursoId = e.target.getAttribute('data-id')

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId)

        carritoHTML(); // Iterar sobre le carrito y mostrar su HTML
        
    }
}

// Lee el contenido del HMTL al que le dimos click y extrae la información del curso
function leerDatosCurso(curso) {
    // console.log(curso);

    // Crear un objeto con e contenido del curso actual
    const infoCurso = {
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        imagen: curso.querySelector('img').src,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // Revisa si un elemento ya existe en el carrito
    // const existe = articulosCarrito.some(curso => curso.id === infoCurso.id)
    const existe = articulosCarrito.some((curso) => {
        return curso.id === infoCurso.id 
    });
    if(existe){
        // Agregamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso // Retorna el objeto actualizado
            } else {
                return curso // Retorna los objetos que no son actualizados
            }
        });
        articulosCarrito = [...cursos]
    } else {
        // Agrega elementos al arrgelo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso]
    }
    // console.log('Existe -->', existe);
    console.log(articulosCarrito);
    carritoHTML();
}

// Muestra el carrito de compras en el HTML
function carritoHTML() {
    // Limpiar el HTML
    limpiarHTML();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {
        // Destructuring
        const { imagen, titulo, precio, cantidad, id } = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>    
        <td>
            <a href="#" class="borrar-curso" data-id="${id}">X</a>
        </td>
        `;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row)
    })

    // Agregar carrito de compras - Sincronizar localStorage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del tbody
function limpiarHTML() {
    // Formal Lenta
    // contenedorCarrito.innerHTML = '';

    // Forma rápida
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

