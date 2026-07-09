import { db } from "@/db";
import { exams } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const allExams = await db.select().from(exams).orderBy(desc(exams.examDate));
    return NextResponse.json(allExams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, examDate, description, organization } = body;

    if (!name || !examDate) {
      return NextResponse.json(
        { error: "Name and exam date are required" },
        { status: 400 }
      );
    }

    const newExam = await db
      .insert(exams)
      .values({
        name,
        category: category || "Banking",
        examDate: new Date(examDate),
        description: description || null,
        organization: organization || null,
      })
      .returning();

    return NextResponse.json(newExam[0], { status: 201 });
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(exams).where(eq(exams.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting exam:", error);
    return NextResponse.json({ error: "Failed to delete exam" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, examDate, description, organization, isCompleted } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (examDate !== undefined) updateData.examDate = new Date(examDate);
    if (description !== undefined) updateData.description = description;
    if (organization !== undefined) updateData.organization = organization;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const updated = await db
      .update(exams)
      .set(updateData)
      .where(eq(exams.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json({ error: "Failed to update exam" }, { status: 500 });
  }
}
