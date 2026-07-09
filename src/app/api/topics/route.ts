import { db } from "@/db";
import { topics } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allTopics = await db
      .select()
      .from(topics)
      .orderBy(asc(topics.subject), asc(topics.name));
    return NextResponse.json(allTopics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject } = body;

    if (!name || !subject) {
      return NextResponse.json(
        { error: "Name and subject are required" },
        { status: 400 }
      );
    }

    const newTopic = await db
      .insert(topics)
      .values({
        name,
        subject,
      })
      .returning();

    return NextResponse.json(newTopic[0], { status: 201 });
  } catch (error) {
    console.error("Error creating topic:", error);
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, basicDone, revisionDone, fullCompleteDone } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (basicDone !== undefined) updateData.basicDone = basicDone;
    if (revisionDone !== undefined) updateData.revisionDone = revisionDone;
    if (fullCompleteDone !== undefined) updateData.fullCompleteDone = fullCompleteDone;

    const updated = await db
      .update(topics)
      .set(updateData)
      .where(eq(topics.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating topic:", error);
    return NextResponse.json({ error: "Failed to update topic" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(topics).where(eq(topics.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return NextResponse.json({ error: "Failed to delete topic" }, { status: 500 });
  }
}
