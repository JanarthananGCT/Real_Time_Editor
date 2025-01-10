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
    const item = await db.collection("docs").updateOne(
      { 
        user: user,
        "docs.id": docs.id 
      },
      {
        $set: {
          "docs.$.title": docs.title,
          "docs.$.isActive": docs.isActive,
          "docs.$.content": docs.content
        }
      }
    );

    if (item.matchedCount === 0) {
      console.error("Document not found");
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Fetch the updated document
    const updatedDoc = await db.collection("docs").findOne({ user: user });
    console.log("Updated document:", updatedDoc);
    return NextResponse.json(updatedDoc);
  } catch (e) {
    console.error('Error updating item:', e);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME);
    const { user, docs } = await request.json();

    console.log("Received payload:", { user, docs });
    console.log("Deleting document with ID:", docs.id);

    const item = await db.collection("docs").updateOne(
      { user: user },
      {
        $pull: {
          docs: { id: docs.id }
        }
      }
    );

    if (item.matchedCount === 0) {
      console.error("Document not found");
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const updatedDoc = await db.collection("docs").findOne({ user: user });
    console.log("Updated document after deletion:", updatedDoc);
    return NextResponse.json(updatedDoc);
  } catch (e) {
    console.error('Error deleting item:', e);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
