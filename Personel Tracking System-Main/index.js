import express from 'express'
import bodyParser from 'body-parser'
import { mongoDBConnection } from './config/db.js'
import { fileURLToPath } from 'url'
import { getHome } from './controller/app.controller.js'
import path from 'path'
import session from 'express-session'
import { UserModel } from './models/User.js'
UserModel.find({ email: 'demhat@gmail.com' }).then(user => {
  if (user.length > 0) {
    UserModel.updateOne({ email: 'demhat@gmail.com' }, { isAdmin: true,salary:100 })
  }
  else {
    UserModel.create({ name: 'demhat', email: 'demhat@gmail.com', password: '123', departman: 'yazılım', phone: '05555555555', isAdmin: true })
  }
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express()

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'Radeonares32'
}))



app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', getHome)

app.listen(3000, () => {
  mongoDBConnection().then((data) => console.log("database connection")).catch(err => console.log(err))
  console.log("server listen")
})
