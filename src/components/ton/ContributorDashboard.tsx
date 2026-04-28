"use client";

import React, { useState } from "react";
import {
  INITIAL_SUBMISSIONS,
  type WireSubmission,
} from "@/lib/ton-data";
import {
  Send,
  ShieldCheck,
  ShieldAlert,
  Clock,
  User,
  Tag,
  AlertCircle,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CATEGORIES = [
  "National",
  "Economy",
  "Mining",
  "Legal",
  "Energy",
  "Infrastructure",
];
const PRIORITIES: WireSubmission["priority"][] = [
  "routine",
  "urgent",
  "breaking",
];

function priorityConfig(priority: WireSubmission["priority"]) {
  switch (priority) {
    case "breaking":
      return {
        color: "text-ton-red",
        bg: "bg-ton-red/10",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "BREAKING",
      };
    case "urgent":
      return {
        color: "text-ton-red",
        bg: "bg-ton-red/10",
        icon: <Zap className="w-3 h-3" />,
        label: "URGENT",
      };
    case "routine":
      return {
        color: "text-ton-black/40",
        bg: "bg-ton-black/5",
        icon: <Clock className="w-3 h-3" />,
        label: "ROUTINE",
      };
  }
}

function categoryColor(category: string) {
  switch (category) {
    case "National":
      return "text-ton-red";
    case "Economy":
      return "text-ton-red";
    case "Mining":
      return "text-amber-600";
    case "Legal":
      return "text-ton-black";
    case "Energy":
      return "text-emerald-600";
    case "Infrastructure":
      return "text-blue-600";
    default:
      return "text-ton-black/50";
  }
}

export default function ContributorDashboard() {
  const [submissions, setSubmissions] = useState<WireSubmission[]>(INITIAL_SUBMISSIONS);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<WireSubmission["priority"]>("routine");
  const [source, setSource] = useState("");
  const [content, setContent] = useState("");
  const [verified, setVerified] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !category || !content.trim()) {
      toast.error("Please fill in all required fields (Title, Category, Content).");
      return;
    }

    const newWire: WireSubmission = {
      id: `wire-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      source: source.trim() || "Unattributed",
      content: content.trim(),
      verified,
      timestamp: new Date().toISOString(),
      author: "You",
    };

    setSubmissions([newWire, ...submissions]);
    setTitle("");
    setCategory("");
    setPriority("routine");
    setSource("");
    setContent("");
    setVerified(false);
    toast.success("Wire submitted successfully!", {
      description: `"${newWire.title}" is now in the queue.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
      {/* Page Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <Send className="w-5 h-5 text-ton-red" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-ton-red/70 font-semibold">
            Verified Wires
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ton-black leading-tight">
          Contributor Dashboard
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <a
            href="/"
            className="font-mono text-[10px] text-ton-black/40 hover:text-ton-black transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            Newsroom
          </a>
          <span className="font-mono text-[10px] text-ton-black/30">GemsWeb Digital</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
        {/* Submission Form */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ton-black mb-5">
              Submit Wire
            </h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <Label className="font-mono text-[10px] uppercase tracking-wider text-ton-black/50">
                  Wire Title *
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter wire headline..."
                  className="mt-1.5 font-serif rounded-none border-ton-black/15"
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-mono text-[10px] uppercase tracking-wider text-ton-black/50">
                    Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1.5 font-mono text-xs rounded-none border-ton-black/15">
                      <Tag className="w-3 h-3 mr-1 opacity-50" />
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-mono text-[10px] uppercase tracking-wider text-ton-black/50">
                    Priority
                  </Label>
                  <Select
                    value={priority}
                    onValueChange={(v) => setPriority(v as WireSubmission["priority"])}
                  >
                    <SelectTrigger className="mt-1.5 font-mono text-xs rounded-none border-ton-black/15">
                      <AlertCircle className="w-3 h-3 mr-1 opacity-50" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Source */}
              <div>
                <Label className="font-mono text-[10px] uppercase tracking-wider text-ton-black/50">
                  Source Attribution
                </Label>
                <Input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., Ministry of Finance"
                  className="mt-1.5 font-mono text-xs rounded-none border-ton-black/15"
                />
              </div>

              {/* Content */}
              <div>
                <Label className="font-mono text-[10px] uppercase tracking-wider text-ton-black/50">
                  Content Body *
                </Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your wire content here..."
                  rows={6}
                  className="mt-1.5 font-serif text-sm rounded-none border-ton-black/15"
                />
              </div>

              {/* Verification Toggle */}
              <div className="flex items-center justify-between py-3 border-t border-ton-black/5">
                <div>
                  <Label className="font-mono text-[10px] uppercase tracking-wider text-ton-black/50">
                    Verification Status
                  </Label>
                  <p className="font-mono text-[10px] text-ton-black/30 mt-0.5">
                    {verified ? "Source verified and cross-referenced" : "Awaiting verification"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[10px] ${!verified ? "text-ton-red" : "text-ton-black/30"}`}>
                    Unverified
                  </span>
                  <Switch checked={verified} onCheckedChange={setVerified} />
                  <span className={`font-mono text-[10px] ${verified ? "text-emerald-600" : "text-ton-black/30"}`}>
                    Verified
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-ton-red text-white font-mono text-xs font-bold uppercase tracking-widest py-3 hover:bg-ton-red/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Wire
              </button>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-ton-black/30" />
              <h2 className="font-mono text-[10px] font-bold tracking-widest uppercase text-ton-black/50">
                Recent Submissions
              </h2>
            </div>
            <span className="font-mono text-[10px] text-ton-black/30">
              {submissions.length} wires
            </span>
          </div>

          <div className="divide-y divide-ton-black/5">
            {submissions.map((wire) => {
              const pConfig = priorityConfig(wire.priority);
              const catCol = categoryColor(wire.category);
              return (
                <div key={wire.id} className="py-5 sm:py-6 hover:bg-white/40 transition-colors">
                  {/* Badges row */}
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span className={`flex items-center gap-1 font-mono text-[9px] font-semibold uppercase ${pConfig.color} ${pConfig.bg} px-2 py-0.5`}>
                      {pConfig.icon}
                      <span className="ml-0.5">{pConfig.label}</span>
                    </span>
                    <span className={`font-mono text-[10px] font-semibold ${catCol}`}>
                      {wire.category}
                    </span>
                    {wire.verified ? (
                      <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-600 font-semibold uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-mono text-[9px] text-amber-600 font-semibold uppercase">
                        <ShieldAlert className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-ton-black leading-snug">
                    {wire.title}
                  </h3>

                  {/* Content preview */}
                  <p className="font-sans text-xs text-ton-black/50 mt-1.5 line-clamp-2 leading-relaxed">
                    {wire.content}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-2.5 font-mono text-[10px] text-ton-black/30 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {wire.author}
                    </span>
                    <span>
                      {new Date(wire.timestamp).toLocaleString("en-NA", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>Source: {wire.source}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
