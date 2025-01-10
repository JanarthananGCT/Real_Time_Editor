import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const { data: { user } } = await request.json()
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
    const items = await db.collection("docs").find({user: user}).toArray();
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

