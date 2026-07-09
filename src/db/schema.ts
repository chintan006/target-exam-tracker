import { pgTable, serial, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull().default("Banking"),
  examDate: timestamp("exam_date", { withTimezone: true }).notNull(),
  description: text("description"),
  organization: varchar("organization", { length: 255 }),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const examPatterns = pgTable("exam_patterns", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => exams.id, { onDelete: "cascade" }),
  sectionName: varchar("section_name", { length: 255 }).notNull(),
  totalQuestions: integer("total_questions"),
  totalMarks: integer("total_marks"),
  duration: varchar("duration", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 50 }).notNull(),
  basicDone: boolean("basic_done").notNull().default(false),
  revisionDone: boolean("revision_done").notNull().default(false),
  fullCompleteDone: boolean("full_complete_done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Exam = typeof exams.$inferSelect;
export type NewExam = typeof exams.$inferInsert;
export type ExamPattern = typeof examPatterns.$inferSelect;
export type NewExamPattern = typeof examPatterns.$inferInsert;
export type Topic = typeof topics.$inferSelect;
export type NewTopic = typeof topics.$inferInsert;
