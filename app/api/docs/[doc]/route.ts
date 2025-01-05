import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// READ (single item)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
    const item = await db.collection("items").findOne({ _id: new ObjectId(params.id) })
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

// UPDATE
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
    const { name, description } = await request.json()
    const item = await db.collection("items").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { name, description } },
      { returnDocument: 'after' }
    )
    if (!item.value) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json(item.value)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
    const result = await db.collection("items").deleteOne({ _id: new ObjectId(params.id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

