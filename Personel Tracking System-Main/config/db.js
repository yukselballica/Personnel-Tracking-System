import mongoose from 'mongoose'

export const mongoDBConnection = async () => {
  const db = await mongoose.connect('mongodb://admin:password@127.0.0.1:27017')
  return db
}
