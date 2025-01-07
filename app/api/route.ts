import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// CREATE
export async function POST(request: Request) {
  try {
    const client = await clientPromise
    console.log("here")
    console.log(client)
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
    const { user, docs } = await request.json()

    const item = await db.collection("docs").insertOne({ user, docs})
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

// READ (all items)
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
    const items = await db.collection("docs").find().toArray();
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

