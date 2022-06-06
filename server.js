const express = require("express")
const { Server: HttpServer } = require("http")
const { Server: IOServer} = require("socket.io")
const Contenedor = require("./contenedor.js");

const messages = []
const products = []

const app = express()
const { engine } = require("express-handlebars");
app.engine(
    "hbs",
    engine({
      extname: ".hbs",
      defaultLayout: "index.hbs",
    })
  )
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/", express.static('public'))
app.set("view engine", "hbs")
app.set("views", "./hbs_views")

const httpServer = new HttpServer(app)
const ioServer = new IOServer(httpServer)

ioServer.on('connection', (socket) => {
    socket.emit("messages", messages)
    socket.emit("products", products)
    
    // Para añadir nuevos productos a nuestra página
    socket.on("new_product", (producto) => {
        let index = 0
        if (products.length == 0) {
            index = 1
        }
        else {
            index = products[products.length - 1].id + 1
        }

        producto.id = index
        products.push(producto)
        ioServer.sockets.emit("products", products)
    })

    // Para añadir nuevos mensajes y mostrarlos
    socket.on("new_message", (mensaje) => {
        const contenedor = new Contenedor("./messages.txt")
        messages.push(mensaje)
        contenedor.save(mensaje)
        ioServer.sockets.emit("messages", messages)
    })
})

httpServer.listen(8080, () => {
    console.log("Server escuchando en el puerto 8080!")
})

app.get("/", (req, res) => {
    const contenedor = new Contenedor("/messages.txt")
    contenedor
        .getAll()
        .then((mensajes) => {
            messages = mensajes
        })
        .catch((error) => {
            console.log(error)
        })
    res.render("main")
})