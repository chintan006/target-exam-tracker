"use client";

import { useState, useEffect, useCallback } from "react";
import { Crosshair, CalendarClock, BookCheck, TrendingUp } from "lucide-react";
import ExamsTab, { type ExamData, type PatternData } from "./ExamsTab";
import TopicsTab, { type TopicData } from "./TopicsTab";

type Tab = "exams" | "topics";

export default function TargetApp() {
  const [activeTab, setActiveTab] = useState<Tab>("exams");
  const [exams, setExams] = useState<ExamData[]>([]);
  const [patterns, setPatterns] = useState<PatternData[]>([]);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [examsRes, patternsRes, topicsRes] = await Promise.all([
        fetch("/api/exams"),
        fetch("/api/patterns"),
        fetch("/api/topics"),
      ]);

      const [examsData, patternsData, topicsData] = await Promise.all([
        examsRes.json(),
        patternsRes.json(),
        topicsRes.json(),
      ]);

      setExams(examsData);
      setPatterns(patternsData);
      setTopics(topicsData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddExam = async (data: {
    name: string;
    category: string;
    examDate: string;
    description: string;
    organization: string;
  }) => {
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newExam = await res.json();
      setExams((prev) => [...prev, newExam]);
    }
  };

  const handleDeleteExam = async (id: number) => {
    const res = await fetch(`/api/exams?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setExams((prev) => prev.filter((e) => e.id !== id));
      setPatterns((prev) => prev.filter((p) => p.examId !== id));
    }
  };

  const handleAddPattern = async (data: {
    examId: number;
    sectionName: string;
    totalQuestions: number;
    totalMarks: number;
    duration: string;
  }) => {
    const res = await fetch("/api/patterns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newPattern = await res.json();
      setPatterns((prev) => [...prev, newPattern]);
    }
  };

  const handleDeletePattern = async (id: number) => {
    const res = await fetch(`/api/patterns?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setPatterns((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddTopic = async (data: { name: string; subject: string }) => {
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newTopic = await res.json();
      setTopics((prev) => [...prev, newTopic]);
    }
  };

  const handleUpdateTopic = async (data: {
    id: number;
    basicDone?: boolean;
    revisionDone?: boolean;
    fullCompleteDone?: boolean;
  }) => {
    const res = await fetch("/api/topics", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const updated = await res.json();
      setTopics((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }
  };

  const handleDeleteTopic = async (id: number) => {
    const res = await fetch(`/api/topics?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTopics((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const upcomingExams = exams.filter(
    (e) => !e.isCompleted && new Date(e.examDate) > new Date()
  );
  const totalTopics = topics.length;
  const completedTopics = topics.filter(
    (t) => t.basicDone && t.revisionDone && t.fullCompleteDone
  ).length;

  const overallTopicProgress =
    totalTopics > 0
      ? Math.round(
          (topics.reduce(
            (sum, t) =>
              sum +
              (t.basicDone ? 1 : 0) +
              (t.revisionDone ? 1 : 0) +
              (t.fullCompleteDone ? 1 : 0),
            0
          ) /
            (totalTopics * 3)) *
            100
        )
      : 0;

  const tabs = [
    { key: "exams" as const, label: "Exams", icon: CalendarClock, badge: upcomingExams.length },
    { key: "topics" as const, label: "Study Progress", icon: BookCheck, badge: null },
  ];

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-80 h-80 bg-primary-500/5 rounded-full -top-20 -left-20 blur-3xl" />
        <div className="absolute w-64 h-64 bg-purple-500/5 rounded-full top-1/3 -right-10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-6 md:py-8">
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Crosshair size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gradient">Target</h1>
              <p className="text-xs text-slate-500 mt-0.5">Bank Exam Preparation Tracker</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card rounded-xl p-3.5 animate-slide-up">
            <div className="flex items-center gap-2 mb-1">
              <CalendarClock size={14} className="text-primary-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Exams
              </span>
            </div>
            <div className="text-2xl font-black text-white">{upcomingExams.length}</div>
            <div className="text-[10px] text-slate-500">upcoming</div>
          </div>

          <div
            className="glass-card rounded-xl p-3.5 animate-slide-up"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <BookCheck size={14} className="text-emerald-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Topics
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {completedTopics}
              <span className="text-sm text-slate-500">/{totalTopics}</span>
            </div>
            <div className="text-[10px] text-slate-500">mastered</div>
          </div>

          <div
            className="glass-card rounded-xl p-3.5 animate-slide-up"
            style={{ animationDelay: "160ms" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-accent-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Progress
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {overallTopicProgress}
              <span className="text-sm text-slate-500">%</span>
            </div>
            <div className="text-[10px] text-slate-500">overall</div>
          </div>
        </div>

        <nav className="flex gap-1 p-1 rounded-xl bg-white/3 border border-white/5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${
                activeTab === tab.key ? "tab-active" : "tab-inactive"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.badge !== null && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/20 text-primary-300">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-3" />
            <p className="text-sm text-slate-400">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "exams" && (
              <ExamsTab
                exams={exams}
                patterns={patterns}
                onAddExam={handleAddExam}
                onDeleteExam={handleDeleteExam}
                onAddPattern={handleAddPattern}
                onDeletePattern={handleDeletePattern}
              />
            )}

            {activeTab === "topics" && (
              <TopicsTab
                topics={topics}
                onAddTopic={handleAddTopic}
                onUpdateTopic={handleUpdateTopic}
                onDeleteTopic={handleDeleteTopic}
              />
            )}
          </>
        )}

        <footer className="mt-10 pb-6 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-600">
            <Crosshair size={12} />
            <span>Target — Keep grinding, success is loading... 🎯</span>
          </div>
        </footer>
      </div>
    </div>
  );
    }
