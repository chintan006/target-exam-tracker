"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, Clock, ChevronDown, ChevronUp, X, Building2 } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export interface ExamData {
  id: number;
  name: string;
  category: string;
  examDate: string;
  description: string | null;
  organization: string | null;
  isCompleted: boolean;
}

export interface PatternData {
  id: number;
  examId: number;
  sectionName: string;
  totalQuestions: number | null;
  totalMarks: number | null;
  duration: string | null;
}

interface ExamsTabProps {
  exams: ExamData[];
  patterns: PatternData[];
  onAddExam: (data: { name: string; category: string; examDate: string; description: string; organization: string }) => Promise<void>;
  onDeleteExam: (id: number) => Promise<void>;
  onAddPattern: (data: { examId: number; sectionName: string; totalQuestions: number; totalMarks: number; duration: string }) => Promise<void>;
  onDeletePattern: (id: number) => Promise<void>;
}

const presetExams = [
  { name: "IBPS PO Prelims", org: "IBPS" },
  { name: "IBPS PO Mains", org: "IBPS" },
  { name: "IBPS Clerk Prelims", org: "IBPS" },
  { name: "IBPS Clerk Mains", org: "IBPS" },
  { name: "SBI PO Prelims", org: "SBI" },
  { name: "SBI PO Mains", org: "SBI" },
  { name: "SBI Clerk Prelims", org: "SBI" },
  { name: "SBI Clerk Mains", org: "SBI" },
  { name: "RBI Grade B", org: "RBI" },
  { name: "RBI Assistant", org: "RBI" },
  { name: "NABARD Grade A", org: "NABARD" },
  { name: "SEBI Grade A", org: "SEBI" },
  { name: "LIC AAO", org: "LIC" },
  { name: "IBPS RRB PO", org: "IBPS" },
  { name: "SSC CGL", org: "SSC" },
];

function getDaysLeft(examDate: string): number {
  return Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function getUrgencyClass(examDate: string): string {
  const days = getDaysLeft(examDate);
  if (days <= 0) return "";
  if (days <= 7) return "urgency-critical";
  if (days <= 30) return "urgency-high";
  if (days <= 90) return "urgency-medium";
  return "urgency-low";
}

export default function ExamsTab({ exams, patterns, onAddExam, onDeleteExam, onAddPattern, onDeletePattern }: ExamsTabProps) {
  const [showAddExam, setShowAddExam] = useState(false);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);
  const [showAddPattern, setShowAddPattern] = useState<number | null>(null);
  const [examForm, setExamForm] = useState({ name: "", category: "Banking", examDate: "", description: "", organization: "" });
  const [patternForm, setPatternForm] = useState({ sectionName: "", totalQuestions: "", totalMarks: "", duration: "" });
  const [submitting, setSubmitting] = useState(false);

  const upcomingExams = exams
    .filter((e) => !e.isCompleted && new Date(e.examDate) > new Date())
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  const nextExam = upcomingExams[0];

  const handleAddExam = async () => {
    if (!examForm.name || !examForm.examDate) return;
    setSubmitting(true);
    await onAddExam(examForm);
    setExamForm({ name: "", category: "Banking", examDate: "", description: "", organization: "" });
    setShowAddExam(false);
    setSubmitting(false);
  };

  const handleAddPattern = async (examId: number) => {
    if (!patternForm.sectionName) return;
    setSubmitting(true);
    await onAddPattern({
      examId,
      sectionName: patternForm.sectionName,
      totalQuestions: parseInt(patternForm.totalQuestions) || 0,
      totalMarks: parseInt(patternForm.totalMarks) || 0,
      duration: patternForm.duration,
    });
    setPatternForm({ sectionName: "", totalQuestions: "", totalMarks: "", duration: "" });
    setShowAddPattern(null);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {nextExam && (
        <div className="relative rounded-2xl overflow-hidden animate-slide-up">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500/20 via-purple-500/10 to-pink-500/10 animate-glow-pulse" />
          <div className="relative m-[1px] rounded-2xl bg-[#0b0b1e]/90 backdrop-blur-xl p-5 md:p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-400">Next Exam</span>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">{nextExam.name}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  {nextExam.organization && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Building2 size={12} className="text-primary-400" />
                      {nextExam.organization}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar size={12} className="text-primary-400" />
                    {new Date(nextExam.examDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock size={12} className="text-primary-400" />
                    {new Date(nextExam.examDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <CountdownTimer targetDate={nextExam.examDate} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => setShowAddExam(true)} className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
          <Plus size={18} /> Add Exam
        </button>
      </div>

      {showAddExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fade-in" onClick={() => setShowAddExam(false)}>
          <div className="glass-card rounded-2xl w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Add New Exam</h3>
              <button onClick={() => setShowAddExam(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Select</label>
                <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-20 overflow-y-auto">
                  {presetExams.map((p) => (
                    <button key={p.name} onClick={() => setExamForm((prev) => ({ ...prev, name: p.name, organization: p.org }))}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${examForm.name === p.name ? "bg-primary-500/25 text-primary-300 border border-primary-500/30" : "bg-white/5 text-slate-400 hover:bg-white/8 border border-transparent"}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Exam Name *</label>
                  <input type="text" value={examForm.name} onChange={(e) => setExamForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., IBPS PO Prelims" className="input-premium w-full rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Organization</label>
                  <input type="text" value={examForm.organization} onChange={(e) => setExamForm((p) => ({ ...p, organization: e.target.value }))} placeholder="IBPS, SBI..." className="input-premium w-full rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Category</label>
                  <select value={examForm.category} onChange={(e) => setExamForm((p) => ({ ...p, category: e.target.value }))} className="input-premium w-full rounded-lg px-3 py-2.5 text-sm">
                    {["Banking", "SSC", "Railway", "Insurance", "Other"].map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Exam Date *</label>
                  <input type="datetime-local" value={examForm.examDate} onChange={(e) => setExamForm((p) => ({ ...p, examDate: e.target.value }))} className="input-premium w-full rounded-lg px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Notes</label>
                  <input type="text" value={examForm.description} onChange={(e) => setExamForm((p) => ({ ...p, description: e.target.value }))} placeholder="Optional notes..." className="input-premium w-full rounded-lg px-3 py-2.5 text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setShowAddExam(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 bg-white/5 hover:bg-white/8 transition-all">Cancel</button>
                <button onClick={handleAddExam} disabled={submitting || !examForm.name || !examForm.examDate} className="flex-1 btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold">{submitting ? "Adding..." : "Add Exam"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center animate-slide-up">
          <div className="text-4xl mb-3">📋</div>
          <h3 className="text-lg font-bold text-white mb-1">No exams added yet</h3>
          <p className="text-sm text-slate-400">Apna pehla exam add karo!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()).map((exam, i) => {
            const daysLeft = getDaysLeft(exam.examDate);
            const isPast = new Date(exam.examDate) <= new Date();
            const urgency = isPast ? "" : getUrgencyClass(exam.examDate);
            const examPatterns = patterns.filter((p) => p.examId === exam.id);
            const isExpanded = expandedExam === exam.id;
            return (
              <div key={exam.id} className={`glass-card glass-card-hover rounded-2xl overflow-hidden ${urgency} animate-slide-up`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isPast ? "bg-slate-500/10" : daysLeft <= 7 ? "bg-red-500/15" : daysLeft <= 30 ? "bg-orange-500/15" : "bg-primary-500/15"}`}>
                        <span className="text-base">{isPast ? "📄" : daysLeft <= 7 ? "🔴" : daysLeft <= 30 ? "🟠" : "🏦"}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white text-[15px] truncate leading-tight">{exam.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          {exam.organization && (<span className="text-[11px] text-slate-500">{exam.organization}</span>)}
                          <span className="flex items-center gap-1 text-[11px] text-slate-500"><Calendar size={10} />{new Date(exam.examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock size={10} />{new Date(exam.examDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!isPast && (<span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap ${daysLeft <= 7 ? "bg-red-500/15 text-red-400 border border-red-500/20" : daysLeft <= 30 ? "bg-orange-500/15 text-orange-400 border border-orange-500/20" : daysLeft <= 90 ? "bg-amber-500/10 text-amber-400 border border-amber-500/15" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"}`}>{daysLeft}d</span>)}
                      {isPast && (<span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/10">Done</span>)}
                      <button onClick={() => setExpandedExam(isExpanded ? null : exam.id)} className="p-1.5 rounded-lg bg-white/4 hover:bg-white/8 transition-colors text-slate-500 hover:text-slate-300">{isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
                      <button onClick={() => onDeleteExam(exam.id)} className="p-1.5 rounded-lg bg-white/4 hover:bg-red-500/15 transition-colors text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {!isPast && (
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Countdown</span>
                      <CountdownTimer targetDate={exam.examDate} compact />
                    </div>
                  )}
                </div>
                {isExpanded && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-white/5 pt-4 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam Pattern</h4>
                      <button onClick={() => setShowAddPattern(showAddPattern === exam.id ? null : exam.id)} className="text-xs font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"><Plus size={14} /> Add Section</button>
                    </div>
                    {examPatterns.length > 0 ? (
                      <div className="rounded-lg overflow-hidden border border-white/5">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-white/3 text-slate-400 text-xs">
                              <th className="text-left px-3 py-2 font-semibold">Section</th>
                              <th className="text-center px-3 py-2 font-semibold">Questions</th>
                              <th className="text-center px-3 py-2 font-semibold">Marks</th>
                              <th className="text-center px-3 py-2 font-semibold">Time</th>
                              <th className="w-8"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {examPatterns.map((p) => (
                              <tr key={p.id} className="border-t border-white/3 text-slate-300 hover:bg-white/3 transition-colors">
                                <td className="px-3 py-2 font-medium">{p.sectionName}</td>
                                <td className="px-3 py-2 text-center">{p.totalQuestions || "-"}</td>
                                <td className="px-3 py-2 text-center">{p.totalMarks || "-"}</td>
                                <td className="px-3 py-2 text-center text-xs">{p.duration || "-"}</td>
                                <td className="px-2 py-2"><button onClick={() => onDeletePattern(p.id)} className="text-red-400/50 hover:text-red-400 transition-colors"><X size={13} /></button></td>
                              </tr>
                            ))}
                            <tr className="border-t border-white/8 bg-white/3 font-semibold text-white text-xs">
                              <td className="px-3 py-2">Total</td>
                              <td className="px-3 py-2 text-center">{examPatterns.reduce((s, p) => s + (p.totalQuestions || 0), 0) || "-"}</td>
                              <td className="px-3 py-2 text-center">{examPatterns.reduce((s, p) => s + (p.totalMarks || 0), 0) || "-"}</td>
                              <td className="px-3 py-2 text-center">—</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-slate-500">No pattern added yet — Add sections to define exam pattern</div>
                    )}
                    {showAddPattern === exam.id && (
                      <div className="mt-3 p-3 rounded-lg bg-white/3 border border-white/5 animate-fade-in">
                        <div className="grid grid-cols-4 gap-2">
                          <input type="text" value={patternForm.sectionName} onChange={(e) => setPatternForm((p) => ({ ...p, sectionName: e.target.value }))} placeholder="Section name" className="input-premium rounded-lg px-2.5 py-2 text-xs" />
                          <input type="number" value={patternForm.totalQuestions} onChange={(e) => setPatternForm((p) => ({ ...p, totalQuestions: e.target.value }))} placeholder="Questions" className="input-premium rounded-lg px-2.5 py-2 text-xs" />
                          <input type="number" value={patternForm.totalMarks} onChange={(e) => setPatternForm((p) => ({ ...p, totalMarks: e.target.value }))} placeholder="Marks" className="input-premium rounded-lg px-2.5 py-2 text-xs" />
                          <input type="text" value={patternForm.duration} onChange={(e) => setPatternForm((p) => ({ ...p, duration: e.target.value }))} placeholder="Duration" className="input-premium rounded-lg px-2.5 py-2 text-xs" />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => setShowAddPattern(null)} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 bg-white/5 hover:bg-white/8 transition-colors">Cancel</button>
                          <button onClick={() => handleAddPattern(exam.id)} disabled={!patternForm.sectionName || submitting} className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold">Add</button>
                        </div>
                      </div>
                    )}
                    {exam.description && (<p className="text-xs text-slate-500 mt-3 italic">📝 {exam.description}</p>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
          }
