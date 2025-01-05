import { error } from 'console'
import { MongoClient } from 'mongodb'

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.NEXT_PUBLIC_DATABASE_URL
const options = {}

let client
let clientPromise: any 


client = new MongoClient(uri, options)
clientPromise = null
try{
    clientPromise = client.connect()
    console.log("success !")
} catch (error){
    console.log(error)
}

export default clientPromise
