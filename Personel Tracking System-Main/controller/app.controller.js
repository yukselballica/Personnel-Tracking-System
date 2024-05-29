import express from 'express'
import { UserModel } from '../models/User.js'
import { upload } from '../config/multer.js'
import { LastRecentModel } from '../models/LastRecent.js'

const app = express.Router()

export const getHome = app.get('/', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  const findUser = await UserModel.findOne({ email: user })
  const lastRecent = await LastRecentModel.find({});
  const totalSalaries = await UserModel.find({});
  const top5Performers = await UserModel.find({})
    .sort({ performans: -1 })
    .limit(5);
  const userSalary = await UserModel.findOne({ email: user })
  const totalSalary = totalSalaries.reduce((acc, data) => acc + data.salary, 0);
  const totalUser = (await UserModel.find({})).length
  if (user) {
    res.render('home', { user: findUser, isAdmin, totalUser, lastRecent, userSalary, totalSalary,top5Performers })
  }
  else {
    res.redirect('/login')
  }

})
export const getRegister = app.get('/register', async (req, res) => {
  const { message } = req.query
  res.render('register', { message })
})
export const getLogin = app.get('/login', async (req, res) => {
  const { message } = req.query
  res.render('login', { message })
})

export const postRegister = app.post('/register', upload.single("image"), async (req, res) => {
  const { name, email, phone, passwordConfirm, password } = req.body
  let filename;
  if (!req.file) {
    res.redirect('/login?message=notimage')
  }
  else {
    filename = req.file.filename
    if (password == passwordConfirm) {
      UserModel.create({ name, email, phone, password, image: filename ? filename : "" }).then(() => {
        res.redirect('/login?message=success')
      })
    }
    else {
      res.redirect('/register?message=nomatch')
    }
  }


})
export const postLogin = app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await UserModel.find({ email, password })
  if (user.length > 0) {
    await LastRecentModel.create({ name: user[0].name, email: user[0].email, image: user[0].image, type: "LOGIN" })
    req.session.email = user[0].email
    req.session.isAdmin = user[0].isAdmin
    res.redirect('/')
  }
  else {
    res.redirect('/register?message=nouser')
  }
})
export const logout = app.get('/logout', async (req, res) => {
  if (req.session.email) {
    const user = await UserModel.findOne({ email: req.session.email })
    await LastRecentModel.create({ name: user.name, email: user.email, image: user.image, type: "LOGOUT" })
    req.session.destroy()
    res.redirect('/')
  }

})
export const getProfile = app.get('/profile', async (req, res) => {
  const email = req.session.email
  const isAdmin = req.session.isAdmin
  const { message } = req.query
  if (email) {
    const user = await UserModel.findOne({ email })
    res.render('profile', { user, isAdmin, message: message ? message : "" })
  }
  else {
    res.redirect('/?message=no_user')
  }
})
export const postProfile = app.post('/profile', upload.single("image"), async (req, res) => {
  const { name, email, phone } = req.body
  let filename;
  if (!req.file) {
    res.redirect('/profile?message=notimage')
  }
  else {
    filename = req.file.filename
    await UserModel.updateOne({ email }, { name, email, image: filename, phone }).catch(err => console.log(err))
    res.redirect('/?message=success_update')
  }

})
export const getSalary = app.get('/salary', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user) {
    const users = await UserModel.find({})
    res.render('salary-list', { user, users, isAdmin: isAdmin ? isAdmin : '' })
  }
  else {
    res.redirect('/?message=no_user')
  }
})
export const getUpdateSalary = app.get('/salary-update', async (req, res) => {
  const { email } = req.query
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.findOne({ email })
    res.render("salary-update", { user, isAdmin, users })
  }
  else {
    res.redirect('/?message=no_user')
  }

})
export const postUpdateSalary = app.post('/salary-update', async (req, res) => {
  const { name, email, salary } = req.body
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.updateOne({ email }, { name, email, salary })
    res.redirect('/salary')
  }
  else {
    res.redirect('/?message=no_user')
  }

})
export const deleteSalary = app.get('/salary-delete', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  const { email } = req.query
  if (user && isAdmin) {
    await UserModel.deleteOne({ email })
    res.redirect('/salary')
  }
  else {
    res.redirect('/?message=no_user')
  }
})
export const getPersonal = app.get('/personal', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.find({})
    res.render('personal-list', { user, users, isAdmin })
  }
  else {
    res.redirect('/?message=no_user')
  }
})
export const getUpdatePersonal = app.get('/personal-update', async (req, res) => {
  const { email } = req.query
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.findOne({ email })
    res.render("personal-update", { user, isAdmin, users })
  }
  else {
    res.redirect('/?message=no_user')
  }

})
export const postUpdatePersonal = app.post('/personal-update', async (req, res) => {
  const { name, email, phone } = req.body
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.updateOne({ email }, { name, email, phone })
    res.redirect('/personal')
  }
  else {
    res.redirect('/?message=no_user')
  }

})
export const deletePersonal = app.get('/personal-delete', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  const { email } = req.query
  if (user && isAdmin) {
    await UserModel.deleteOne({ email })
    res.redirect('/personal')
  }
  else {
    res.redirect('/?message=no_user')
  }
})

export const getPerformans = app.get('/performans', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user) {
    const users = await UserModel.find({})
    res.render('performans-list', { user, users, isAdmin: isAdmin ? isAdmin : "" })
  }
  else {
    res.redirect('/?message=no_user')
  }
})
export const getUpdatePerformans = app.get('/performans-update', async (req, res) => {
  const { email } = req.query
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.findOne({ email })
    res.render("performans-update", { user, isAdmin, users })
  }
  else {
    res.redirect('/?message=no_user')
  }

})
export const postUpdatePerformans = app.post('/performans-update', async (req, res) => {
  const { name, email, performans } = req.body
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  if (user && isAdmin) {
    const users = await UserModel.updateOne({ email }, { name, performans, email })
    res.redirect('/performans')
  }
  else {
    res.redirect('/?message=no_user')
  }

})
export const deletePerformans = app.get('/performans-delete', async (req, res) => {
  const user = req.session.email
  const isAdmin = req.session.isAdmin
  const { email } = req.query
  if (user && isAdmin) {
    await UserModel.deleteOne({ email })
    res.redirect('/performans')
  }
  else {
    res.redirect('/?message=no_user')
  }
})