import { db } from "@/db";
import { examPatterns } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get("examId");

    if (examId) {
      const patterns = await db
        .select()
        .from(examPatterns)
        .where(eq(examPatterns.examId, parseInt(examId)));
      return NextResponse.json(patterns);
    }

    const allPatterns = await db.select().from(examPatterns);
    return NextResponse.json(allPatterns);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return NextResponse.json({ error: "Failed to fetch patterns" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examId, sectionName, totalQuestions, totalMarks, duration } = body;

    if (!examId || !sectionName) {
      return NextResponse.json(
        { error: "Exam ID and section name are required" },
        { status: 400 }
      );
    }

    const newPattern = await db
      .insert(examPatterns)
      .values({
        examId,
        sectionName,
        totalQuestions: totalQuestions || null,
        totalMarks: totalMarks || null,
        duration: duration || null,
      })
      .returning();

    return NextResponse.json(newPattern[0], { status: 201 });
  } catch (error) {
    console.error("Error creating pattern:", error);
    return NextResponse.json({ error: "Failed to create pattern" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.delete(examPatterns).where(eq(examPatterns.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting pattern:", error);
    return NextResponse.json({ error: "Failed to delete pattern" }, { status: 500 });
  }
}
