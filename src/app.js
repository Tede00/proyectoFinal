import express from 'express'
import productsRouter from './routes/products.router.js'
import viewsRuter from './routes/views.router.js'
import { __dirname } from './utils.js'
import { uploader } from './utils.js'
import { engine} from 'express-handlebars'
import { Server } from 'socket.io'

// importamos el servidor de express
const app = express()
const PORT = process.env.PORT ||8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

// express usa este motor de plantillas
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
// setiamos la direccion de las vistas / plantillas
app.set('views', './src/views')


const httpServer =  app.listen(PORT, error =>{
    if(error) console.log(error)
    console.log('server escuchando en el puerto',PORT)})
// Creamos el socket server
const io = new Server(httpServer)

// const socketServer= new Server (httpServer)

app.use((req,res, next)=>{
    req.io= io
    next()
})
app.use('/', viewsRuter)

app.use('/api/products', productsRouter)

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).send('Error 500 en el server')
})
io.on('connection', socket =>{
    console.log('nuevo cliente conectado')
    
    // socket.on('message', data =>{
        //     console.log(data)
    // })
    // socket.emit('socket_individual', 'este mensaje solo lo debe recibir los socket')
    // socket.broadcast.emit('para-todos-menos-el-actual', 'este ev lo veran todos los  sockets conectados menos el actual')
    // io.emit('eventos-para-todos', 'mensaje para todos los socket incluido el actal')
    const messages =[]
    // enviar mensajes viejos
    socket.on('mensaje_cliente', data =>{
        console.log(data)
        messages.push({id: socket.id, message: data})
        io.emit('message_server', messages)
    })

})
let messages= []
// llamar al manager
io.on('connection', socket =>{
    console.log('cliente conectado')

    socket.on('message', data=>{
        console.log('message data:', data)
        // gardamos los mensajes
        messages.push(data)
        // emitimos los mensajes
        io.emit('messageLogs', messages)
    })




})


// {
    //     "title":"producto prueba cambiado",
    //     "description":"Este es un producto cambiado de prueba", 
    //     "price":"222", 
    //     "thumbnail": "Sin imagen",
    //     "code":"abc12345", 
    //     "stock":"2545",
    //     "category":"abc"
    //  }
    