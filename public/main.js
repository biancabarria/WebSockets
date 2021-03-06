const socket = io();

const enviarMensaje = () => {
  const author = document.getElementById("author").value;
  const text = document.getElementById("text").value;
  const fyh = String(new Date().toDateString() + ' ' + new Date().toLocaleTimeString());
  const mensaje = {
    author,
    text,
    fyh
  };
  socket.emit('new_message', mensaje);
  document.getElementById("author").value = '';
  document.getElementById("text").value = '';
  return false;
}

const cargarProducto = () => {
  const id = 0;
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const producto = {
    id,
    name,
    price,
    thumbnail
  };
  socket.emit('new_product', producto);
  document.getElementById("name").value = '';
  document.getElementById("price").value = '';
  document.getElementById("thumbnail").value = '';
  return false;
}

const crearEtiquetasMensaje = (mensaje) => {
  const {
    author,
    text,
    fyh
  } = mensaje;
  return `
  <div>
    <strong style='color:blue'>${author}</strong>
    <p style='color:brown'>${fyh}</p>
    <i style='color:green'>${text}</i>
  </div>
  `;
}

const crearEtiquetasProductos = (producto) => {
  const {
    id,
    name,
    price,
    thumbnail
  } = producto;
  return `
  <tr>
    <td>${id}</td>
    <td>${name}</td>
    <td>$ ${price}</td>
    <td><img style="width: 50px; height:50px" src=${thumbnail} alt=""></td>
  </tr>
  <tr>
  `;
}

const agregarMensajes = (mensajes) => {
  const mensajesFinal = mensajes.map(mensaje => crearEtiquetasMensaje(mensaje)).join(" ");
  document.getElementById("messages").innerHTML = mensajesFinal;
}

const agregarProductos = (productos) => {
  const headtable = `<header class="p-3 bg-dark text-white text-center"><h5>Productos agregados</h1></header>
  <table class="table table-bordered">
    <thead>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Thumbnail</th>
    </thead>
    </tr>`
  const foottable = `</tbody>
  </table>`
  const products = productos.map(producto => crearEtiquetasProductos(producto)).join(" ");
  const productosFinal = headtable.concat(products, foottable);
  document.getElementById("products").innerHTML = productosFinal;
}

socket.on('messages', (messages) => agregarMensajes(messages));
socket.on('products', (products) => agregarProductos(products));