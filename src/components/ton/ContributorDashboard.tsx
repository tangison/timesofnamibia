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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        color: "bg-ton-red text-white",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "BREAKING",
      };
    case "urgent":
      return {
        color: "bg-ton-gold/20 text-ton-gold border-ton-gold/30",
        icon: <Zap className="w-3 h-3" />,
        label: "URGENT",
      };
    case "routine":
      return {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: <Clock className="w-3 h-3" />,
        label: "ROUTINE",
      };
  }
}

function categoryColor(category: string) {
  switch (category) {
    case "National":
      return "bg-ton-red/10 text-ton-red border-ton-red/20";
    case "Economy":
      return "bg-ton-gold/10 text-ton-gold border-ton-gold/20";
    case "Mining":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Legal":
      return "bg-ton-navy/10 text-ton-navy border-ton-navy/20";
    case "Energy":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Infrastructure":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
}

export default function ContributorDashboard() {
  const [submissions, setSubmissions] =
    useState<WireSubmission[]>(INITIAL_SUBMISSIONS);
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-ton-black text-ton-cream p-6 sm:p-8 ton-border-editorial mb-6">
        <div className="flex items-center gap-3">
          <Send className="w-6 h-6 text-ton-gold" />
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">
              Contributor Dashboard
            </h1>
            <p className="font-mono text-xs text-ton-cream/50 mt-1 tracking-wider uppercase">
              Verified Wires
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-2">
          <div className="bg-white ton-border-editorial p-6 sticky top-6">
            <h2 className="font-serif text-xl font-bold text-ton-black mb-4">
              Submit Wire
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-ton-black/50">
                  Wire Title *
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter wire headline..."
                  className="mt-1 font-serif"
                />
              </div>

              {/* Category + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-ton-black/50">
                    Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1 font-mono text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-ton-black/50">
                    Priority
                  </Label>
                  <Select
                    value={priority}
                    onValueChange={(v) =>
                      setPriority(v as WireSubmission["priority"])
                    }
                  >
                    <SelectTrigger className="mt-1 font-mono text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
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
                <Label className="font-mono text-xs uppercase tracking-wider text-ton-black/50">
                  Source Attribution
                </Label>
                <Input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., Ministry of Finance"
                  className="mt-1 font-mono text-xs"
                />
              </div>

              {/* Content */}
              <div>
                <Label className="font-mono text-xs uppercase tracking-wider text-ton-black/50">
                  Content Body *
                </Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your wire content here..."
                  rows={6}
                  className="mt-1 font-serif text-sm"
                />
              </div>

              {/* Verification Toggle */}
              <div className="flex items-center justify-between py-2 border-t border-b border-ton-black/5">
                <div>
                  <Label className="font-mono text-xs uppercase tracking-wider text-ton-black/50">
                    Verification Status
                  </Label>
                  <p className="font-mono text-[10px] text-ton-black/30 mt-0.5">
                    {verified ? "Source verified and cross-referenced" : "Awaiting verification"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-xs ${!verified ? "text-ton-red" : "text-ton-black/30"}`}
                  >
                    Unverified
                  </span>
                  <Switch checked={verified} onCheckedChange={setVerified} />
                  <span
                    className={`font-mono text-xs ${verified ? "text-emerald-600" : "text-ton-black/30"}`}
                  >
                    Verified
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-ton-red text-white font-mono text-sm font-bold uppercase tracking-widest py-3 hover:bg-ton-red/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Wire
              </button>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="lg:col-span-3">
          <div className="bg-white ton-border-editorial">
            <div className="bg-ton-black px-6 py-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-ton-cream/60" />
              <h2 className="font-mono text-xs font-bold text-ton-cream tracking-widest uppercase">
                Recent Submissions
              </h2>
              <span className="font-mono text-xs text-ton-cream/40 ml-auto">
                {submissions.length} wires
              </span>
            </div>
            <div className="divide-y divide-ton-black/5 max-h-[800px] overflow-y-auto ton-scrollbar">
              {submissions.map((wire) => {
                const pConfig = priorityConfig(wire.priority);
                const catColor = categoryColor(wire.category);
                return (
                  <div key={wire.id} className="px-6 py-4 hover:bg-ton-cream/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] ${pConfig.color}`}
                          >
                            {pConfig.icon}
                            <span className="ml-1">{pConfig.label}</span>
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`font-mono text-[10px] ${catColor}`}
                          >
                            {wire.category}
                          </Badge>
                          {wire.verified ? (
                            <Badge className="bg-emerald-100 text-emerald-700 font-mono text-[10px] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-700 font-mono text-[10px] flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" />
                              Unverified
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-serif text-base font-semibold text-ton-black leading-tight">
                          {wire.title}
                        </h3>
                        <p className="font-sans text-xs text-ton-black/50 mt-1.5 line-clamp-2">
                          {wire.content}
                        </p>
                        <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-ton-black/30">
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
