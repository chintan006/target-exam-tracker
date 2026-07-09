"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, X } from "lucide-react";
import RewardAnimation from "./RewardAnimation";

export interface TopicData {
  id: number;
  name: string;
  subject: string;
  basicDone: boolean;
  revisionDone: boolean;
  fullCompleteDone: boolean;
}

interface TopicsTabProps {
  topics: TopicData[];
  onAddTopic: (data: { name: string; subject: string }) => Promise<void>;
  onUpdateTopic: (data: { id: number; basicDone?: boolean; revisionDone?: boolean; fullCompleteDone?: boolean }) => Promise<void>;
  onDeleteTopic: (id: number) => Promise<void>;
}

const subjects = [
  { key: "quant", label: "Quantitative Aptitude", emoji: "🔢", color: "from-blue-500/15 to-cyan-500/15", border: "border-blue-500/20", bg: "bg-blue-500" },
  { key: "reasoning", label: "Reasoning Ability", emoji: "🧠", color: "from-purple-500/15 to-violet-500/15", border: "border-purple-500/20", bg: "bg-purple-500" },
  { key: "english", label: "English Language", emoji: "📖", color: "from-emerald-500/15 to-green-500/15", border: "border-emerald-500/20", bg: "bg-emerald-500" },
] as const;

const levels = [
  { key: "basicDone" as const, label: "Basic", emoji: "📗" },
  { key: "revisionDone" as const, label: "Revision", emoji: "🔄" },
  { key: "fullCompleteDone" as const, label: "Full Complete", emoji: "🏆" },
];

export default function TopicsTab({ topics, onAddTopic, onUpdateTopic, onDeleteTopic }: TopicsTabProps) {
  const [activeSubject, setActiveSubject] = useState("quant");
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState("");

  const subjectTopics = topics.filter((t) => t.subject === activeSubject);
  const currentSubject = subjects.find((s) => s.key === activeSubject)!;

  const totalTopics = subjectTopics.length;
  const basicCount = subjectTopics.filter((t) => t.basicDone).length;
  const revisionCount = subjectTopics.filter((t) => t.revisionDone).length;
  const fullCompleteCount = subjectTopics.filter((t) => t.fullCompleteDone).length;

  const overallProgress =
    totalTopics > 0
      ? Math.round(((basicCount + revisionCount + fullCompleteCount) / (totalTopics * 3)) * 100)
      : 0;

  const handleAddTopic = async () => {
    if (!topicName.trim()) return;
    setSubmitting(true);
    await onAddTopic({ name: topicName.trim(), subject: activeSubject });
    setTopicName("");
    setShowAddTopic(false);
    setSubmitting(false);
  };

  const handleToggle = async (
    topic: TopicData,
    level: "basicDone" | "revisionDone" | "fullCompleteDone"
  ) => {
    const newValue = !topic[level];
    await onUpdateTopic({ id: topic.id, [level]: newValue });

    if (newValue) {
      const levelLabel = levels.find((l) => l.key === level)?.label || "";
      const updatedTopic = { ...topic, [level]: newValue };

      if (
        updatedTopic.basicDone &&
        updatedTopic.revisionDone &&
        updatedTopic.fullCompleteDone
      ) {
        setRewardMessage(`${topic.name} — Fully Mastered! 🏆`);
      } else {
        setRewardMessage(`${topic.name} — ${levelLabel} Done! ✅`);
      }
      setShowReward(true);
    }
  };

  const onRewardComplete = useCallback(() => {
    setShowReward(false);
  }, []);

  const allSubjectStats = subjects.map((s) => {
    const sTopics = topics.filter((t) => t.subject === s.key);
    const total = sTopics.length;
    const done = sTopics.filter(
      (t) => t.basicDone && t.revisionDone && t.fullCompleteDone
    ).length;
    return { ...s, total, done };
  });

  return (
    <div className="space-y-5">
      <RewardAnimation
        show={showReward}
        onComplete={onRewardComplete}
        message={rewardMessage}
      />

      <div className="grid grid-cols-3 gap-3">
        {allSubjectStats.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSubject(s.key)}
            className={`glass-card rounded-xl p-4 text-left transition-all ${
              activeSubject === s.key
                ? `border ${s.border} shadow-lg`
                : "border border-transparent hover:border-white/5"
            }`}
          >
            <div className="text-xl mb-2">{s.emoji}</div>
            <div className="text-sm font-bold text-white">{s.label}</div>
            <div className="text-xs text-slate-400 mt-1">
              {s.done}/{s.total} topics done
            </div>
            {s.total > 0 && (
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.bg}`}
                  style={{
                    width: `${(s.done / s.total) * 100}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentSubject.emoji}</span>
          <h3 className="text-lg font-bold text-white">{currentSubject.label}</h3>
          {totalTopics > 0 && (
            <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
              {overallProgress}% overall
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddTopic(true)}
          className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add Topic
        </button>
      </div>

      {showAddTopic && (
        <div className="glass-card rounded-xl p-4 animate-fade-in border border-primary-500/15">
          <div className="flex gap-2">
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder={
                activeSubject === "quant"
                  ? "e.g., Percentage, Profit & Loss"
                  : activeSubject === "reasoning"
                  ? "e.g., Syllogism, Puzzles"
                  : "e.g., Cloze Test, Error Spotting"
              }
              className="input-premium flex-1 rounded-lg px-3 py-2.5 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
              autoFocus
            />
            <button
              onClick={handleAddTopic}
              disabled={!topicName.trim() || submitting}
              className="btn-primary px-4 py-2.5 rounded-lg text-sm font-semibold"
            >
              {submitting ? "..." : "Add"}
            </button>
            <button
              onClick={() => {
                setShowAddTopic(false);
                setTopicName("");
              }}
              className="px-3 py-2.5 rounded-lg text-slate-400 bg-white/5 hover:bg-white/8 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {totalTopics > 0 && (
        <div className="glass-card rounded-xl p-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Overall Progress — {currentSubject.label}</span>
            <span className="font-bold text-white">{overallProgress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3">
            {levels.map((l) => {
              const count =
                l.key === "basicDone"
                  ? basicCount
                  : l.key === "revisionDone"
                  ? revisionCount
                  : fullCompleteCount;

              return (
                <div key={l.key} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{l.emoji}</span>
                  <span>
                    {l.label}: <span className="font-bold text-white">{count}/{totalTopics}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subjectTopics.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center animate-slide-up">
          <div className="text-3xl mb-2">{currentSubject.emoji}</div>
          <h3 className="text-base font-bold text-white mb-1">No topics added</h3>
          <p className="text-xs text-slate-400">
            {currentSubject.label} ke topics add karo tracking shuru karne ke liye
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {subjectTopics.map((topic, i) => {
            const isFullyDone =
              topic.basicDone && topic.revisionDone && topic.fullCompleteDone;
            const progress = [
              topic.basicDone,
              topic.revisionDone,
              topic.fullCompleteDone,
            ].filter(Boolean).length;

            return (
              <div
                key={topic.id}
                className={`glass-card glass-card-hover rounded-xl p-3.5 animate-slide-up ${
                  isFullyDone ? "border border-emerald-500/15" : ""
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                        isFullyDone
                          ? "bg-emerald-500/20 border border-emerald-500/25"
                          : `bg-gradient-to-br ${currentSubject.color}`
                      }`}
                    >
                      {isFullyDone ? "✅" : currentSubject.emoji}
                    </div>
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isFullyDone
                            ? "text-emerald-300 line-through opacity-70"
                            : "text-white"
                        }`}
                      >
                        {topic.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex gap-0.5">
                          {[0, 1, 2].map((idx) => (
                            <div
                              key={idx}
                              className={`w-4 h-1 rounded-full ${
                                idx < progress ? currentSubject.bg : "bg-white/8"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 ml-1">{progress}/3</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {levels.map((level) => (
                      <div key={level.key} className="flex flex-col items-center gap-1">
                        <label className="relative cursor-pointer">
                          <input
                            type="checkbox"
                            checked={topic[level.key]}
                            onChange={() => handleToggle(topic, level.key)}
                            className="topic-check"
                          />
                        </label>
                        <span className="text-[9px] text-slate-500 font-medium">
                          {level.label}
                        </span>
                      </div>
                    ))}

                    <button
                      onClick={() => onDeleteTopic(topic.id)}
                      className="p-1.5 rounded-lg text-red-400/30 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
      }
