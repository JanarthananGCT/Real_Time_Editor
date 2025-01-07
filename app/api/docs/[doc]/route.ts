import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME);

    // Parse request data
    const { user, docs } = await request.json();

    console.log("Received payload:", { user, docs });
    console.log("Updating document with ID:", docs.id);

    // Update the document
    const item = await db.collection("docs").findOneAndUpdate(
      { user: user },
      {
        $set: {
          'docs.$[elem].title': docs.title,
          'docs.$[elem].isActive': docs.isActive,
          'docs.$[elem].content': docs.content,
        },
      },
      {
        arrayFilters: [{ 'elem.id': docs.id }],
        returnDocument: 'after', // Use "returnDocument: 'after'" for MongoDB 5.0+
      }
    );

    if (!item?.value) {
      console.error("Item or document not found");
      return NextResponse.json({ error: 'Item or document not found' }, { status: 404 });
    }

    console.log("Updated document:", item.value);
    return NextResponse.json(item.value);
  } catch (e) {
    console.error('Error updating item:', e);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME);
    const { user, docs } = await request.json();

    console.log("Received payload:", { user, docs });
    console.log("Updating document with ID:", docs.id);
    const item = await db.collection("docs").findOneAndUpdate(
      { user: user , "docs.id": docs.id}, 
      {
        $pull: {
          docs: { id: docs.id } 
        }
      },
      {
        returnDocument: 'after' 
      }
    );
    if (!item?.value) {
      console.error("Item or document not found");
      return NextResponse.json({ error: 'Item or document not found' }, { status: 404 });
    }
    console.log("Deleted document:", item.value);
    return NextResponse.json(item.value);
  } catch (e) {
    console.error('Error deleting item:', e);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

