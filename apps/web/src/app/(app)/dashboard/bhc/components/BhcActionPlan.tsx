"use client";

import { useState, useEffect } from "react";
import type { SectionScore } from "@/lib/bhcApi";

interface Props {
  assessmentId: string;
  sectionScores: SectionScore[];
  percentage: number;
}

const PLAN_BY_SECTION: Record<string, { month1: string[]; month2: string[] }> = {
  "Financial Management": {
    month1: [
      "Open a dedicated business bank account if you haven't",
      "Document all income and expenses for the past 3 months",
      "Build a simple monthly budget template",
    ],
    month2: [
      "Reconcile accounts weekly for the full month",
      "Identify your 3 biggest unnecessary expenses and cut them",
      "Create a 6-month cash flow forecast",
    ],
  },
  "Business Operations": {
    month1: [
      "Write down your 3 core business processes in plain steps",
      "Set 3 measurable monthly targets (revenue, orders, customers)",
      "Identify your single biggest operational bottleneck",
    ],
    month2: [
      "Implement a basic stock/inventory tracking system",
      "Review and measure last month's targets",
      "Create a simple customer order tracking process",
    ],
  },
  "Market Position": {
    month1: [
      "Write a one-paragraph description of your target customer",
      "List your top 3 competitors and their pricing",
      "Collect at least 5 written customer testimonials",
    ],
    month2: [
      "Define what makes your business uniquely better",
      "Survey 10 customers to understand their key pain points",
      "Develop one new offer based on customer feedback",
    ],
  },
  "Legal & Compliance": {
    month1: [
      "Confirm your business is formally registered (CAC)",
      "Check all licenses and permits are current",
      "File any overdue tax returns",
    ],
    month2: [
      "Set up a calendar reminder for all renewal deadlines",
      "Consult an accountant about your current tax obligations",
      "Ensure all staff contracts are documented",
    ],
  },
  "Human Resources": {
    month1: [
      "Write clear job descriptions for each role in your business",
      "Create a simple staff performance tracking sheet",
      "Document your leave and absence policy",
    ],
    month2: [
      "Schedule one training session or workshop for staff",
      "Hold individual check-ins with each team member",
      "Review salaries against market rates",
    ],
  },
  "Technology & Innovation": {
    month1: [
      "Sign up for a free accounting tool (Wave, Zoho Books)",
      "Create or update your Google Business profile",
      "Start collecting customer emails into a simple list",
    ],
    month2: [
      "Set up WhatsApp Business for customer communication",
      "Post consistently on one social media channel for 30 days",
      "Explore one digital tool that could save 2+ hours per week",
    ],
  },
};

const DEFAULT_TIPS = [
  "Review this area with a certified business consultant",
  "Set specific, measurable goals for this section",
  "Track weekly progress and review monthly",
];

export function BhcActionPlan({ assessmentId, sectionScores, percentage }: Props) {
  const storageKey = `bhc_plan_${assessmentId}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const toggle = (key: string) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Build plan from the 3 weakest sections
  const weakest = [...sectionScores]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  const month3Actions = [
    "Retake your BHC assessment to measure improvement",
    "Compare your new score section by section",
    "Apply to matched lenders if score ≥ 70",
  ];

  const totalTasks = weakest.reduce((acc, s) => {
    const plan = PLAN_BY_SECTION[s.name];
    return acc + (plan ? plan.month1.length + plan.month2.length : DEFAULT_TIPS.length);
  }, 0) + month3Actions.length;

  const completedTasks = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🗓️</span>
              <h2 className="font-extrabold text-navy-900">90-Day Improvement Plan</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Personalised roadmap based on your {sectionScores.length} scored sections.
              Tick off tasks as you complete them.
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-extrabold text-navy-900">{progress}%</p>
            <p className="text-xs text-gray-400">complete</p>
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-navy-900 to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Month 1 & 2 — weakest sections */}
        {weakest.map((section, idx) => {
          const plan = PLAN_BY_SECTION[section.name];
          const monthTasks = [
            ...(plan?.month1 ?? DEFAULT_TIPS).map((t) => ({ task: t, month: idx * 2 + 1 })),
            ...(plan?.month2 ?? []).map((t) => ({ task: t, month: idx * 2 + 2 })),
          ];

          return (
            <div key={section.name} className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-navy-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{idx + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-navy-900 text-sm">{section.name}</p>
                  <p className="text-xs text-gray-400">Current score: {section.percentage}% · Focus: Month {idx * 2 + 1}–{idx * 2 + 2}</p>
                </div>
              </div>
              <div className="space-y-2 ml-9">
                {monthTasks.map(({ task, month }) => {
                  const key = `${section.name}::${task}`;
                  return (
                    <label key={key} className="flex items-start gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        checked[key]
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-gray-300 group-hover:border-navy-900"
                      }`}
                        onClick={() => toggle(key)}
                      >
                        {checked[key] && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <span className={`text-sm transition-colors ${checked[key] ? "line-through text-gray-400" : "text-gray-700"}`}>
                          {task}
                        </span>
                        <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          Month {month}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Month 3 — retake */}
        <div className="p-5 bg-navy-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">↺</span>
            </div>
            <div>
              <p className="font-bold text-navy-900 text-sm">Month 3 — Measure & Apply</p>
              <p className="text-xs text-gray-400">Validate your progress and take action</p>
            </div>
          </div>
          <div className="space-y-2 ml-9">
            {month3Actions.map((task) => {
              const key = `month3::${task}`;
              return (
                <label key={key} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    checked[key]
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-gray-300 group-hover:border-red-500"
                  }`}
                    onClick={() => toggle(key)}
                  >
                    {checked[key] && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${checked[key] ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {task}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
