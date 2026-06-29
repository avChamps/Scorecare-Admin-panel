"use client";

import { ClipboardEvent, FormEvent, KeyboardEvent, UIEvent, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { API_BASE_URL } from "./api/api";

const menuIcons: Record<string, ReactNode> = {
  Dashboard: (
    <svg viewBox="0 0 24 24">
      <path d="M4 4h6v8H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 16h6v4H4z" />
    </svg>
  ),
  General: (
    <svg viewBox="0 0 24 24">
      <path d="M10.3 4.3 11 2h2l.7 2.3 1.7.7 2.1-1.1 1.4 1.4-1.1 2.1.7 1.7L21 10v2l-2.3.7-.7 1.7 1.1 2.1-1.4 1.4-2.1-1.1-1.7.7L13 22h-2l-.7-2.3-1.7-.7-2.1 1.1-1.4-1.4 1.1-2.1-.7-1.7L3 12v-2l2.3-.7.7-1.7-1.1-2.1 1.4-1.4L8.6 5z" />
      <path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
    </svg>
  ),
  "Site Settings": (
    <svg viewBox="0 0 24 24">
      <path d="M4 5h16v12H4z" />
      <path d="M4 9h16M8 21h8M10 17l-1 4M14 17l1 4" />
    </svg>
  ),
  "Plans & Benefits": (
    <svg viewBox="0 0 24 24">
      <path d="M4 11h16v9H4zM4 11a4 4 0 0 1 4-4c2 0 4 4 4 4s2-4 4-4a4 4 0 0 1 4 4M12 7v13M4 15h16" />
    </svg>
  ),
  Services: (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h16v12H4zM8 7V4h8v3M9 12h6M12 9v6" />
    </svg>
  ),
  Revenue: (
    <svg viewBox="0 0 24 24">
      <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5M15 6v4M13 8h4" />
    </svg>
  ),
  Users: (
    <svg viewBox="0 0 24 24">
      <path d="M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
      <path d="M3 21v-1a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1M16 3.1a4 4 0 0 1 0 7.8M21 21v-1a4 4 0 0 0-3-3.85" />
    </svg>
  ),
  Subscriptions: (
    <svg viewBox="0 0 24 24">
      <path d="M4 7h16v10H4zM4 11h16" />
      <path d="M8 15h3" />
    </svg>
  ),
  Loans: (
    <svg viewBox="0 0 24 24">
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4M9 13h5a2 2 0 0 1 0 4h-2M12 11v8" />
    </svg>
  ),
  Chats: (
    <svg viewBox="0 0 24 24">
      <path d="M5 6h14v10H8l-3 3z" />
      <path d="M9 10h6M9 13h4" />
    </svg>
  ),
  FAQ: (
    <svg viewBox="0 0 24 24">
      <path d="M12 19v.01" />
      <path d="M12 15a2 2 0 0 1 1-1.7 3 3 0 1 0-4-2.8" />
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20" />
    </svg>
  ),
  "Homepage Themes": (
    <svg viewBox="0 0 24 24">
      <path d="M4 5h16v14H4z" />
      <path d="m4 15 4-4 4 4 3-3 5 5" />
      <path d="M15 9h.01" />
    </svg>
  ),
  "Legal Center": (
    <svg viewBox="0 0 24 24">
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  ),
  Notifications: (
    <svg viewBox="0 0 24 24">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 6 3 9H3c0-3 3-2 3-9" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  Feedback: (
    <svg viewBox="0 0 24 24">
      <path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
    </svg>
  ),
  "Contact Us": (
    <svg viewBox="0 0 24 24">
      <path d="M4 5h16v14H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  Reports: (
    <svg viewBox="0 0 24 24">
      <path d="M6 3h9l3 3v15H6zM14 3v4h4M9 16v-3M12 16V9M15 16v-5" />
    </svg>
  ),
  "API Logs": (
    <svg viewBox="0 0 24 24">
      <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
    </svg>
  ),
};
const dashboardIcons: Record<string, ReactNode> = {
  users: menuIcons.Users,
  revenue: (
    <svg viewBox="0 0 24 24">
      <path d="M7 5h10M7 9h10M8 5c5 0 6 7 0 7h-1l8 7M7 12h4" />
    </svg>
  ),
  subscriptions: menuIcons.Subscriptions,
  reports: (
    <svg viewBox="0 0 24 24">
      <path d="M6 3h9l3 3v15H6zM14 3v4h4M9 16v-3M12 16V9M15 16v-5" />
    </svg>
  ),
  messages: menuIcons.Chats,
  feedback: menuIcons.Feedback,
  notifications: menuIcons.Notifications,
  employees: menuIcons.Users,
  roles: (
    <svg viewBox="0 0 24 24">
      <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6zM9 12l2 2 4-4" />
    </svg>
  ),
  apiLogs: menuIcons["API Logs"],
};
const loanTypeOptions = [
  { label: "Personal Loan", value: "personal" },
  { label: "Overdraft Loan", value: "overdraft" },
  { label: "Home Loan", value: "home" },
  { label: "Business Loan", value: "business" },
  { label: "MSME Loan", value: "msme" },
  { label: "Loan Against Property", value: "loan_against_property" },
];
const loanStatusOptions = ["submitted", "in_review", "approved", "rejected"];
const creditRepairStatusOptions = ["upload_document", "submitted", "under_review", "analysis", "in_progress", "resolved", "closed", "cancelled"];
const disputeStatusOptions = ["submitted", "under_review", "resolved", "rejected", "closed", "cancelled"];
const emptyAdminPlanForm: AdminPlanForm = {
  publicId: "",
  planName: "",
  amount: "",
  gstPercentage: "",
  currency: "INR",
  offerTag: "",
  recommendedFor: "",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  benefits: "",
  features: "",
  buttonLabel: "Subscribe Now",
  skipLabel: "Skip",
  displayOrder: "1",
  isActive: true,
};
const emptyCibilRepairContent: CibilRepairContent = {
  plans: [],
  timelines: [],
};
const emptyBasicPlanForm: BasicPlanForm = {
  publicId: "",
  planName: "",
  amount: "",
  gstPercentage: "",
  razorpayPlanId: "",
  currency: "INR",
  offerTag: "",
  recommendedFor: "",
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  benefits: [],
  comparisonBenefits: [],
  buttonLabel: "Choose Basic",
  skipLabel: "Skip",
  displayOrder: "1",
  isActive: true,
};

type DashboardCounts = {
  totalUsers: number;
  newUsers: number;
  subscriptions: number;
  amount: number;
  revenue?: {
    total: number;
    subscriptions: number;
    cibilRepair: number;
  };
  upcomingOverdues: number;
  totalMessages: number;
  totalFeedback?: number;
  totalCreditReports?: number;
  reportsWithScore?: number;
  totalNotifications?: number;
  unreadNotifications?: number;
  apiHistoryCount?: number;
  employees?: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  roles?: {
    total: number;
    active: number;
    inactive: number;
  };
  loans: {
    applied: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  graphs: {
    usersByAccessType: Array<{ label: string; count: number; percentage: number }>;
    subscriptionsByStatus: Array<{ label: string; count: number; percentage: number }>;
    loansByStatus: Array<{ label: string; count: number; percentage: number }>;
    cibilRepairByStatus?: Array<{ label: string; count: number; percentage: number }>;
    disputesByStatus?: Array<{ label: string; count: number; percentage: number }>;
    feedbackByRating?: Array<{ label: number; count: number; percentage: number }>;
    monthlyRecords: Array<{ label: string; users: number; messages: number; loans: number }>;
  };
};

type AdminUser = {
  token?: string;
  tokenType?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  isAdmin?: boolean;
  loginEventId?: string;
};

type AppView = "Dashboard" | "General" | "Website Settings" | "Homepage Themes" | "Legal Center" | "Notifications" | "Plans & Benefits" | "Basic Plan" | "Credit Repair" | "Disputes" | "Basic Subscription" | "Repair Service Subscription" | "Basic Subscriptions" | "Repair Subscriptions" | "Users" | "Employees" | "Roles" | "Login History" | "Loans" | "Chats" | "FAQs" | "Feedback" | "Contact Us" | "Report Downloads" | "Download CIBIL" | "Manual Report" | "API Logs";

type ManualReportType = "experian" | "cibil" | "crif";

type UserMenuAccess = {
  menuName: string;
  childMenuName: string | null;
  permissions: string[];
};

const viewRoutes: Record<AppView, string> = {
  Dashboard: "/dashboard",
  General: "/general",
  "Website Settings": "/website-settings",
  "Homepage Themes": "/homepage-themes",
  "Legal Center": "/legal-center",
  Notifications: "/notifications",
  "Plans & Benefits": "/plans-benefits",
  "Basic Plan": "/basic-plan",
  "Credit Repair": "/services/credit-repair",
  Disputes: "/services/disputes",
  "Basic Subscription": "/revenue/basic-subscriptions",
  "Repair Service Subscription": "/revenue/repair-service-subscriptions",
  Users: "/users",
  Employees: "/employees",
  Roles: "/roles",
  "Login History": "/login-history",
  "Basic Subscriptions": "/subscriptions",
  "Repair Subscriptions": "/subscriptions/repair",
  Loans: "/loans",
  Chats: "/chat",
  FAQs: "/faqs",
  Feedback: "/feedback",
  "Contact Us": "/contact-us",
  "Report Downloads": "/reports/downloads",
  "Download CIBIL": "/reports/download-cibil",
  "Manual Report": "/reports/manual-report",
  "API Logs": "/api-logs",
};

const routeViews: Record<string, AppView> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/general": "General",
  "/website-settings": "Website Settings",
  "/homepage-themes": "Homepage Themes",
  "/legal-center": "Legal Center",
  "/notifications": "Notifications",
  "/faqs": "FAQs",
  "/plans-benefits": "Plans & Benefits",
  "/basic-plan": "Basic Plan",
  "/services/credit-repair": "Credit Repair",
  "/services/disputes": "Disputes",
  "/revenue/basic-subscriptions": "Basic Subscription",
  "/revenue/repair-service-subscriptions": "Repair Service Subscription",
  "/feedback": "Feedback",
  "/contact-us": "Contact Us",
  "/reports/downloads": "Report Downloads",
  "/reports/download-cibil": "Download CIBIL",
  "/reports/manual-report": "Manual Report",
  "/api-logs": "API Logs",
  "/users": "Users",
  "/employees": "Employees",
  "/roles": "Roles",
  "/login-history": "Login History",
  "/subscriptions": "Basic Subscriptions",
  "/subscriptions/repair": "Repair Subscriptions",
  "/loans": "Loans",
  "/chat": "Chats",
};

const viewAccessMap: Record<AppView, { menuName: string; childMenuName: string | null }> = {
  Dashboard: { menuName: "Dashboard", childMenuName: null },
  General: { menuName: "General", childMenuName: "Site Settings" },
  "Website Settings": { menuName: "General", childMenuName: "Website Settings" },
  "Homepage Themes": { menuName: "General", childMenuName: "Homepage Themes" },
  "Legal Center": { menuName: "General", childMenuName: "Legal Center" },
  Notifications: { menuName: "General", childMenuName: "Notifications" },
  "Plans & Benefits": { menuName: "Plans & Benefits", childMenuName: "Repair service" },
  "Basic Plan": { menuName: "Plans & Benefits", childMenuName: "Basic plan" },
  "Credit Repair": { menuName: "Credit Repair", childMenuName: "Repair Requests" },
  Disputes: { menuName: "Disputes", childMenuName: null },
  "Basic Subscription": { menuName: "Revenue", childMenuName: "Basic Subscription" },
  "Repair Service Subscription": { menuName: "Revenue", childMenuName: "Repair Service Subscription" },
  Users: { menuName: "User management", childMenuName: "Users" },
  Employees: { menuName: "Employee management", childMenuName: "Employees" },
  Roles: { menuName: "Employee management", childMenuName: "Roles" },
  "Login History": { menuName: "Employee management", childMenuName: "Login History" },
  "Basic Subscriptions": { menuName: "Subscriptions", childMenuName: "Basic Subscriptions" },
  "Repair Subscriptions": { menuName: "Subscriptions", childMenuName: "Repair Subscriptions" },
  Loans: { menuName: "Loans", childMenuName: null },
  Chats: { menuName: "Chats", childMenuName: null },
  FAQs: { menuName: "General", childMenuName: "FAQ" },
  Feedback: { menuName: "Feedback", childMenuName: null },
  "Contact Us": { menuName: "Contact Us", childMenuName: null },
  "Report Downloads": { menuName: "Reports", childMenuName: "Downloads" },
  "Download CIBIL": { menuName: "Reports", childMenuName: "Download CIBIL" },
  "Manual Report": { menuName: "Reports", childMenuName: "Manual Report" },
  "API Logs": { menuName: "API Logs", childMenuName: null },
};

type ActionIconType = "add" | "edit" | "delete" | "back";

type HtmlEditorCommand = "bold" | "italic" | "underline" | "insertUnorderedList" | "insertOrderedList";

type HtmlEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function HtmlEditor({ label, value, onChange }: HtmlEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  function updateValue() {
    onChange(editorRef.current?.innerHTML || "");
  }

  function runCommand(command: HtmlEditorCommand) {
    editorRef.current?.focus();
    document.execCommand(command);
    updateValue();
  }

  function setBlock(block: string) {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, block);
    updateValue();
  }

  function addLink() {
    const url = window.prompt("Enter URL");

    if (!url) {
      return;
    }

    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    updateValue();
  }

  return (
    <section className="html-editor-field">
      <div className="html-editor-label">{label}</div>
      <div className="html-editor-toolbar">
        <select defaultValue="" onChange={(event) => event.target.value && setBlock(event.target.value)}>
          <option value="" disabled>Format</option>
          <option value="p">Paragraph</option>
          <option value="h2">Heading</option>
        </select>
        <button type="button" onClick={() => runCommand("bold")}>B</button>
        <button type="button" onClick={() => runCommand("italic")}>I</button>
        <button type="button" onClick={() => runCommand("underline")}>U</button>
        <button type="button" onClick={() => runCommand("insertUnorderedList")}>Bullets</button>
        <button type="button" onClick={() => runCommand("insertOrderedList")}>Numbers</button>
        <button type="button" onClick={addLink}>Link</button>
      </div>
      <div
        className="html-editor-box"
        contentEditable
        ref={editorRef}
        onBlur={updateValue}
        onInput={updateValue}
        role="textbox"
        suppressContentEditableWarning
      />
    </section>
  );
}

function ActionIcon({ type }: { type: ActionIconType }) {
  if (type === "back") {
    return (
      <svg className="button-icon" viewBox="0 0 24 24">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    );
  }

  if (type === "add") {
    return (
      <svg className="button-icon" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (type === "edit") {
    return (
      <svg className="button-icon" viewBox="0 0 24 24">
        <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
        <path d="m13.5 6.5 4 4" />
      </svg>
    );
  }

  return (
    <svg className="button-icon" viewBox="0 0 24 24">
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </svg>
  );
}

function DateFilter({ label, value, onChange, className = "" }: { label: string; value: string; onChange: (value: string) => void; className?: string }) {
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [visibleDate, setVisibleDate] = useState(selectedDate || new Date());
  const monthStart = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1);
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });

  useEffect(() => {
    function closePicker(event: MouseEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closePicker);
    return () => document.removeEventListener("mousedown", closePicker);
  }, []);

  function formatInputDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateValue: string) {
    if (!dateValue) {
      return label;
    }

    const [year, month, day] = dateValue.split("-");
    return `${day}/${month}/${year}`;
  }

  function moveMonth(step: number) {
    setVisibleDate((date) => new Date(date.getFullYear(), date.getMonth() + step, 1));
  }

  return (
    <div className={`date-filter ${className}`} ref={pickerRef}>
      <button className={`date-filter-trigger ${value ? "selected" : ""}`} type="button" onClick={() => setIsOpen((current) => !current)}>
        <span>{formatDisplayDate(value)}</span>
        <svg viewBox="0 0 24 24">
          <path d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
        </svg>
      </button>
      {isOpen ? (
        <div className="date-picker-popover">
          <div className="date-picker-header">
            <button type="button" onClick={() => moveMonth(-1)}>‹</button>
            <strong>{visibleDate.toLocaleString("default", { month: "long", year: "numeric" })}</strong>
            <button type="button" onClick={() => moveMonth(1)}>›</button>
          </div>
          <div className="date-picker-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="date-picker-days">
            {days.map((date) => {
              const dateValue = formatInputDate(date);
              const isMuted = date.getMonth() !== visibleDate.getMonth();
              const isSelected = value === dateValue;
              const isToday = formatInputDate(new Date()) === dateValue;

              return (
                <button
                  className={`${isMuted ? "muted" : ""} ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                  key={dateValue}
                  type="button"
                  onClick={() => {
                    onChange(dateValue);
                    setIsOpen(false);
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="date-picker-footer">
            <button type="button" onClick={() => onChange("")}>Clear</button>
            <button type="button" onClick={() => {
              onChange(formatInputDate(new Date()));
              setVisibleDate(new Date());
              setIsOpen(false);
            }}>
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type UserRow = {
  id: string;
  publicId: string;
  fullName: string | null;
  mobileNumber: string;
  email: string | null;
  panNumber?: string | null;
  dob?: string | null;
  dateOfBirth?: string | null;
  isAdmin?: boolean;
  status: string;
  accessType: string;
  subscriptionStatus: string;
  subscriptionAmount?: number | string | null;
  latestSubscriptionAmount?: number | string | null;
  subscriptionStartedAt: string | null;
  subscriptionDueAt: string | null;
  subscriptionEndsAt?: string | null;
  planUpdatedByUserName?: string | null;
  planUpdatedBy?: string | null;
  creditScore: string | null;
  creditScoreLastCheckedAt?: string | null;
  totalMessages: number;
  loans: {
    total: number;
    latestStatus: string | null;
    latestAppliedAt?: string | null;
  };
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
};

type UserDetail = {
  user: UserRow;
  kycStatus: Record<string, { status: string; verifiedAt?: string | null; completedAt?: string | null }>;
  bureauScores: Array<{ bureau?: string; name?: string; reportType?: string | null; score?: number | string | null; creditScore?: number | string | null; providerStatusCode?: number | null; providerMessage?: string | null; status?: string | null; syncedAt?: string | null; lastSyncedAt?: string | null }>;
  recentActivity: Array<{ type: string; label: string; status: string; amount?: number | string | null; currency?: string | null; occurredAt: string | null }>;
};

type SubscriptionPlan = {
  id: string;
  publicId: string;
  planName: string;
  billingCycle?: string | null;
  amount: number;
  gstPercentage?: number;
  currency: string;
  offerTag: string | null;
  recommendedFor: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  benefits?: string[];
  features?: string[];
  buttonLabel?: string | null;
  skipLabel?: string | null;
  displayOrder?: number;
  isActive?: boolean;
};

type AdminPlanForm = {
  publicId: string;
  planName: string;
  amount: string;
  gstPercentage: string;
  currency: string;
  offerTag: string;
  recommendedFor: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  benefits: string;
  features: string;
  buttonLabel: string;
  skipLabel: string;
  displayOrder: string;
  isActive: boolean;
};

type ComparisonBenefit = {
  benefit: string;
  free: boolean;
  scorecarePro: boolean;
};

type BasicPlanBenefit = {
  title: string;
  description: string;
};

type BasicPlanForm = Omit<AdminPlanForm, "benefits" | "features"> & {
  gstPercentage: string;
  razorpayPlanId: string;
  benefits: BasicPlanBenefit[];
  comparisonBenefits: ComparisonBenefit[];
};

type CibilRepairPlan = {
  publicId: string;
  planName: string;
  amount: number | string;
  gstPercentage: number | string;
  offerTag: string;
};

type CibilRepairTimeline = {
  publicId?: string;
  localId?: string;
  displayOrder: number | string;
  title: string;
  description: string;
  isActive: boolean;
};

type CibilRepairContent = {
  plans: CibilRepairPlan[];
  timelines: CibilRepairTimeline[];
};

type UsersResponse = {
  users: UserRow[];
  counts?: {
    otp_login_no_pan?: number;
    pan_submitted?: number;
    checkout_started?: number;
    subscribed?: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type CreditReportDownload = {
  id: number;
  creditReportId: number | null;
  reportType: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  panNumber: string | null;
  provider: string | null;
  clientId: string | null;
  creditScore: string | null;
  reportFetchedAt: string | null;
  downloadedAt: string;
  createdAt: string;
};

type CreditReportDownloadsResponse = {
  downloads: CreditReportDownload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type CreditBureauApiHit = {
  publicId: string;
  bureauType: string;
  operationType: string;
  endpoint: string;
  httpMethod: string;
  mobile: string | null;
  pan: string | null;
  clientId: string | null;
  requestPayload?: unknown;
  responsePayload?: unknown;
  success: boolean;
  httpStatus: number | null;
  errorMessage: string | null;
  durationMs: number;
  requestedByUserName: string | null;
  requestedByEmployeeCode: string | null;
  requestedByEmployeeName: string | null;
  createdAt: string;
};

type CreditBureauApiHitsResponse = {
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageDurationMs: number;
  };
  hits: CreditBureauApiHit[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ManualCreditReportDownload = {
  id: string;
  type: ManualReportType;
  clientId: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  mobile: string;
  pan: string;
  gender: string | null;
  creditScore: string | null;
  creditReportLink: string | null;
  hasPdf: boolean;
  providerStatusCode: number | null;
  providerMessage: string | null;
  downloadedByUserName: string | null;
  downloadedByEmployeeName: string | null;
  downloadedAt: string;
};

type ManualCreditReportDownloadsResponse = {
  downloads: ManualCreditReportDownload[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EmployeeRow = {
  id?: number;
  publicId: string;
  employeeCode: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: string;
  rolePublicId?: string | null;
  department: string;
  designation: string;
  status: string;
  joinedAt: string | null;
  createdAt?: string;
};

type EmployeesResponse = {
  employees: EmployeeRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EmployeeForm = {
  fullName: string;
  mobileNumber: string;
  email: string;
  role: string;
  rolePublicId: string;
  department: string;
  designation: string;
  status: string;
  joinedAt: string;
};

type EmployeeMenuAccess = {
  menuName: string;
  childMenuName: string | null;
  permissions: string[];
};

type EmployeeRole = {
  publicId: string;
  roleName: string;
  description?: string | null;
  status: string;
  menuAccess?: EmployeeMenuAccess[];
  createdAt?: string;
};

type EmployeeRolesResponse = {
  roles?: EmployeeRole[];
  employeeRoles?: EmployeeRole[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EmployeeLoginEvent = {
  publicId?: string;
  id?: string | number;
  employeeCode?: string;
  employeeName?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  loginAt?: string;
  loggedInAt?: string;
  logoutAt?: string | null;
  loggedOutAt?: string | null;
  createdAt?: string;
};

type EmployeeLoginEventsResponse = {
  loginEvents: EmployeeLoginEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EmployeeRoleForm = {
  roleName: string;
  description: string;
  status: string;
  menuAccess: EmployeeMenuAccess[];
};

type LoanRow = {
  id: number;
  user: {
    fullName: string;
    mobileNumber: string;
    panNumber: string;
    email: string;
  };
  loanAmount: number;
  loanType: string;
  employmentType: string;
  monthlyIncome: number;
  workExperience: string;
  status: string;
  remarks: string | null;
  updatedBy: {
    fullName: string;
    mobileNumber: string;
  } | null;
  createdAt: string;
};

type LoansResponse = {
  loans: LoanRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type CreditRepairRequest = {
  id: string;
  publicId: string;
  userId: string;
  userPublicId: string;
  userName: string;
  email: string;
  mobileNumber: string;
  planId: string;
  planPublicId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  repairStatus: string;
  activeDisputes: number;
  resolvedDisputes: number;
  activeRepairRequests?: number;
  resolvedRepairRequests?: number;
  closedRepairRequests?: number;
  cancelledRepairRequests?: number;
  totalRepairRequests?: number;
  pointsGained: number;
  progressItems: unknown[];
  remarks?: string | null;
  bureau?: string | null;
  assignedEmployee?: {
    publicId: string;
    fullName: string;
  } | null;
  timeline?: Array<{
    id: number | string;
    title?: string | null;
    description?: string | null;
    actorName?: string | null;
    createdAt?: string | null;
  }>;
  accounts: Array<{
    id?: number | string;
    issueType: string;
    accountType: string;
    accountNumber: string;
    subscriberName: string;
    disputeStatus?: string | null;
    documents?: Record<string, string> | null;
  }>;
  documents?: Array<{
    id: number | string;
    documentType?: string | null;
    documentUrl?: string | null;
    fileSize?: string | null;
    accountNumber?: string | null;
    accountType?: string | null;
    closingDate?: string | null;
    createdAt?: string | null;
  }>;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type DisputeRequest = {
  id: string;
  publicId: string;
  userId: string;
  userPublicId: string;
  userName: string;
  email: string;
  mobileNumber: string;
  accountData: {
    lenderName: string;
    accountType: string;
    accountNumber: string;
  };
  lenderName: string;
  accountNumber: string;
  errorType: string;
  bureaus: string[];
  additionalDetails?: string | null;
  documents?: Record<string, string> | null;
  status: string;
  progressStep: number;
  pointsGained: number;
  remarks?: string | null;
  submittedAt?: string | null;
  resolvedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ServicePagination = {
  page: number;
  totalPages: number;
  total: number;
};

type CreditRepairRequestsResponse = {
  requests: CreditRepairRequest[];
  pagination?: ServicePagination;
};

type DisputesResponse = {
  disputes: DisputeRequest[];
  pagination?: ServicePagination;
};

type BasicSubscriptionRow = {
  id?: string;
  publicId?: string;
  userName?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  planName?: string;
  amount?: number;
  currency?: string;
  status?: string;
  subscriptionStatus?: string;
  paymentStatus?: string;
  razorpaySubscriptionId?: string | null;
  subscriptionStartedAt?: string | null;
  subscriptionDueAt?: string | null;
  subscriptionEndsAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  user?: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
  } | null;
};

type BasicSubscriptionsResponse = {
  subscriptions: BasicSubscriptionRow[];
  pagination?: ServicePagination;
};

type ChatQuestionRow = {
  id: number;
  question: string;
  createdAt: string;
};

type ChatUserRow = {
  userId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  panNumber: string;
  totalChats: number;
  latestChatAt: string;
  questions: ChatQuestionRow[];
};

type ChatsResponse = {
  users: ChatUserRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type FeedbackRow = {
  id: number;
  userId: number;
  rating: number;
  message: string;
  isLiked: boolean;
  isDisliked: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    publicId: string;
    fullName: string;
    mobileNumber: string;
    email: string;
  };
};

type FeedbackResponse = {
  feedbacks: FeedbackRow[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ContactRequestRow = {
  id?: number;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  fullName?: string;
  name?: string;
  mobileNumber?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
  createdAt?: string;
};

type ContactRequestsResponse = {
  contactRequests: ContactRequestRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type AdminNotificationRow = {
  id?: number | string;
  publicId?: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  readAt?: string | null;
  scope?: string;
  screen?: string;
  data?: {
    screen?: string;
    source?: string;
    batchId?: string;
  };
  imageUrl?: string | null;
  createdAt?: string;
  user?: {
    fullName?: string;
    mobileNumber?: string;
    email?: string;
  };
};

type AdminNotificationsResponse = {
  notifications: AdminNotificationRow[];
  unreadCount?: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type GeneralSettings = {
  website: string;
  email: string;
  mobileNumber: string;
  whatsappNumber: string;
  selectedLanguage: string;
  address: string;
  prompt_message: string;
};

const emptyGeneralSettings: GeneralSettings = {
  website: "",
  email: "",
  mobileNumber: "",
  whatsappNumber: "",
  selectedLanguage: "",
  address: "",
  prompt_message: "",
};

function normalizeGeneralSettings(settings?: Partial<GeneralSettings> | null, fallback = emptyGeneralSettings): GeneralSettings {
  return {
    website: settings?.website ?? fallback.website ?? "",
    email: settings?.email ?? fallback.email ?? "",
    mobileNumber: settings?.mobileNumber ?? fallback.mobileNumber ?? "",
    whatsappNumber: settings?.whatsappNumber ?? fallback.whatsappNumber ?? "",
    selectedLanguage: settings?.selectedLanguage ?? fallback.selectedLanguage ?? "",
    address: settings?.address ?? fallback.address ?? "",
    prompt_message: settings?.prompt_message ?? fallback.prompt_message ?? "",
  };
}

type WebsiteSettingsFiles = {
  privacyPolicy: File | null;
  termsOfService: File | null;
  disclaimer: File | null;
  accountDeletion: File | null;
};

type WebsiteSettingsResponse = {
  privacyPolicy: string;
  termsOfService: string;
  disclaimer: string;
  accountDeletion: string;
  updatedAt: string;
};

type HomepageTheme = {
  id?: number;
  imageName: string;
  fileName: string;
  isActive: boolean;
};

type LegalContent = {
  id?: number;
  termsAndConditions: string;
  privacyPolicy: string;
  consent: string;
  createdAt?: string;
  updatedAt?: string;
};

type HomepageThemeForm = HomepageTheme & {
  image: File | null;
  originalImageName: string;
};

type FaqQuestion = {
  id?: string;
  publicId?: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
};

type FaqCategory = {
  category: string;
  categoryLabel: string;
  icon: string;
  questions: FaqQuestion[];
};

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp" | "authenticator" | "admin">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [authenticatorCode, setAuthenticatorCode] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [authenticatorSetup, setAuthenticatorSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [resendSeconds, setResendSeconds] = useState(45);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [userMenuAccess, setUserMenuAccess] = useState<UserMenuAccess[]>([]);
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts | null>(null);
  const [dashboardFromDate, setDashboardFromDate] = useState("");
  const [dashboardToDate, setDashboardToDate] = useState("");
  const [error, setError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGeneralMenuOpen, setIsGeneralMenuOpen] = useState(false);
  const [isUserManagementMenuOpen, setIsUserManagementMenuOpen] = useState(false);
  const [isEmployeeManagementMenuOpen, setIsEmployeeManagementMenuOpen] = useState(false);
  const [isSubscriptionsMenuOpen, setIsSubscriptionsMenuOpen] = useState(false);
  const [isPlansBenefitsMenuOpen, setIsPlansBenefitsMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isRevenueMenuOpen, setIsRevenueMenuOpen] = useState(false);
  const [isReportsMenuOpen, setIsReportsMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("Dashboard");
  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersFromDate, setUsersFromDate] = useState("");
  const [usersToDate, setUsersToDate] = useState("");
  const [usersStatus, setUsersStatus] = useState("otp_login_no_pan");
  const [usersError, setUsersError] = useState("");
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserDetail | null>(null);
  const [selectedUserError, setSelectedUserError] = useState("");
  const [isUserDetailLoading, setIsUserDetailLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportDownloadsData, setReportDownloadsData] = useState<CreditReportDownloadsResponse | null>(null);
  const [reportDownloadsSearch, setReportDownloadsSearch] = useState("");
  const [reportDownloadsFromDate, setReportDownloadsFromDate] = useState("");
  const [reportDownloadsToDate, setReportDownloadsToDate] = useState("");
  const [reportDownloadsError, setReportDownloadsError] = useState("");
  const [isReportDownloadsLoading, setIsReportDownloadsLoading] = useState(false);
  const [apiLogsData, setApiLogsData] = useState<CreditBureauApiHitsResponse | null>(null);
  const [apiLogsSearch, setApiLogsSearch] = useState("");
  const [apiLogsBureauType, setApiLogsBureauType] = useState("");
  const [apiLogsOperationType, setApiLogsOperationType] = useState("");
  const [apiLogsStatus, setApiLogsStatus] = useState("");
  const [apiLogsError, setApiLogsError] = useState("");
  const [isApiLogsLoading, setIsApiLogsLoading] = useState(false);
  const [cibilUsersData, setCibilUsersData] = useState<UsersResponse | null>(null);
  const [cibilUsersSearch, setCibilUsersSearch] = useState("");
  const [cibilUsersFromDate, setCibilUsersFromDate] = useState("");
  const [cibilUsersToDate, setCibilUsersToDate] = useState("");
  const [cibilUsersError, setCibilUsersError] = useState("");
  const [isCibilUsersLoading, setIsCibilUsersLoading] = useState(false);
  const [downloadingCibilUserId, setDownloadingCibilUserId] = useState<string | null>(null);
  const [manualReportForm, setManualReportForm] = useState({
    type: "experian" as ManualReportType,
    name: "",
    firstName: "",
    lastName: "",
    mobile: "",
    pan: "",
    gender: "male",
    consent: false,
  });
  const [manualReportError, setManualReportError] = useState("");
  const [isManualReportDownloading, setIsManualReportDownloading] = useState(false);
  const [manualReportTab, setManualReportTab] = useState<"download" | "downloads">("download");
  const [manualReportDownloadsData, setManualReportDownloadsData] = useState<ManualCreditReportDownloadsResponse | null>(null);
  const [manualReportDownloadsSearch, setManualReportDownloadsSearch] = useState("");
  const [manualReportDownloadsType, setManualReportDownloadsType] = useState("");
  const [manualReportDownloadsFromDate, setManualReportDownloadsFromDate] = useState("");
  const [manualReportDownloadsToDate, setManualReportDownloadsToDate] = useState("");
  const [manualReportDownloadsError, setManualReportDownloadsError] = useState("");
  const [isManualReportDownloadsLoading, setIsManualReportDownloadsLoading] = useState(false);
  const [downloadingManualReportId, setDownloadingManualReportId] = useState<string | null>(null);
  const [employeesData, setEmployeesData] = useState<EmployeesResponse | null>(null);
  const [employeesSearch, setEmployeesSearch] = useState("");
  const [employeesStatus, setEmployeesStatus] = useState("");
  const [employeesError, setEmployeesError] = useState("");
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);
  const [isEmployeeSaving, setIsEmployeeSaving] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeRow | null>(null);
  const [employeeRolesData, setEmployeeRolesData] = useState<EmployeeRolesResponse | null>(null);
  const [employeeMenuAccess, setEmployeeMenuAccess] = useState<EmployeeMenuAccess[]>([]);
  const [employeeRolesSearch, setEmployeeRolesSearch] = useState("");
  const [employeeRolesError, setEmployeeRolesError] = useState("");
  const [isEmployeeRolesLoading, setIsEmployeeRolesLoading] = useState(false);
  const [isEmployeeRoleModalOpen, setIsEmployeeRoleModalOpen] = useState(false);
  const [editingEmployeeRoleId, setEditingEmployeeRoleId] = useState<string | null>(null);
  const [expandedEmployeeRoleAccess, setExpandedEmployeeRoleAccess] = useState<string[]>([]);
  const [deletingEmployeeRole, setDeletingEmployeeRole] = useState<EmployeeRole | null>(null);
  const [loginEventsData, setLoginEventsData] = useState<EmployeeLoginEventsResponse | null>(null);
  const [loginEventsSearch, setLoginEventsSearch] = useState("");
  const [loginEventsFromDate, setLoginEventsFromDate] = useState("");
  const [loginEventsToDate, setLoginEventsToDate] = useState("");
  const [loginEventsError, setLoginEventsError] = useState("");
  const [isLoginEventsLoading, setIsLoginEventsLoading] = useState(false);
  const [employeeRoleForm, setEmployeeRoleForm] = useState<EmployeeRoleForm>({
    roleName: "",
    description: "",
    status: "active",
    menuAccess: [],
  });
  const [employeeForm, setEmployeeForm] = useState<EmployeeForm>({
    fullName: "",
    mobileNumber: "",
    email: "",
    role: "",
    rolePublicId: "",
    department: "",
    designation: "",
    status: "active",
    joinedAt: "",
  });
  const [selectedSubscriptionUser, setSelectedSubscriptionUser] = useState<UserRow | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [planAmount, setPlanAmount] = useState("");
  const [plansError, setPlansError] = useState("");
  const [isPlansLoading, setIsPlansLoading] = useState(false);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loansData, setLoansData] = useState<LoansResponse | null>(null);
  const [loansSearch, setLoansSearch] = useState("");
  const [loansStatus, setLoansStatus] = useState("");
  const [loansError, setLoansError] = useState("");
  const [isLoansLoading, setIsLoansLoading] = useState(false);
  const [isLoansExporting, setIsLoansExporting] = useState(false);
  const [creditRepairData, setCreditRepairData] = useState<CreditRepairRequestsResponse | null>(null);
  const [creditRepairError, setCreditRepairError] = useState("");
  const [isCreditRepairLoading, setIsCreditRepairLoading] = useState(false);
  const [selectedCreditRepair, setSelectedCreditRepair] = useState<CreditRepairRequest | null>(null);
  const [creditRepairStatus, setCreditRepairStatus] = useState("submitted");
  const [creditRepairRemarks, setCreditRepairRemarks] = useState("");
  const [creditRepairEmployeeId, setCreditRepairEmployeeId] = useState("");
  const [creditRepairUploadAccountNumber, setCreditRepairUploadAccountNumber] = useState("");
  const [creditRepairUploadFile, setCreditRepairUploadFile] = useState<File | null>(null);
  const [creditRepairWhatsappNotify, setCreditRepairWhatsappNotify] = useState(true);
  const [creditRepairEmailNotify, setCreditRepairEmailNotify] = useState(true);
  const [creditRepairWhatsappMessage, setCreditRepairWhatsappMessage] = useState("Your credit repair case status has been updated.");
  const [isCreditRepairDetailLoading, setIsCreditRepairDetailLoading] = useState(false);
  const [isUpdatingCreditRepair, setIsUpdatingCreditRepair] = useState(false);
  const [isAssigningCreditRepair, setIsAssigningCreditRepair] = useState(false);
  const [isUploadingCreditRepairDocument, setIsUploadingCreditRepairDocument] = useState(false);
  const [filingCreditRepairAccountId, setFilingCreditRepairAccountId] = useState<string | number | null>(null);
  const [isSendingCreditRepairWhatsapp, setIsSendingCreditRepairWhatsapp] = useState(false);
  const [disputesData, setDisputesData] = useState<DisputesResponse | null>(null);
  const [disputesError, setDisputesError] = useState("");
  const [isDisputesLoading, setIsDisputesLoading] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<DisputeRequest | null>(null);
  const [disputeStatus, setDisputeStatus] = useState("under_review");
  const [disputeRemarks, setDisputeRemarks] = useState("");
  const [isUpdatingDispute, setIsUpdatingDispute] = useState(false);
  const [basicSubscriptionsData, setBasicSubscriptionsData] = useState<BasicSubscriptionsResponse | null>(null);
  const [basicSubscriptionsSearch, setBasicSubscriptionsSearch] = useState("");
  const [basicSubscriptionsStatus, setBasicSubscriptionsStatus] = useState("active");
  const [basicSubscriptionsFromDate, setBasicSubscriptionsFromDate] = useState("");
  const [basicSubscriptionsToDate, setBasicSubscriptionsToDate] = useState("");
  const [basicSubscriptionsError, setBasicSubscriptionsError] = useState("");
  const [isBasicSubscriptionsLoading, setIsBasicSubscriptionsLoading] = useState(false);
  const [repairSubscriptionsData, setRepairSubscriptionsData] = useState<CreditRepairRequestsResponse | null>(null);
  const [repairSubscriptionsSearch, setRepairSubscriptionsSearch] = useState("");
  const [repairSubscriptionsStatus, setRepairSubscriptionsStatus] = useState("submitted");
  const [repairSubscriptionsPaymentStatus, setRepairSubscriptionsPaymentStatus] = useState("paid");
  const [repairSubscriptionsFromDate, setRepairSubscriptionsFromDate] = useState("");
  const [repairSubscriptionsToDate, setRepairSubscriptionsToDate] = useState("");
  const [repairSubscriptionsError, setRepairSubscriptionsError] = useState("");
  const [isRepairSubscriptionsLoading, setIsRepairSubscriptionsLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(emptyGeneralSettings);
  const [generalError, setGeneralError] = useState("");
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [isGeneralSaving, setIsGeneralSaving] = useState(false);
  const [hasLoadedGeneral, setHasLoadedGeneral] = useState(false);
  const generalFormSettings = normalizeGeneralSettings(generalSettings);
  const updateGeneralSetting = <K extends keyof GeneralSettings>(key: K, value: GeneralSettings[K]) => {
    setGeneralSettings((settings) => normalizeGeneralSettings({ ...settings, [key]: value }));
  };
  const [websiteSettingsFiles, setWebsiteSettingsFiles] = useState<WebsiteSettingsFiles>({
    privacyPolicy: null,
    termsOfService: null,
    disclaimer: null,
    accountDeletion: null,
  });
  const [websiteSettingsData, setWebsiteSettingsData] = useState<WebsiteSettingsResponse | null>(null);
  const [websiteSettingsError, setWebsiteSettingsError] = useState("");
  const [isWebsiteSettingsLoading, setIsWebsiteSettingsLoading] = useState(false);
  const [isWebsiteSettingsSaving, setIsWebsiteSettingsSaving] = useState(false);
  const [hasLoadedWebsiteSettings, setHasLoadedWebsiteSettings] = useState(false);
  const [homepageThemes, setHomepageThemes] = useState<HomepageTheme[]>([]);
  const [homepageThemeForm, setHomepageThemeForm] = useState<HomepageThemeForm>({
    imageName: "",
    fileName: "",
    isActive: true,
    image: null,
    originalImageName: "",
  });
  const [homepageThemesError, setHomepageThemesError] = useState("");
  const [isHomepageThemesLoading, setIsHomepageThemesLoading] = useState(false);
  const [savingHomepageTheme, setSavingHomepageTheme] = useState("");
  const [isHomepageThemeModalOpen, setIsHomepageThemeModalOpen] = useState(false);
  const [deletingHomepageTheme, setDeletingHomepageTheme] = useState<HomepageTheme | null>(null);
  const [isDeletingHomepageTheme, setIsDeletingHomepageTheme] = useState(false);
  const [hasLoadedHomepageThemes, setHasLoadedHomepageThemes] = useState(false);
  const [legalContent, setLegalContent] = useState<LegalContent>({
    termsAndConditions: "",
    privacyPolicy: "",
    consent: "",
  });
  const [legalContentError, setLegalContentError] = useState("");
  const [isLegalContentLoading, setIsLegalContentLoading] = useState(false);
  const [isLegalContentSaving, setIsLegalContentSaving] = useState(false);
  const [hasLoadedLegalContent, setHasLoadedLegalContent] = useState(false);
  const [notificationUsersData, setNotificationUsersData] = useState<UsersResponse | null>(null);
  const [notificationUserSearch, setNotificationUserSearch] = useState("");
  const [selectedNotificationUserIds, setSelectedNotificationUserIds] = useState<string[]>([]);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationImageUrl, setNotificationImageUrl] = useState("");
  const [notificationScreen, setNotificationScreen] = useState("home");
  const [notificationsTab, setNotificationsTab] = useState<"notifications" | "users">("notifications");
  const [notificationsSearch, setNotificationsSearch] = useState("");
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationModalScope, setNotificationModalScope] = useState<"all" | "users">("all");
  const [notificationsData, setNotificationsData] = useState<AdminNotificationsResponse | null>(null);
  const [appNotificationsData, setAppNotificationsData] = useState<AdminNotificationsResponse | null>(null);
  const [notificationsError, setNotificationsError] = useState("");
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isNotificationsPaging, setIsNotificationsPaging] = useState(false);
  const [isNotificationMarking, setIsNotificationMarking] = useState(false);
  const [isNotificationSending, setIsNotificationSending] = useState(false);
  const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
  const [faqsError, setFaqsError] = useState("");
  const [isFaqsLoading, setIsFaqsLoading] = useState(false);
  const [isFaqsSaving, setIsFaqsSaving] = useState(false);
  const [hasLoadedFaqs, setHasLoadedFaqs] = useState(false);
  const [adminPlans, setAdminPlans] = useState<SubscriptionPlan[]>([]);
  const [adminPlansError, setAdminPlansError] = useState("");
  const [isAdminPlansLoading, setIsAdminPlansLoading] = useState(false);
  const [isAdminPlanSaving, setIsAdminPlanSaving] = useState(false);
  const [hasLoadedAdminPlans, setHasLoadedAdminPlans] = useState(false);
  const [editingAdminPlanId, setEditingAdminPlanId] = useState<string | null>(null);
  const [adminPlanForm, setAdminPlanForm] = useState<AdminPlanForm>(emptyAdminPlanForm);
  const [plansBenefitsTab, setPlansBenefitsTab] = useState<"plans" | "repair" | "benefits">("repair");
  const [isAdminPlanModalOpen, setIsAdminPlanModalOpen] = useState(false);
  const [basicPlanForm, setBasicPlanForm] = useState<BasicPlanForm>(emptyBasicPlanForm);
  const [basicPlanTab, setBasicPlanTab] = useState<"plan" | "benefits" | "comparison">("plan");
  const [basicPlanError, setBasicPlanError] = useState("");
  const [isBasicPlanLoading, setIsBasicPlanLoading] = useState(false);
  const [isBasicPlanSaving, setIsBasicPlanSaving] = useState(false);
  const [hasLoadedBasicPlan, setHasLoadedBasicPlan] = useState(false);
  const [cibilRepairContent, setCibilRepairContent] = useState<CibilRepairContent>(emptyCibilRepairContent);
  const [cibilRepairError, setCibilRepairError] = useState("");
  const [isCibilRepairLoading, setIsCibilRepairLoading] = useState(false);
  const [isCibilRepairSaving, setIsCibilRepairSaving] = useState(false);
  const [hasLoadedCibilRepair, setHasLoadedCibilRepair] = useState(false);
  const [cibilRepairTab, setCibilRepairTab] = useState<"plans" | "timelines">("plans");
  const [deletingCibilRepairTimelineIndex, setDeletingCibilRepairTimelineIndex] = useState<number | null>(null);
  const newCibilRepairTimelineRef = useRef<HTMLElement | null>(null);
  const shouldScrollToNewCibilRepairTimeline = useRef(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackFromDate, setFeedbackFromDate] = useState("");
  const [feedbackToDate, setFeedbackToDate] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [contactRequestsData, setContactRequestsData] = useState<ContactRequestsResponse | null>(null);
  const [contactSearch, setContactSearch] = useState("");
  const [contactFromDate, setContactFromDate] = useState("");
  const [contactToDate, setContactToDate] = useState("");
  const [contactError, setContactError] = useState("");
  const [isContactLoading, setIsContactLoading] = useState(false);

  function loadAdminViewData(view: AppView) {
    if (view === "Dashboard" && adminUser?.token) {
      loadDashboardCounts(adminUser.token);
    }

    if (view === "General") {
      loadGeneralSettings();
    }

    if (view === "FAQs") {
      loadFaqs();
    }

    if (view === "Homepage Themes") {
      loadHomepageThemes();
    }

    if (view === "Legal Center") {
      loadLegalContent();
    }

    if (view === "Notifications") {
      setNotificationsTab("notifications");
      loadAppNotifications(1);
    }

    if (view === "Plans & Benefits") {
      loadAdminPlans();
      loadCibilRepairContent();
    }

    if (view === "Basic Plan") {
      loadBasicPlan();
    }

    if (view === "Credit Repair") {
      loadCreditRepairRequests();
    }

    if (view === "Disputes") {
      loadDisputes();
    }

    if (view === "Basic Subscription") {
      loadBasicSubscriptions();
    }

    if (view === "Repair Service Subscription") {
      loadRepairSubscriptions();
    }

    if (view === "Feedback") {
      loadFeedback();
    }

    if (view === "Contact Us") {
      loadContactRequests();
    }

    if (view === "Users" || view === "Basic Subscriptions") {
      loadUsers(1, usersSearch, view === "Basic Subscriptions", view === "Users" ? usersStatus : "");
    }

    if (view === "Repair Subscriptions") {
      loadRepairSubscriptions();
    }

    if (view === "Report Downloads") {
      loadReportDownloads();
    }

    if (view === "Download CIBIL") {
      loadCibilUsers();
    }

    if (view === "Manual Report") {
      loadManualReportDownloads();
    }

    if (view === "Employees") {
      loadEmployees();
      loadEmployeeRoles();
    }

    if (view === "Roles") {
      loadEmployeeRoles();
      loadEmployeeMenuAccess();
    }

    if (view === "Login History") {
      loadLoginEvents();
    }

    if (view === "Loans") {
      loadLoans();
    }

    if (view === "Chats") {
      loadChats();
    }
  }

  function openAdminView(view: AppView) {
    if (!hasViewPermission(view)) {
      return;
    }

    setActiveView(view);
    window.history.pushState(null, "", viewRoutes[view]);
    loadAdminViewData(view);
    setIsMobileFiltersOpen(false);

    if (window.matchMedia("(max-width: 560px)").matches) {
      setIsSidebarCollapsed(true);
    }
  }

  function openPlansBenefitsTab(tab: "plans" | "repair" | "benefits") {
    setPlansBenefitsTab(tab);
    openAdminView("Plans & Benefits");

    if (tab === "repair") {
      setCibilRepairTab("plans");
    }

    if (tab === "repair" && !hasLoadedCibilRepair) {
      loadCibilRepairContent();
    }
  }
  const [downloadingLoanId, setDownloadingLoanId] = useState<number | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanRow | null>(null);
  const [loanUpdateStatus, setLoanUpdateStatus] = useState("in_review");
  const [loanRemarks, setLoanRemarks] = useState("");
  const [isUpdatingLoan, setIsUpdatingLoan] = useState(false);
  const [chatsData, setChatsData] = useState<ChatsResponse | null>(null);
  const [chatsSearch, setChatsSearch] = useState("");
  const [chatsError, setChatsError] = useState("");
  const [isChatsLoading, setIsChatsLoading] = useState(false);

  function getAccessForView(view: AppView, accessList = userMenuAccess) {
    const accessTarget = viewAccessMap[view];

    return accessList.find(
      (access) =>
        access.menuName.toLowerCase() === accessTarget.menuName.toLowerCase() &&
        (access.childMenuName || null)?.toLowerCase() === (accessTarget.childMenuName || null)?.toLowerCase()
    );
  }

  function hasViewPermission(view: AppView, accessList = userMenuAccess) {
    const hasReadAccess = (permissions: string[]) =>
      permissions.some((permission) => ["view", "read"].includes(permission.toLowerCase()));

    const access = getAccessForView(view, accessList);

    return Boolean(access && hasReadAccess(access.permissions));
  }

  function hasActionPermission(view: AppView, permission: string, accessList = userMenuAccess) {
    return Boolean(getAccessForView(view, accessList)?.permissions.some((item) => item.toLowerCase() === permission.toLowerCase()));
  }

  function getFirstAllowedView(accessList = userMenuAccess) {
    return (Object.keys(viewRoutes) as AppView[]).find((view) => hasViewPermission(view, accessList)) || null;
  }

  async function loadDashboardCounts(token: string, from = dashboardFromDate, to = dashboardToDate) {
    try {
      setDashboardError("");
      setIsDashboardLoading(true);
      const params = new URLSearchParams();

      if (from) params.set("from", from);
      if (to) params.set("totime", to);

      const query = params.toString();
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-counts${query ? `?${query}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return false;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load dashboard");
      }

      setDashboardCounts(result.data);
      return true;
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Unable to load dashboard");
      return false;
    } finally {
      setIsDashboardLoading(false);
    }
  }

  function resetDashboardFilters() {
    setDashboardFromDate("");
    setDashboardToDate("");

    if (adminUser?.token) {
      loadDashboardCounts(adminUser.token, "", "");
    }
  }

  async function loadUserPermissions(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user-permission`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        localStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        setUserMenuAccess([]);
        return null;
      }

      if (!response.ok || result.status !== "success") {
        return null;
      }

      const menuAccess = result.data?.menuAccess || result.data?.role?.menuAccess || [];
      setUserMenuAccess(menuAccess);
      return menuAccess as UserMenuAccess[];
    } catch {
      return null;
    }
  }

  async function loadUsers(page = 1, search = usersSearch, subscribedOnly = activeView === "Basic Subscriptions", status = activeView === "Users" ? usersStatus : "") {
    if (!adminUser?.token) {
      return;
    }

    try {
      setUsersError("");
      setIsUsersLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search,
      });

      if (subscribedOnly) {
        params.set("subscribedOnly", "true");
      }

      if (status) {
        params.set("status", status);
      }

      if (usersFromDate) {
        params.set("from", `${usersFromDate} 00:00:00`);
      }

      if (usersToDate) {
        params.set("totime", `${usersToDate} 23:59:59`);
      }

      const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load users");
      }

      setUsersData(result.data);
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "Unable to load users");
    } finally {
      setIsUsersLoading(false);
    }
  }

  async function loadUserDetail(publicId: string) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setSelectedUserError("");
      setIsUserDetailLoading(true);
      setSelectedUserDetail(null);

      const response = await fetch(`${API_BASE_URL}/admin/users/${publicId}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load user details");
      }

      setSelectedUserDetail(result.data);
    } catch (error) {
      setSelectedUserError(error instanceof Error ? error.message : "Unable to load user details");
    } finally {
      setIsUserDetailLoading(false);
    }
  }

  async function loadReportDownloads(
    page = 1,
    search = reportDownloadsSearch,
    from = reportDownloadsFromDate,
    to = reportDownloadsToDate
  ) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setReportDownloadsError("");
      setIsReportDownloadsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "10" });

      if (search) params.set("search", search);
      if (from) params.set("from", `${from} 00:00:00`);
      if (to) params.set("totime", `${to} 23:59:59`);

      const response = await fetch(`${API_BASE_URL}/admin/cibil-report-downloads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load report downloads");
      }

      setReportDownloadsData(result.data);
    } catch (error) {
      setReportDownloadsError(error instanceof Error ? error.message : "Unable to load report downloads");
    } finally {
      setIsReportDownloadsLoading(false);
    }
  }

  async function loadApiLogs(
    page = 1,
    filters: Partial<{
      search: string;
      bureauType: string;
      operationType: string;
      status: string;
    }> = {}
  ) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setApiLogsError("");
      setIsApiLogsLoading(true);
      const search = filters.search ?? apiLogsSearch;
      const bureauType = filters.bureauType ?? apiLogsBureauType;
      const operationType = filters.operationType ?? apiLogsOperationType;
      const status = filters.status ?? apiLogsStatus;
      const params = new URLSearchParams({ page: String(page), limit: "10" });

      if (search) params.set("search", search);
      if (bureauType) params.set("bureauType", bureauType);
      if (operationType) params.set("operationType", operationType);
      if (status) params.set("status", status);

      const response = await fetch(`${API_BASE_URL}/admin/credit-bureau-api-hits?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load API logs");
      }

      setApiLogsData(result.data);
    } catch (error) {
      setApiLogsError(error instanceof Error ? error.message : "Unable to load API logs");
    } finally {
      setIsApiLogsLoading(false);
    }
  }

  async function loadCibilUsers(
    page = 1,
    search = cibilUsersSearch,
    from = cibilUsersFromDate,
    to = cibilUsersToDate
  ) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setCibilUsersError("");
      setIsCibilUsersLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        status: "active",
      });

      if (search) params.set("search", search);
      if (from) params.set("from", from);
      if (to) params.set("totime", to);

      const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load users");
      }

      setCibilUsersData(result.data);
    } catch (error) {
      setCibilUsersError(error instanceof Error ? error.message : "Unable to load users");
    } finally {
      setIsCibilUsersLoading(false);
    }
  }

  async function downloadUserCibilReport(user: UserRow) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setDownloadingCibilUserId(user.publicId);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-report-download/${user.publicId}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Unable to download CIBIL report");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const disposition = response.headers.get("content-disposition") || "";
      const fileName = disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i)?.[1];

      link.href = url;
      link.download = fileName ? decodeURIComponent(fileName) : `${toFileName(user.fullName || user.mobileNumber)}-cibil-report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to download CIBIL report");
    } finally {
      setDownloadingCibilUserId(null);
    }
  }

  async function loadManualReportDownloads(
    page = 1,
    search = manualReportDownloadsSearch,
    type = manualReportDownloadsType,
    from = manualReportDownloadsFromDate,
    to = manualReportDownloadsToDate
  ) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setManualReportDownloadsError("");
      setIsManualReportDownloadsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "10" });

      if (search) params.set("search", search);
      if (type) params.set("type", type);
      if (from) params.set("from", from);
      if (to) params.set("totime", to);

      const response = await fetch(`${API_BASE_URL}/admin/manual-credit-report-downloads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load manual report downloads");
      }

      setManualReportDownloadsData(result.data);
    } catch (error) {
      setManualReportDownloadsError(error instanceof Error ? error.message : "Unable to load manual report downloads");
    } finally {
      setIsManualReportDownloadsLoading(false);
    }
  }

  async function downloadManualReportFile(download: ManualCreditReportDownload) {
    if (!download.creditReportLink) {
      showToast("error", "Report download link is unavailable");
      return;
    }

    try {
      setDownloadingManualReportId(download.id);
      const response = await fetch(download.creditReportLink);

      if (!response.ok) {
        throw new Error("Report download link has expired");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${download.clientId || `${download.type}-credit-report`}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      const link = document.createElement("a");

      link.href = download.creditReportLink;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    } finally {
      setDownloadingManualReportId(null);
    }
  }

  async function downloadManualCreditReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token || !manualReportForm.consent) {
      return;
    }

    const commonPayload = {
      type: manualReportForm.type,
      mobile: manualReportForm.mobile,
      pan: manualReportForm.pan,
      consent: "Y",
    };
    const payload = manualReportForm.type === "crif"
      ? { ...commonPayload, firstName: manualReportForm.firstName, lastName: manualReportForm.lastName }
      : {
        ...commonPayload,
        name: manualReportForm.name,
        ...(manualReportForm.type === "cibil" ? { gender: manualReportForm.gender } : {}),
      };

    try {
      setManualReportError("");
      setIsManualReportDownloading(true);
      const response = await fetch(`${API_BASE_URL}/admin/download-manual-cibil-report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || result?.errors?.[0] || "Unable to download credit report");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const disposition = response.headers.get("content-disposition") || "";
      const fileName = disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i)?.[1];

      link.href = url;
      link.download = fileName ? decodeURIComponent(fileName) : `${manualReportForm.type}-credit-report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      setManualReportDownloadsData(null);
      showToast("success", "Credit report downloaded successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to download credit report";
      setManualReportError(message);
      showToast("error", message);
    } finally {
      setIsManualReportDownloading(false);
    }
  }

  async function loadEmployees(page = 1, search = employeesSearch, status = employeesStatus) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setEmployeesError("");
      setIsEmployeesLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
        status,
      });
      const response = await fetch(`${API_BASE_URL}/admin/employees?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load employees");
      }

      setEmployeesData(result.data);
    } catch (error) {
      setEmployeesError(error instanceof Error ? error.message : "Unable to load employees");
    } finally {
      setIsEmployeesLoading(false);
    }
  }

  function getEmployeeRoles(result: { data?: EmployeeRolesResponse | EmployeeRole[] }) {
    if (Array.isArray(result.data)) {
      return result.data;
    }

    return result.data?.roles || result.data?.employeeRoles || [];
  }

  async function loadEmployeeRoles(page = 1, search = employeeRolesSearch) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setEmployeeRolesError("");
      setIsEmployeeRolesLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20", search });
      const response = await fetch(`${API_BASE_URL}/admin/employee-roles?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load roles");
      }

      setEmployeeRolesData(Array.isArray(result.data) ? { roles: result.data } : result.data);
    } catch (error) {
      setEmployeeRolesError(error instanceof Error ? error.message : "Unable to load roles");
    } finally {
      setIsEmployeeRolesLoading(false);
    }
  }

  async function loadEmployeeMenuAccess() {
    if (!adminUser?.token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/employee-menu-access`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load menu access");
      }

      setEmployeeMenuAccess(Array.isArray(result.data) ? result.data : result.data?.menuAccess || []);
    } catch (error) {
      setEmployeeRolesError(error instanceof Error ? error.message : "Unable to load menu access");
    }
  }

  async function loadLoginEvents(page = 1, search = loginEventsSearch, from = loginEventsFromDate, to = loginEventsToDate) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setLoginEventsError("");
      setIsLoginEventsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (from) {
        params.set("from", from);
      }
      if (to) {
        params.set("totime", to);
      }
      const response = await fetch(`${API_BASE_URL}/admin/login-events?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load login history");
      }

      const data = result.data || {};
      setLoginEventsData({
        loginEvents: data.loginEvents || data.events || data.login_events || (Array.isArray(data) ? data : []),
        pagination: data.pagination || { page, limit: 10, total: 0, totalPages: 1 },
      });
    } catch (error) {
      setLoginEventsError(error instanceof Error ? error.message : "Unable to load login history");
    } finally {
      setIsLoginEventsLoading(false);
    }
  }

  async function loadFeedback(page = 1, search = feedbackSearch, from = feedbackFromDate, to = feedbackToDate) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setFeedbackError("");
      setIsFeedbackLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (search) {
        params.set("search", search);
      }

      if (from) {
        params.set("from", from);
      }

      if (to) {
        params.set("totime", to);
      }

      const response = await fetch(`${API_BASE_URL}/admin/feedback?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load feedback");
      }

      setFeedbackData(result.data);
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Unable to load feedback");
    } finally {
      setIsFeedbackLoading(false);
    }
  }

  async function loadContactRequests(page = 1, search = contactSearch, from = contactFromDate, to = contactToDate) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setContactError("");
      setIsContactLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
        from,
        totime: to,
      });

      const response = await fetch(`${API_BASE_URL}/admin/contact-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load contact requests");
      }

      setContactRequestsData(result.data);
    } catch (error) {
      setContactError(error instanceof Error ? error.message : "Unable to load contact requests");
    } finally {
      setIsContactLoading(false);
    }
  }

  function resetEmployeeForm() {
    setEmployeeForm({
      fullName: "",
      mobileNumber: "",
      email: "",
      role: "",
      rolePublicId: "",
      department: "",
      designation: "",
      status: "active",
      joinedAt: "",
    });
    setEditingEmployeeId(null);
  }

  function openEmployeeModal(employee?: EmployeeRow) {
    if (!employeeRolesData) {
      loadEmployeeRoles();
    }

    if (employee) {
      setEditingEmployeeId(employee.publicId);
      setEmployeeForm({
        fullName: employee.fullName || "",
        mobileNumber: employee.mobileNumber || "",
        email: employee.email || "",
        role: employee.role || "",
        rolePublicId: employee.rolePublicId || "",
        department: employee.department || "",
        designation: employee.designation || "",
        status: employee.status || "active",
        joinedAt: employee.joinedAt ? employee.joinedAt.slice(0, 10) : "",
      });
    } else {
      resetEmployeeForm();
    }

    setIsEmployeeModalOpen(true);
  }

  async function saveEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setEmployeesError("");
      setIsEmployeeSaving(true);
      const response = await fetch(
        editingEmployeeId ? `${API_BASE_URL}/admin/employees/${editingEmployeeId}` : `${API_BASE_URL}/admin/employees`,
        {
          method: editingEmployeeId ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${adminUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: employeeForm.fullName,
            mobileNumber: employeeForm.mobileNumber,
            email: employeeForm.email,
            role: employeeForm.role,
            rolePublicId: employeeForm.rolePublicId,
            department: employeeForm.department,
            designation: employeeForm.designation,
            status: employeeForm.status,
            joinedAt: employeeForm.joinedAt,
          }),
        }
      );
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to save employee");
      }

      showToast("success", editingEmployeeId ? "Employee updated successfully" : "Employee added successfully");
      setIsEmployeeModalOpen(false);
      resetEmployeeForm();
      await loadEmployees(employeesData?.pagination.page || 1);
    } catch (error) {
      setEmployeesError(error instanceof Error ? error.message : "Unable to save employee");
    } finally {
      setIsEmployeeSaving(false);
    }
  }

  async function openEmployeeRoleModal(role?: EmployeeRole) {
    if (!employeeMenuAccess.length) {
      loadEmployeeMenuAccess();
    }

    let roleDetails = role;

    if (role?.publicId && adminUser?.token) {
      try {
        setEmployeeRolesError("");
        setIsEmployeeRolesLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/employee-roles/${role.publicId}`, {
          headers: { Authorization: `Bearer ${adminUser.token}` },
        });
        const result = await response.json();

        if (!response.ok || result.status !== "success") {
          throw new Error(result.message || "Unable to load role");
        }

        roleDetails = result.data?.role || result.data;
      } catch (error) {
        setEmployeeRolesError(error instanceof Error ? error.message : "Unable to load role");
        return;
      } finally {
        setIsEmployeeRolesLoading(false);
      }
    }

    setEditingEmployeeRoleId(roleDetails?.publicId || null);
    setEmployeeRoleForm({
      roleName: roleDetails?.roleName || "",
      description: roleDetails?.description || "",
      status: roleDetails?.status || "active",
      menuAccess: roleDetails?.menuAccess?.map((access) => ({
        ...access,
        permissions: Array.from(new Set([getViewPermission(access), ...access.permissions])),
      })) || [],
    });
    setExpandedEmployeeRoleAccess([]);
    setIsEmployeeRoleModalOpen(true);
  }

  function closeEmployeeRoleForm() {
    setIsEmployeeRoleModalOpen(false);
    setEditingEmployeeRoleId(null);
    setExpandedEmployeeRoleAccess([]);
  }

  function getEmployeeRoleAccessKey(access: EmployeeMenuAccess) {
    return `${access.menuName}-${access.childMenuName || ""}`;
  }

  function getViewPermission(access: EmployeeMenuAccess) {
    return access.permissions.find((permission) => permission.toLowerCase() === "view") || "View";
  }

  function getSelectedEmployeeRoleAccess(access: EmployeeMenuAccess) {
    return employeeRoleForm.menuAccess.find(
      (item) => item.menuName === access.menuName && item.childMenuName === access.childMenuName
    );
  }

  function isEmployeeRoleAccessSelected(access: EmployeeMenuAccess) {
    return Boolean(getSelectedEmployeeRoleAccess(access));
  }

  function isAllEmployeeRoleAccessSelected() {
    return employeeMenuAccess.length > 0 && employeeRoleForm.menuAccess.length === employeeMenuAccess.length;
  }

  function toggleAllEmployeeRoleAccess() {
    setEmployeeRoleForm((role) => ({
      ...role,
      menuAccess: isAllEmployeeRoleAccessSelected()
        ? []
        : employeeMenuAccess.map((access) => ({
          ...access,
          permissions: Array.from(new Set([getViewPermission(access), ...access.permissions])),
        })),
    }));
  }

  function toggleEmployeeRoleAccess(access: EmployeeMenuAccess) {
    const viewPermission = getViewPermission(access);

    setEmployeeRoleForm((role) => ({
      ...role,
      menuAccess: isEmployeeRoleAccessSelected(access)
        ? role.menuAccess.filter((item) => item.menuName !== access.menuName || item.childMenuName !== access.childMenuName)
        : [...role.menuAccess, { ...access, permissions: [viewPermission] }],
    }));
  }

  function toggleEmployeeRolePermission(access: EmployeeMenuAccess, permission: string) {
    const viewPermission = getViewPermission(access);

    setEmployeeRoleForm((role) => {
      const selectedAccess = role.menuAccess.find(
        (item) => item.menuName === access.menuName && item.childMenuName === access.childMenuName
      );
      const selectedPermissions = selectedAccess?.permissions || [viewPermission];
      const nextPermissions = permission === viewPermission
        ? selectedPermissions
        : selectedPermissions.includes(permission)
          ? selectedPermissions.filter((item) => item !== permission)
          : [...selectedPermissions, permission];

      return {
        ...role,
        menuAccess: [
          ...role.menuAccess.filter((item) => item.menuName !== access.menuName || item.childMenuName !== access.childMenuName),
          { ...access, permissions: Array.from(new Set([viewPermission, ...nextPermissions])) },
        ],
      };
    });
  }

  function toggleEmployeeRoleAccessExpansion(access: EmployeeMenuAccess) {
    const accessKey = getEmployeeRoleAccessKey(access);

    setExpandedEmployeeRoleAccess((items) =>
      items.includes(accessKey) ? items.filter((item) => item !== accessKey) : [...items, accessKey]
    );
  }

  async function saveEmployeeRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setEmployeeRolesError("");
      setIsEmployeeRolesLoading(true);
      const response = await fetch(
        editingEmployeeRoleId ? `${API_BASE_URL}/admin/employee-roles/${editingEmployeeRoleId}` : `${API_BASE_URL}/admin/employee-roles`,
        {
          method: editingEmployeeRoleId ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${adminUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeRoleForm),
        }
      );
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to save role");
      }

      showToast("success", editingEmployeeRoleId ? "Role updated successfully" : "Role added successfully");
      closeEmployeeRoleForm();
      await loadEmployeeRoles(employeeRolesData?.pagination?.page || 1);
    } catch (error) {
      setEmployeeRolesError(error instanceof Error ? error.message : "Unable to save role");
    } finally {
      setIsEmployeeRolesLoading(false);
    }
  }

  async function deleteEmployeeRole() {
    if (!adminUser?.token || !deletingEmployeeRole?.publicId) {
      return;
    }

    try {
      setEmployeeRolesError("");
      setIsEmployeeRolesLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/employee-roles/${deletingEmployeeRole.publicId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to delete role");
      }

      showToast("success", "Role deleted successfully");
      setDeletingEmployeeRole(null);
      await loadEmployeeRoles(employeeRolesData?.pagination?.page || 1);
    } catch (error) {
      setEmployeeRolesError(error instanceof Error ? error.message : "Unable to delete role");
    } finally {
      setIsEmployeeRolesLoading(false);
    }
  }

  async function deleteEmployee() {
    if (!adminUser?.token || !deletingEmployee?.publicId) {
      return;
    }

    try {
      setEmployeesError("");
      setIsEmployeeSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/employees/${deletingEmployee.publicId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to delete employee");
      }

      showToast("success", "Employee deleted successfully");
      setDeletingEmployee(null);
      await loadEmployees(employeesData?.pagination.page || 1);
    } catch (error) {
      setEmployeesError(error instanceof Error ? error.message : "Unable to delete employee");
    } finally {
      setIsEmployeeSaving(false);
    }
  }

  async function loadGeneralSettings() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setGeneralError("");
      setIsGeneralLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/general`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load general settings");
      }

      setGeneralSettings(normalizeGeneralSettings(result.data));
      setHasLoadedGeneral(true);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Unable to load general settings");
    } finally {
      setIsGeneralLoading(false);
    }
  }

  async function loadNotificationUsers(page = 1, search = notificationUserSearch) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setNotificationsError("");
      setIsNotificationsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search,
      });
      const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load users");
      }

      setNotificationUsersData(result.data);
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to load users");
    } finally {
      setIsNotificationsLoading(false);
    }
  }

  async function loadAdminNotifications(page = 1, search = notificationsSearch, append = false) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setNotificationsError("");
      if (append) {
        setIsNotificationsPaging(true);
      } else {
        setIsNotificationsLoading(true);
      }
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      const response = await fetch(`${API_BASE_URL}/admin/notifications?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load notifications");
      }

      setNotificationsData((current) => {
        if (!append || !current) {
          return result.data;
        }

        const existingIds = new Set(current.notifications.map((notification) => notification.publicId || notification.id));
        const nextNotifications = result.data.notifications.filter(
          (notification: AdminNotificationRow) => !existingIds.has(notification.publicId || notification.id)
        );

        return {
          ...result.data,
          notifications: [...current.notifications, ...nextNotifications],
        };
      });
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to load notifications");
    } finally {
      setIsNotificationsLoading(false);
      setIsNotificationsPaging(false);
    }
  }

  async function loadAppNotifications(page = 1, search = notificationsSearch, append = false) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setNotificationsError("");
      if (append) {
        setIsNotificationsPaging(true);
      } else {
        setIsNotificationsLoading(true);
      }
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      const response = await fetch(`${API_BASE_URL}/admin/app-notifications?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load notifications");
      }

      setAppNotificationsData((current) => {
        if (!append || !current) {
          return result.data;
        }

        const existingIds = new Set(current.notifications.map((notification) => notification.publicId || notification.id));
        const nextNotifications = result.data.notifications.filter(
          (notification: AdminNotificationRow) => !existingIds.has(notification.publicId || notification.id)
        );

        return {
          ...result.data,
          notifications: [...current.notifications, ...nextNotifications],
        };
      });
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to load notifications");
    } finally {
      setIsNotificationsLoading(false);
      setIsNotificationsPaging(false);
    }
  }

  function handleNotificationsScroll(event: UIEvent<HTMLElement>) {
    const target = event.currentTarget;
    const pagination = notificationsData?.pagination;

    if (!pagination || isNotificationsLoading || isNotificationsPaging || pagination.page >= pagination.totalPages) {
      return;
    }

    if (target.scrollHeight - target.scrollTop - target.clientHeight <= 80) {
      loadAdminNotifications(pagination.page + 1, notificationsSearch, true);
    }
  }

  function handleAppNotificationsScroll(event: UIEvent<HTMLElement>) {
    const target = event.currentTarget;
    const pagination = appNotificationsData?.pagination;

    if (!pagination || isNotificationsLoading || isNotificationsPaging || pagination.page >= pagination.totalPages) {
      return;
    }

    if (target.scrollHeight - target.scrollTop - target.clientHeight <= 80) {
      loadAppNotifications(pagination.page + 1, notificationsSearch, true);
    }
  }

  function openNotificationsDrawer() {
    setIsNotificationsDrawerOpen(true);
    loadAdminNotifications(1);
  }

  async function markAdminNotificationRead(publicId?: string) {
    if (!adminUser?.token || !publicId) {
      return;
    }

    try {
      setNotificationsError("");
      setIsNotificationMarking(true);
      const response = await fetch(`${API_BASE_URL}/admin/notifications/${publicId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to mark notification as read");
      }

      await loadAdminNotifications(1);
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to mark notification as read");
    } finally {
      setIsNotificationMarking(false);
    }
  }

  async function markAllAdminNotificationsRead() {
    if (!adminUser?.token || !adminUser.isAdmin) {
      return;
    }

    try {
      setNotificationsError("");
      setIsNotificationMarking(true);
      const response = await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to mark notifications as read");
      }

      await loadAdminNotifications(1);
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to mark notifications as read");
    } finally {
      setIsNotificationMarking(false);
    }
  }

  async function sendAdminNotification(scope: "all" | "users") {
    if (!adminUser?.token) {
      return;
    }

    if (scope === "users" && !selectedNotificationUserIds.length) {
      setNotificationsError("Select at least one user");
      return;
    }

    try {
      setNotificationsError("");
      setIsNotificationSending(true);
      const response = await fetch(`${API_BASE_URL}/admin/app-notifications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope,
          ...(scope === "users" ? { userPublicIds: selectedNotificationUserIds } : {}),
          title: notificationTitle,
          message: notificationMessage,
          imageUrl: notificationImageUrl,
          screen: notificationScreen,
          data: { source: "admin" },
        }),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to send notification");
      }

      showToast("success", "Notification sent successfully");
      setSelectedNotificationUserIds([]);
      closeNotificationModal();
      await loadAppNotifications();
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to send notification");
    } finally {
      setIsNotificationSending(false);
    }
  }

  async function updateGeneralSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setGeneralError("");
      setIsGeneralSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/general`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(generalFormSettings),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update general settings");
      }

      showToast("success", "General settings updated successfully");
      setHasLoadedGeneral(true);
      setGeneralSettings(normalizeGeneralSettings(result.data, generalSettings));
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Unable to update general settings");
    } finally {
      setIsGeneralSaving(false);
    }
  }

  async function loadWebsiteSettings() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setWebsiteSettingsError("");
      setIsWebsiteSettingsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/website-settings`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load website settings");
      }

      setWebsiteSettingsData(result.data || null);
      setHasLoadedWebsiteSettings(true);
    } catch (error) {
      setWebsiteSettingsError(error instanceof Error ? error.message : "Unable to load website settings");
    } finally {
      setIsWebsiteSettingsLoading(false);
    }
  }

  function getWebsiteSettingsFileName(filePath?: string) {
    if (!filePath) {
      return "";
    }

    return decodeURIComponent(filePath.split("/").pop() || filePath);
  }

  async function updateWebsiteSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData();
    let hasFile = false;
    Object.entries(websiteSettingsFiles).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
        hasFile = true;
      }
    });

    if (!hasFile) {
      setWebsiteSettingsError("Upload at least one PDF");
      return;
    }

    try {
      setWebsiteSettingsError("");
      setIsWebsiteSettingsSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/website-settings`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminUser.token}` },
        body: formData,
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update website settings");
      }

      showToast("success", result.message || "Website settings updated successfully");
      setWebsiteSettingsData(result.data || null);
      setHasLoadedWebsiteSettings(true);
      setWebsiteSettingsFiles({
        privacyPolicy: null,
        termsOfService: null,
        disclaimer: null,
        accountDeletion: null,
      });
      form.reset();
    } catch (error) {
      setWebsiteSettingsError(error instanceof Error ? error.message : "Unable to update website settings");
    } finally {
      setIsWebsiteSettingsSaving(false);
    }
  }

  async function loadLegalContent() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setLegalContentError("");
      setIsLegalContentLoading(true);
      const response = await fetch(`${API_BASE_URL}/legal-content`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load legal content");
      }

      setLegalContent({
        id: result.data?.id,
        termsAndConditions: result.data?.termsAndConditions || "",
        privacyPolicy: result.data?.privacyPolicy || "",
        consent: result.data?.consent || "",
        createdAt: result.data?.createdAt,
        updatedAt: result.data?.updatedAt,
      });
      setHasLoadedLegalContent(true);
    } catch (error) {
      setLegalContentError(error instanceof Error ? error.message : "Unable to load legal content");
    } finally {
      setIsLegalContentLoading(false);
    }
  }

  async function updateLegalContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setLegalContentError("");
      setIsLegalContentSaving(true);
      const response = await fetch(`${API_BASE_URL}/legal-content`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          termsAndConditions: legalContent.termsAndConditions,
          privacyPolicy: legalContent.privacyPolicy,
          consent: legalContent.consent,
        }),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update legal content");
      }

      setLegalContent({
        id: result.data?.id,
        termsAndConditions: result.data?.termsAndConditions || legalContent.termsAndConditions,
        privacyPolicy: result.data?.privacyPolicy || legalContent.privacyPolicy,
        consent: result.data?.consent || legalContent.consent,
        createdAt: result.data?.createdAt,
        updatedAt: result.data?.updatedAt,
      });
      setHasLoadedLegalContent(true);
      showToast("success", "Legal content updated successfully");
    } catch (error) {
      setLegalContentError(error instanceof Error ? error.message : "Unable to update legal content");
    } finally {
      setIsLegalContentSaving(false);
    }
  }

  async function loadHomepageThemes() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setHomepageThemesError("");
      setIsHomepageThemesLoading(true);
      const response = await fetch(`${API_BASE_URL}/general/homepage-image-theme`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load homepage themes");
      }

      setHomepageThemes(result.data || []);
      setHasLoadedHomepageThemes(true);
    } catch (error) {
      setHomepageThemesError(error instanceof Error ? error.message : "Unable to load homepage themes");
    } finally {
      setIsHomepageThemesLoading(false);
    }
  }

  function openHomepageThemeModal(theme?: HomepageTheme) {
    setHomepageThemeForm({
      imageName: theme?.imageName || "",
      fileName: theme?.fileName || "",
      isActive: theme?.isActive ?? true,
      image: null,
      originalImageName: theme?.imageName || "",
    });
    setIsHomepageThemeModalOpen(true);
  }

  function closeHomepageThemeModal() {
    setIsHomepageThemeModalOpen(false);
    setHomepageThemeForm({
      imageName: "",
      fileName: "",
      isActive: true,
      image: null,
      originalImageName: "",
    });
  }

  async function saveHomepageTheme(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setHomepageThemesError("");
      setSavingHomepageTheme(homepageThemeForm.imageName);

      const formData = new FormData();
      formData.append("imageName", homepageThemeForm.imageName);
      formData.append("isActive", String(homepageThemeForm.isActive));

      if (homepageThemeForm.image) {
        formData.append("image", homepageThemeForm.image);
      }

      const response = await fetch(`${API_BASE_URL}/general/homepage-image-theme`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${adminUser.token}` },
        body: formData,
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update homepage theme");
      }

      setHomepageThemes((themes) =>
        homepageThemeForm.originalImageName
          ? themes.map((item) => (item.imageName === homepageThemeForm.originalImageName ? { ...item, ...result.data } : item))
          : [...themes, result.data]
      );
      closeHomepageThemeModal();
      showToast("success", result.message || "Homepage image theme updated successfully");
    } catch (error) {
      setHomepageThemesError(error instanceof Error ? error.message : "Unable to update homepage theme");
    } finally {
      setSavingHomepageTheme("");
    }
  }

  function openDeleteHomepageThemeModal(theme: HomepageTheme) {
    setDeletingHomepageTheme(theme);
  }

  function closeDeleteHomepageThemeModal() {
    if (isDeletingHomepageTheme) {
      return;
    }

    setDeletingHomepageTheme(null);
  }

  async function deleteHomepageTheme() {
    if (!adminUser?.token || !deletingHomepageTheme?.id) {
      return;
    }

    try {
      setHomepageThemesError("");
      setIsDeletingHomepageTheme(true);
      const response = await fetch(`${API_BASE_URL}/general/homepage-image-theme/${deletingHomepageTheme.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to delete homepage theme");
      }

      setHomepageThemes((themes) => themes.filter((theme) => theme.id !== deletingHomepageTheme.id));
      setDeletingHomepageTheme(null);
      showToast("success", result.message || "Homepage image theme deleted successfully");
    } catch (error) {
      setHomepageThemesError(error instanceof Error ? error.message : "Unable to delete homepage theme");
    } finally {
      setIsDeletingHomepageTheme(false);
    }
  }

  function getHomepageThemeImageUrl(fileName: string) {
    if (!fileName) {
      return "";
    }

    return fileName.startsWith("http") ? fileName : `${API_BASE_URL}/uploads/${fileName}`;
  }

  async function loadFaqs() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setFaqsError("");
      setIsFaqsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load FAQs");
      }

      setFaqCategories(
        result.data?.categories?.map((category: FaqCategory) => ({
          ...category,
          questions: category.questions.map((question) => ({
            ...question,
            publicId: question.publicId || question.id,
          })),
        })) || []
      );
      setHasLoadedFaqs(true);
    } catch (error) {
      setFaqsError(error instanceof Error ? error.message : "Unable to load FAQs");
    } finally {
      setIsFaqsLoading(false);
    }
  }

  async function updateFaqs(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setFaqsError("");
      setIsFaqsSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: faqCategories.map((category) => ({
            category: category.category,
            categoryLabel: category.categoryLabel,
            icon: category.icon,
            questions: category.questions.map((question) => ({
              publicId: question.publicId,
              question: question.question,
              answer: question.answer,
              displayOrder: question.displayOrder,
              isActive: question.isActive,
            })),
          })),
        }),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update FAQs");
      }

      setFaqCategories(
        result.data?.categories?.map((category: FaqCategory) => ({
          ...category,
          questions: category.questions.map((question) => ({
            ...question,
            publicId: question.publicId || question.id,
          })),
        })) || faqCategories
      );
      setHasLoadedFaqs(true);
      showToast("success", "FAQs updated successfully");
    } catch (error) {
      setFaqsError(error instanceof Error ? error.message : "Unable to update FAQs");
    } finally {
      setIsFaqsSaving(false);
    }
  }

  function getAdminPlansFromResponse(result: { data?: SubscriptionPlan[] | { plans?: SubscriptionPlan[]; subscriptionPlans?: SubscriptionPlan[] } }) {
    if (Array.isArray(result.data)) {
      return result.data;
    }

    return result.data?.plans || result.data?.subscriptionPlans || [];
  }

  function planListToText(items?: string[]) {
    return items?.join("\n") || "";
  }

  function planTextToList(value: string) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function setBasicPlanFromResponse(data?: Partial<BasicPlanForm> & {
    amount?: number | string;
    gstPercentage?: number | string;
    displayOrder?: number | string;
    benefits?: BasicPlanBenefit[];
    razorpayPlanId?: string | null;
    imageUrl?: string | null;
  }) {
    if (!data) {
      return;
    }

    setBasicPlanForm({
      ...emptyBasicPlanForm,
      ...data,
      amount: String(data.amount ?? ""),
      gstPercentage: String(data.gstPercentage ?? ""),
      displayOrder: String(data.displayOrder ?? 1),
      razorpayPlanId: data.razorpayPlanId || "",
      imageUrl: data.imageUrl || "",
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      comparisonBenefits: Array.isArray(data.comparisonBenefits) ? data.comparisonBenefits : [],
      isActive: data.isActive ?? true,
    });
  }

  async function loadBasicPlan() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setBasicPlanError("");
      setIsBasicPlanLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/subscription-plans`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load basic plan");
      }

      setBasicPlanFromResponse(result.data?.plans?.[0]);
      setHasLoadedBasicPlan(true);
    } catch (error) {
      setBasicPlanError(error instanceof Error ? error.message : "Unable to load basic plan");
    } finally {
      setIsBasicPlanLoading(false);
    }
  }

  async function saveBasicPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setBasicPlanError("");
      setIsBasicPlanSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/subscription-plans/${basicPlanForm.publicId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...basicPlanForm,
          amount: Number(basicPlanForm.amount),
          gstPercentage: Number(basicPlanForm.gstPercentage),
          razorpayPlanId: basicPlanForm.razorpayPlanId || null,
          imageUrl: basicPlanForm.imageUrl || null,
          benefits: basicPlanForm.benefits,
          displayOrder: Number(basicPlanForm.displayOrder),
        }),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update basic plan");
      }

      setBasicPlanFromResponse(result.data?.plan || result.data);
      showToast("success", "Basic plan updated successfully");
      await loadBasicPlan();
    } catch (error) {
      setBasicPlanError(error instanceof Error ? error.message : "Unable to update basic plan");
    } finally {
      setIsBasicPlanSaving(false);
    }
  }

  function updateComparisonBenefit(index: number, field: keyof ComparisonBenefit, value: string | boolean) {
    setBasicPlanForm((plan) => ({
      ...plan,
      comparisonBenefits: plan.comparisonBenefits.map((benefit, benefitIndex) =>
        benefitIndex === index ? { ...benefit, [field]: value } : benefit
      ),
    }));
  }

  function updateBasicPlanBenefit(index: number, field: keyof BasicPlanBenefit, value: string) {
    setBasicPlanForm((plan) => ({
      ...plan,
      benefits: plan.benefits.map((benefit, benefitIndex) =>
        benefitIndex === index ? { ...benefit, [field]: value } : benefit
      ),
    }));
  }

  function addComparisonBenefit() {
    setBasicPlanForm((plan) => ({
      ...plan,
      comparisonBenefits: [...plan.comparisonBenefits, { benefit: "", free: false, scorecarePro: true }],
    }));
  }

  function removeComparisonBenefit(index: number) {
    setBasicPlanForm((plan) => ({
      ...plan,
      comparisonBenefits: plan.comparisonBenefits.filter((_, benefitIndex) => benefitIndex !== index),
    }));
  }

  function getAdminPlanPayload(includePublicId: boolean) {
    return {
      ...(includePublicId ? { publicId: adminPlanForm.publicId } : {}),
      planName: adminPlanForm.planName,
      amount: Number(adminPlanForm.amount),
      gstPercentage: Number(adminPlanForm.gstPercentage),
      currency: adminPlanForm.currency,
      offerTag: adminPlanForm.offerTag,
      recommendedFor: adminPlanForm.recommendedFor || adminPlanForm.planName,
      title: adminPlanForm.title || adminPlanForm.planName,
      subtitle: adminPlanForm.subtitle,
      description: adminPlanForm.description || adminPlanForm.recommendedFor || adminPlanForm.planName,
      imageUrl: adminPlanForm.imageUrl,
      benefits: planTextToList(adminPlanForm.benefits),
      features: planTextToList(adminPlanForm.features),
      buttonLabel: adminPlanForm.buttonLabel,
      skipLabel: adminPlanForm.skipLabel,
      displayOrder: Number(adminPlanForm.displayOrder),
      isActive: adminPlanForm.isActive,
    };
  }

  async function loadAdminPlans() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setAdminPlansError("");
      setIsAdminPlansLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/subscription-plans`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load plans");
      }

      setAdminPlans(getAdminPlansFromResponse(result));
      setHasLoadedAdminPlans(true);
    } catch (error) {
      setAdminPlansError(error instanceof Error ? error.message : "Unable to load plans");
    } finally {
      setIsAdminPlansLoading(false);
    }
  }

  async function saveAdminPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    try {
      setAdminPlansError("");
      setIsAdminPlanSaving(true);
      const response = await fetch(
        editingAdminPlanId
          ? `${API_BASE_URL}/admin/subscription-plans/${editingAdminPlanId}`
          : `${API_BASE_URL}/admin/subscription-plans`,
        {
          method: editingAdminPlanId ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${adminUser.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(getAdminPlanPayload(!editingAdminPlanId)),
        }
      );
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to save plan");
      }

      showToast("success", editingAdminPlanId ? "Plan updated successfully" : "Plan added successfully");
      setEditingAdminPlanId(null);
      setAdminPlanForm(emptyAdminPlanForm);
      setIsAdminPlanModalOpen(false);
      await loadAdminPlans();
    } catch (error) {
      setAdminPlansError(error instanceof Error ? error.message : "Unable to save plan");
    } finally {
      setIsAdminPlanSaving(false);
    }
  }

  function editAdminPlan(plan: SubscriptionPlan) {
    setEditingAdminPlanId(plan.publicId);
    setIsAdminPlanModalOpen(true);
    setAdminPlanForm({
      publicId: plan.publicId,
      planName: plan.planName,
      amount: String(plan.amount ?? ""),
      gstPercentage: String(plan.gstPercentage ?? ""),
      currency: plan.currency || "INR",
      offerTag: plan.offerTag || "",
      recommendedFor: plan.recommendedFor || "",
      title: plan.title || "",
      subtitle: plan.subtitle || "",
      description: plan.description || "",
      imageUrl: plan.imageUrl || "",
      benefits: planListToText(plan.benefits),
      features: planListToText(plan.features),
      buttonLabel: plan.buttonLabel || "Subscribe Now",
      skipLabel: plan.skipLabel || "Skip",
      displayOrder: String(plan.displayOrder ?? 1),
      isActive: plan.isActive ?? true,
    });
  }

  async function inactiveAdminPlan(plan: SubscriptionPlan) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setAdminPlansError("");
      setIsAdminPlanSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/subscription-plans/${plan.publicId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: false }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to inactive plan");
      }

      showToast("success", "Plan marked inactive");
      await loadAdminPlans();
    } catch (error) {
      setAdminPlansError(error instanceof Error ? error.message : "Unable to inactive plan");
    } finally {
      setIsAdminPlanSaving(false);
    }
  }

  function getCibilRepairContentFromResponse(result: { data?: CibilRepairContent }) {
    return {
      plans: (result.data?.plans || []).map((plan) => ({
        publicId: plan.publicId || "",
        planName: plan.planName || "",
        amount: plan.amount ?? "",
        gstPercentage: plan.gstPercentage ?? "",
        offerTag: plan.offerTag || "",
      })),
      timelines: (result.data?.timelines || []).map((timeline) => ({
        publicId: timeline.publicId || "",
        localId: timeline.publicId || `timeline-${timeline.displayOrder ?? ""}-${timeline.title || ""}`,
        displayOrder: timeline.displayOrder ?? "",
        title: timeline.title || "",
        description: timeline.description || "",
        isActive: timeline.isActive ?? true,
      })),
    };
  }

  function getCibilRepairPayload() {
    return {
      plans: cibilRepairContent.plans.map((plan) => ({
        publicId: plan.publicId,
        planName: plan.planName,
        amount: Number(plan.amount),
        gstPercentage: Number(plan.gstPercentage),
        offerTag: plan.offerTag,
      })),
      timelines: cibilRepairContent.timelines.map((timeline) => ({
        ...(timeline.publicId ? { publicId: timeline.publicId } : {}),
        displayOrder: Number(timeline.displayOrder),
        title: timeline.title,
        description: timeline.description,
        isActive: timeline.isActive,
      })),
    };
  }

  function getCibilRepairTimelinePayload(timeline: CibilRepairTimeline) {
    return {
      title: timeline.title,
      description: timeline.description,
      displayOrder: Number(timeline.displayOrder),
      isActive: timeline.isActive,
    };
  }

  async function loadCibilRepairContent() {
    try {
      setCibilRepairError("");
      setIsCibilRepairLoading(true);
      const response = await fetch(`${API_BASE_URL}/cibil-repair-content`);
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load repair content");
      }

      setCibilRepairContent(getCibilRepairContentFromResponse(result));
      setHasLoadedCibilRepair(true);
    } catch (error) {
      setCibilRepairError(error instanceof Error ? error.message : "Unable to load repair content");
    } finally {
      setIsCibilRepairLoading(false);
    }
  }

  async function saveCibilRepairContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminUser?.token) {
      return;
    }

    if (cibilRepairTab === "timelines") {
      await saveCibilRepairTimelines();
      return;
    }

    try {
      setCibilRepairError("");
      setIsCibilRepairSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-content`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(getCibilRepairPayload()),
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to save repair content");
      }

      if (result.data) {
        setCibilRepairContent(getCibilRepairContentFromResponse(result));
      }
      setHasLoadedCibilRepair(true);
      showToast("success", "Repair content updated successfully");
    } catch (error) {
      setCibilRepairError(error instanceof Error ? error.message : "Unable to save repair content");
    } finally {
      setIsCibilRepairSaving(false);
    }
  }

  async function saveCibilRepairTimelines() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setCibilRepairError("");
      setIsCibilRepairSaving(true);

      for (const timeline of cibilRepairContent.timelines) {
        const response = await fetch(
          timeline.publicId
            ? `${API_BASE_URL}/admin/cibil-repair-content/timelines/${timeline.publicId}`
            : `${API_BASE_URL}/admin/cibil-repair-content/timelines`,
          {
            method: timeline.publicId ? "PATCH" : "POST",
            headers: {
              Authorization: `Bearer ${adminUser.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(getCibilRepairTimelinePayload(timeline)),
          }
        );
        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("scorecare_admin");
          setStep("mobile");
          setAdminUser(null);
          return;
        }

        if (!response.ok || result.status !== "success") {
          throw new Error(result.message || "Unable to save timeline");
        }
      }

      await loadCibilRepairContent();
      showToast("success", "Timelines updated successfully");
    } catch (error) {
      setCibilRepairError(error instanceof Error ? error.message : "Unable to save timelines");
    } finally {
      setIsCibilRepairSaving(false);
    }
  }

  function updateCibilRepairPlan(index: number, field: keyof CibilRepairPlan, value: string) {
    setCibilRepairContent((content) => ({
      ...content,
      plans: content.plans.map((plan, planIndex) => (planIndex === index ? { ...plan, [field]: value } : plan)),
    }));
  }

  function updateCibilRepairTimeline(index: number, field: keyof CibilRepairTimeline, value: string | boolean) {
    setCibilRepairContent((content) => ({
      ...content,
      timelines: content.timelines.map((timeline, timelineIndex) =>
        timelineIndex === index ? { ...timeline, [field]: value } : timeline
      ),
    }));
  }

  function addCibilRepairPlan() {
    setCibilRepairContent((content) => ({
      ...content,
      plans: [...content.plans, { publicId: "", planName: "", amount: "", gstPercentage: "", offerTag: "" }],
    }));
  }

  function addCibilRepairTimeline() {
    setCibilRepairTab("timelines");
    shouldScrollToNewCibilRepairTimeline.current = true;
    setCibilRepairContent((content) => ({
      ...content,
      timelines: [
        ...content.timelines,
        { localId: `new-timeline-${Date.now()}`, displayOrder: content.timelines.length + 1, title: "", description: "", isActive: true },
      ],
    }));
  }

  function removeCibilRepairPlan(index: number) {
    setCibilRepairContent((content) => ({
      ...content,
      plans: content.plans.filter((_, planIndex) => planIndex !== index),
    }));
  }

  async function removeCibilRepairTimeline(index: number) {
    const timeline = cibilRepairContent.timelines[index];

    if (timeline?.publicId && adminUser?.token) {
      try {
        setCibilRepairError("");
        setIsCibilRepairSaving(true);
        const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-content/timelines/${timeline.publicId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${adminUser.token}` },
        });
        const result = await response.json();

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem("scorecare_admin");
          setStep("mobile");
          setAdminUser(null);
          return;
        }

        if (!response.ok || result.status !== "success") {
          throw new Error(result.message || "Unable to delete timeline");
        }

        showToast("success", "Timeline deleted successfully");
      } catch (error) {
        setCibilRepairError(error instanceof Error ? error.message : "Unable to delete timeline");
        return;
      } finally {
        setIsCibilRepairSaving(false);
      }
    }

    setCibilRepairContent((content) => ({
      ...content,
      timelines: content.timelines.filter((_, timelineIndex) => timelineIndex !== index),
    }));
    setDeletingCibilRepairTimelineIndex(null);
  }

  function updateFaqCategory(categoryIndex: number, field: keyof Omit<FaqCategory, "questions">, value: string) {
    setFaqCategories((categories) =>
      categories.map((category, index) => (index === categoryIndex ? { ...category, [field]: value } : category))
    );
  }

  function updateFaqQuestion(categoryIndex: number, questionIndex: number, field: keyof FaqQuestion, value: string | number | boolean) {
    setFaqCategories((categories) =>
      categories.map((category, index) =>
        index === categoryIndex
          ? {
            ...category,
            questions: category.questions.map((question, currentQuestionIndex) =>
              currentQuestionIndex === questionIndex ? { ...question, [field]: value } : question
            ),
          }
          : category
      )
    );
  }

  function addFaqCategory() {
    setFaqCategories((categories) => [
      ...categories,
      {
        category: "",
        categoryLabel: "",
        icon: "help-circle",
        questions: [{ question: "", answer: "", displayOrder: 1, isActive: true }],
      },
    ]);
  }

  function removeFaqCategory(categoryIndex: number) {
    setFaqCategories((categories) => categories.filter((_, index) => index !== categoryIndex));
  }

  function addFaqQuestion(categoryIndex: number) {
    setFaqCategories((categories) =>
      categories.map((category, index) =>
        index === categoryIndex
          ? {
            ...category,
            questions: [
              ...category.questions,
              { question: "", answer: "", displayOrder: category.questions.length + 1, isActive: true },
            ],
          }
          : category
      )
    );
  }

  function removeFaqQuestion(categoryIndex: number, questionIndex: number) {
    setFaqCategories((categories) =>
      categories.map((category, index) =>
        index === categoryIndex
          ? { ...category, questions: category.questions.filter((_, currentQuestionIndex) => currentQuestionIndex !== questionIndex) }
          : category
      )
    );
  }

  async function loadCreditRepairRequests(page = 1) {
    if (!adminUser?.token) return;

    try {
      setCreditRepairError("");
      setIsCreditRepairLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load credit repair requests");
      }

      const data = result.data;
      setCreditRepairData({
        requests: Array.isArray(data) ? data : data?.requests || data?.cibilRepairRequests || [],
        pagination: Array.isArray(data) ? undefined : data?.pagination,
      });
    } catch (error) {
      setCreditRepairError(error instanceof Error ? error.message : "Unable to load credit repair requests");
    } finally {
      setIsCreditRepairLoading(false);
    }
  }

  function openCreditRepairUpdate(request: CreditRepairRequest) {
    setSelectedCreditRepair(request);
    setCreditRepairStatus(request.repairStatus || "submitted");
    setCreditRepairRemarks(request.remarks || "");
    setCreditRepairEmployeeId(request.assignedEmployee?.publicId || "");
    setCreditRepairUploadAccountNumber(request.accounts?.[0]?.accountNumber || "");
    setCreditRepairUploadFile(null);
    if (adminUser?.token && !employeesData && !isEmployeesLoading) {
      loadEmployees();
    }
    loadCreditRepairDetail(request.publicId);
  }

  async function loadCreditRepairDetail(publicId: string) {
    if (!adminUser?.token) return;

    try {
      setIsCreditRepairDetailLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests/${publicId}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load credit repair request");
      }

      const request = result.data;
      setSelectedCreditRepair(request);
      setCreditRepairStatus(request.repairStatus || "submitted");
      setCreditRepairRemarks(request.remarks || "");
      setCreditRepairEmployeeId(request.assignedEmployee?.publicId || "");
      setCreditRepairUploadAccountNumber(request.accounts?.[0]?.accountNumber || "");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to load credit repair request");
    } finally {
      setIsCreditRepairDetailLoading(false);
    }
  }

  async function updateCreditRepairRequest(nextStatus = creditRepairStatus, closeAfterUpdate = true) {
    if (!selectedCreditRepair || !adminUser?.token) return;

    try {
      setIsUpdatingCreditRepair(true);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests/${selectedCreditRepair.publicId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repairStatus: nextStatus, remarks: creditRepairRemarks }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update credit repair request");
      }

      if (closeAfterUpdate) {
        setSelectedCreditRepair(null);
      } else {
        await loadCreditRepairDetail(selectedCreditRepair.publicId);
      }
      showToast("success", "Credit repair request updated successfully");
      await loadCreditRepairRequests(creditRepairData?.pagination?.page || 1);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to update credit repair request");
    } finally {
      setIsUpdatingCreditRepair(false);
    }
  }

  async function assignCreditRepairEmployee() {
    if (!selectedCreditRepair || !adminUser?.token || !adminUser.isAdmin || !creditRepairEmployeeId) return;

    try {
      setIsAssigningCreditRepair(true);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests/${selectedCreditRepair.publicId}/assign`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeePublicId: creditRepairEmployeeId, notifyUser: creditRepairWhatsappNotify || creditRepairEmailNotify }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to assign employee");
      }

      showToast("success", result.message || "Employee assigned successfully");
      await loadCreditRepairDetail(selectedCreditRepair.publicId);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to assign employee");
    } finally {
      setIsAssigningCreditRepair(false);
    }
  }

  async function uploadCreditRepairDocument() {
    if (!selectedCreditRepair || !adminUser?.token || !creditRepairUploadFile || !creditRepairUploadAccountNumber) return;

    try {
      setIsUploadingCreditRepairDocument(true);
      const formData = new FormData();
      formData.append("documentType", "additional_document");
      formData.append("accountNumber", creditRepairUploadAccountNumber);
      formData.append("document", creditRepairUploadFile);

      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests/${selectedCreditRepair.publicId}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminUser.token}` },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to upload document");
      }

      setCreditRepairUploadFile(null);
      showToast("success", result.message || "Document uploaded successfully");
      await loadCreditRepairDetail(selectedCreditRepair.publicId);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to upload document");
    } finally {
      setIsUploadingCreditRepairDocument(false);
    }
  }

  async function fileCreditRepairDispute(account: CreditRepairRequest["accounts"][number]) {
    if (!selectedCreditRepair || !adminUser?.token || !account.id) return;

    try {
      setFilingCreditRepairAccountId(account.id);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests/${selectedCreditRepair.publicId}/accounts/${account.id}/dispute`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          remarks: creditRepairRemarks || "Filing dispute for overdue balance verification",
          notifyUser: creditRepairWhatsappNotify || creditRepairEmailNotify,
        }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to file dispute");
      }

      showToast("success", result.message || "Dispute filed successfully");
      await loadCreditRepairDetail(selectedCreditRepair.publicId);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to file dispute");
    } finally {
      setFilingCreditRepairAccountId(null);
    }
  }

  async function sendCreditRepairWhatsapp() {
    if (!selectedCreditRepair || !adminUser?.token || !adminUser.isAdmin || !creditRepairWhatsappMessage.trim()) return;

    try {
      setIsSendingCreditRepairWhatsapp(true);
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests/${selectedCreditRepair.publicId}/notify/whatsapp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: creditRepairWhatsappMessage.trim() }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to send WhatsApp notification");
      }

      showToast("success", result.message || "WhatsApp notification sent successfully");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to send WhatsApp notification");
    } finally {
      setIsSendingCreditRepairWhatsapp(false);
    }
  }

  async function loadDisputes(page = 1) {
    if (!adminUser?.token) return;

    try {
      setDisputesError("");
      setIsDisputesLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/disputes?page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load disputes");
      }

      const data = result.data;
      setDisputesData({
        disputes: Array.isArray(data) ? data : data?.disputes || [],
        pagination: Array.isArray(data) ? undefined : data?.pagination,
      });
    } catch (error) {
      setDisputesError(error instanceof Error ? error.message : "Unable to load disputes");
    } finally {
      setIsDisputesLoading(false);
    }
  }

  function openDisputeUpdate(dispute: DisputeRequest) {
    setSelectedDispute(dispute);
    setDisputeStatus(dispute.status || "under_review");
    setDisputeRemarks(dispute.remarks || "");
  }

  async function updateDispute() {
    if (!selectedDispute || !adminUser?.token) return;

    try {
      setIsUpdatingDispute(true);
      const response = await fetch(`${API_BASE_URL}/admin/disputes/${selectedDispute.publicId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: disputeStatus, remarks: disputeRemarks }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update dispute");
      }

      setSelectedDispute(null);
      showToast("success", "Dispute updated successfully");
      await loadDisputes(disputesData?.pagination?.page || 1);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to update dispute");
    } finally {
      setIsUpdatingDispute(false);
    }
  }

  async function loadBasicSubscriptions(
    page = 1,
    search = basicSubscriptionsSearch,
    status = basicSubscriptionsStatus,
    from = basicSubscriptionsFromDate,
    to = basicSubscriptionsToDate
  ) {
    if (!adminUser?.token) return;

    try {
      setBasicSubscriptionsError("");
      setIsBasicSubscriptionsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "10", search, status, from, totime: to });
      const response = await fetch(`${API_BASE_URL}/admin/basic-subscriptions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load basic subscriptions");
      }

      const data = result.data;
      setBasicSubscriptionsData({
        subscriptions: Array.isArray(data) ? data : data?.subscriptions || data?.basicSubscriptions || data?.users || [],
        pagination: Array.isArray(data) ? undefined : data?.pagination,
      });
    } catch (error) {
      setBasicSubscriptionsError(error instanceof Error ? error.message : "Unable to load basic subscriptions");
    } finally {
      setIsBasicSubscriptionsLoading(false);
    }
  }

  function resetBasicSubscriptionFilters() {
    setBasicSubscriptionsSearch("");
    setBasicSubscriptionsStatus("active");
    setBasicSubscriptionsFromDate("");
    setBasicSubscriptionsToDate("");
    loadBasicSubscriptions(1, "", "active", "", "");
  }

  async function loadRepairSubscriptions(
    page = 1,
    search = repairSubscriptionsSearch,
    repairStatus = repairSubscriptionsStatus,
    paymentStatus = repairSubscriptionsPaymentStatus,
    from = repairSubscriptionsFromDate,
    to = repairSubscriptionsToDate
  ) {
    if (!adminUser?.token) return;

    try {
      setRepairSubscriptionsError("");
      setIsRepairSubscriptionsLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "10", search, repairStatus, paymentStatus, from, totime: to });
      const response = await fetch(`${API_BASE_URL}/admin/cibil-repair-requests?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load repair service subscriptions");
      }

      const data = result.data;
      setRepairSubscriptionsData({
        requests: Array.isArray(data) ? data : data?.requests || data?.cibilRepairRequests || [],
        pagination: Array.isArray(data) ? undefined : data?.pagination,
      });
    } catch (error) {
      setRepairSubscriptionsError(error instanceof Error ? error.message : "Unable to load repair service subscriptions");
    } finally {
      setIsRepairSubscriptionsLoading(false);
    }
  }

  function resetRepairSubscriptionFilters() {
    setRepairSubscriptionsSearch("");
    setRepairSubscriptionsStatus("submitted");
    setRepairSubscriptionsPaymentStatus("paid");
    setRepairSubscriptionsFromDate("");
    setRepairSubscriptionsToDate("");
    loadRepairSubscriptions(1, "", "submitted", "paid", "", "");
  }

  async function loadLoans(page = 1, search = loansSearch, status = loansStatus) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setLoansError("");
      setIsLoansLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
      });

      if (status) {
        params.set("status", status);
      }

      const response = await fetch(`${API_BASE_URL}/admin/loans?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load loans");
      }

      setLoansData(result.data);
    } catch (error) {
      setLoansError(error instanceof Error ? error.message : "Unable to load loans");
    } finally {
      setIsLoansLoading(false);
    }
  }

  async function downloadLoanDetails(loan: LoanRow) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setDownloadingLoanId(loan.id);
      const response = await fetch(`${API_BASE_URL}/admin/loans/${loan.id}/download-details`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });

      if (!response.ok) {
        throw new Error("Unable to download loan details");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${toFileName(loan.user.fullName)}-${toFileName(getLoanTypeLabel(loan.loanType))}-documents.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to download loan details");
    } finally {
      setDownloadingLoanId(null);
    }
  }

  async function exportLoans() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setIsLoansExporting(true);
      const response = await fetch(`${API_BASE_URL}/admin/loans/export`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });

      if (!response.ok) {
        throw new Error("Unable to export loans");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `scorecare-loans-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to export loans");
    } finally {
      setIsLoansExporting(false);
    }
  }

  async function loadChats(page = 1, search = chatsSearch) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setChatsError("");
      setIsChatsLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search,
      });
      const response = await fetch(`${API_BASE_URL}/admin/chats?${params.toString()}`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("scorecare_admin");
        setStep("mobile");
        setAdminUser(null);
        return;
      }

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load chats");
      }

      setChatsData(result.data);
    } catch (error) {
      setChatsError(error instanceof Error ? error.message : "Unable to load chats");
    } finally {
      setIsChatsLoading(false);
    }
  }

  async function exportUsers() {
    if (!adminUser?.token) {
      return;
    }

    try {
      setIsExporting(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/export`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });

      if (!response.ok) {
        throw new Error("Unable to export users");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `scorecare-users-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "Unable to export users");
    } finally {
      setIsExporting(false);
    }
  }

  function resetUsersFilters() {
    setUsersSearch("");
    setUsersFromDate("");
    setUsersToDate("");
    setUsersStatus("otp_login_no_pan");
    loadUsers(1, "", activeView === "Basic Subscriptions", activeView === "Users" ? "otp_login_no_pan" : "");
  }

  function resetReportDownloadFilters() {
    setReportDownloadsSearch("");
    setReportDownloadsFromDate("");
    setReportDownloadsToDate("");
    loadReportDownloads(1, "", "", "");
  }

  function resetApiLogFilters() {
    setApiLogsSearch("");
    setApiLogsBureauType("");
    setApiLogsOperationType("");
    setApiLogsStatus("");
    loadApiLogs(1, {
      search: "",
      bureauType: "",
      operationType: "",
      status: "",
    });
  }

  function resetCibilUserFilters() {
    setCibilUsersSearch("");
    setCibilUsersFromDate("");
    setCibilUsersToDate("");
    loadCibilUsers(1, "", "", "");
  }

  function resetManualReportDownloadFilters() {
    setManualReportDownloadsSearch("");
    setManualReportDownloadsType("");
    setManualReportDownloadsFromDate("");
    setManualReportDownloadsToDate("");
    loadManualReportDownloads(1, "", "", "", "");
  }

  function toggleNotificationUser(publicId: string) {
    setSelectedNotificationUserIds((ids) =>
      ids.includes(publicId) ? ids.filter((id) => id !== publicId) : [...ids, publicId]
    );
  }

  function toggleAllNotificationUsers() {
    const pageIds = notificationUsersData?.users.map((user) => user.publicId) || [];
    const isAllSelected = pageIds.length > 0 && pageIds.every((id) => selectedNotificationUserIds.includes(id));

    setSelectedNotificationUserIds((ids) =>
      isAllSelected ? ids.filter((id) => !pageIds.includes(id)) : Array.from(new Set([...ids, ...pageIds]))
    );
  }

  function resetNotificationUsers() {
    setNotificationUserSearch("");
    setSelectedNotificationUserIds([]);
    loadNotificationUsers(1, "");
  }

  function resetNotificationsList() {
    setNotificationsSearch("");
    loadAppNotifications(1, "");
  }

  function openNotificationModal(scope: "all" | "users", userPublicId?: string) {
    if (scope === "users" && userPublicId) {
      setSelectedNotificationUserIds([userPublicId]);
    }

    if (scope === "users" && !userPublicId && !selectedNotificationUserIds.length) {
      setNotificationsError("Select at least one user");
      return;
    }

    setNotificationsError("");
    setNotificationModalScope(scope);
    setIsNotificationModalOpen(true);
  }

  function closeNotificationModal() {
    setIsNotificationModalOpen(false);
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationImageUrl("");
    setNotificationScreen("home");
  }

  function resetLoansFilters() {
    setLoansSearch("");
    setLoansStatus("");
    loadLoans(1, "", "");
  }

  function resetChatsFilters() {
    setChatsSearch("");
    loadChats(1, "");
  }

  function resetFeedbackFilters() {
    setFeedbackSearch("");
    setFeedbackFromDate("");
    setFeedbackToDate("");
    loadFeedback(1, "", "", "");
  }

  function resetContactFilters() {
    setContactSearch("");
    setContactFromDate("");
    setContactToDate("");
    loadContactRequests(1, "", "", "");
  }

  async function loadSubscriptionPlans(user: UserRow) {
    try {
      setSelectedSubscriptionUser(user);
      setPlansError("");
      setIsPlansLoading(true);
      const response = await fetch(`${API_BASE_URL}/subscription-plans`);
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to load plans");
      }

      setSubscriptionPlans(result.data.plans);
      setSelectedPlanId(result.data.plans[0]?.publicId || "");
      setPlanAmount(result.data.plans[0]?.amount ? String(result.data.plans[0].amount) : "");
    } catch (error) {
      setPlansError(error instanceof Error ? error.message : "Unable to load plans");
    } finally {
      setIsPlansLoading(false);
    }
  }

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3000);
  }

  async function updateSubscriptionPlan() {
    if (!selectedSubscriptionUser || !adminUser?.token) {
      return;
    }

    try {
      setIsUpdatingPlan(true);
      const subscriptionStartedAt = new Date();
      const subscriptionDueAt = new Date(subscriptionStartedAt);

      subscriptionDueAt.setMonth(subscriptionDueAt.getMonth() + 1);

      const response = await fetch(`${API_BASE_URL}/admin/users/${selectedSubscriptionUser.publicId}/subscription`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionStatus: "active",
          subscriptionStartedAt: subscriptionStartedAt.toISOString(),
          subscriptionDueAt: subscriptionDueAt.toISOString(),
          subscriptionEndsAt: subscriptionDueAt.toISOString(),
          amount: Number(planAmount),
        }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update subscription");
      }

      setSelectedSubscriptionUser(null);
      showToast("success", "Subscription updated successfully");
      loadUsers(usersData?.pagination.page || 1);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to update subscription");
    } finally {
      setIsUpdatingPlan(false);
    }
  }

  function openLoanUpdate(loan: LoanRow) {
    setSelectedLoan(loan);
    setLoanUpdateStatus(loan.status || "in_review");
    setLoanRemarks("");
  }

  async function updateLoanStatus() {
    if (!selectedLoan || !adminUser?.token) {
      return;
    }

    try {
      setIsUpdatingLoan(true);
      const response = await fetch(`${API_BASE_URL}/admin/loans/${selectedLoan.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: loanUpdateStatus,
          remarks: loanRemarks,
        }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Unable to update loan");
      }

      setSelectedLoan(null);
      showToast("success", "Loan updated successfully");
      await loadLoans(loansData?.pagination.page || 1, loansSearch, loansStatus);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Unable to update loan");
    } finally {
      setIsUpdatingLoan(false);
    }
  }

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 560px)");

    function syncSidebar() {
      setIsSidebarCollapsed(mediaQuery.matches);
    }

    syncSidebar();
    mediaQuery.addEventListener("change", syncSidebar);

    return () => mediaQuery.removeEventListener("change", syncSidebar);
  }, []);

  useEffect(() => {
    setIsMobileFiltersOpen(false);
    const routeView = routeViews[pathname];

    if (routeView) {
      setActiveView(routeView);

      setIsGeneralMenuOpen(["General", "Website Settings", "Homepage Themes", "Legal Center", "Notifications", "FAQs"].includes(routeView));
      setIsUserManagementMenuOpen(routeView === "Users");
      setIsEmployeeManagementMenuOpen(routeView === "Employees" || routeView === "Roles" || routeView === "Login History");
      setIsSubscriptionsMenuOpen(routeView === "Basic Subscriptions" || routeView === "Repair Subscriptions");
      setIsPlansBenefitsMenuOpen(routeView === "Plans & Benefits" || routeView === "Basic Plan");
      setIsServicesMenuOpen(routeView === "Credit Repair" || routeView === "Disputes");
      setIsRevenueMenuOpen(routeView === "Basic Subscription" || routeView === "Repair Service Subscription");
      setIsReportsMenuOpen(routeView === "Report Downloads" || routeView === "Download CIBIL" || routeView === "Manual Report");

      if (routeView === "Plans & Benefits") {
        setPlansBenefitsTab("repair");
      }
    }

    if (pathname === "/login") {
      setStep("mobile");
    }

    if (pathname === "/otp") {
      const otpMobile = sessionStorage.getItem("scorecare_otp_mobile");

      if (otpMobile) {
        setMobile(otpMobile);
      }

      setStep("otp");
    }
  }, [pathname]);

  useEffect(() => {
    if (activeView === "General" && adminUser?.token && !hasLoadedGeneral && !isGeneralLoading) {
      loadGeneralSettings();
    }
  }, [activeView, adminUser?.token, hasLoadedGeneral, isGeneralLoading]);

  useEffect(() => {
    if (activeView === "Website Settings" && adminUser?.token && !hasLoadedWebsiteSettings && !isWebsiteSettingsLoading) {
      loadWebsiteSettings();
    }
  }, [activeView, adminUser?.token, hasLoadedWebsiteSettings, isWebsiteSettingsLoading]);

  useEffect(() => {
    if (activeView === "Homepage Themes" && adminUser?.token && !hasLoadedHomepageThemes && !isHomepageThemesLoading) {
      loadHomepageThemes();
    }
  }, [activeView, adminUser?.token, hasLoadedHomepageThemes]);

  useEffect(() => {
    if (activeView === "Legal Center" && adminUser?.token && !hasLoadedLegalContent && !isLegalContentLoading) {
      loadLegalContent();
    }
  }, [activeView, adminUser?.token, hasLoadedLegalContent, isLegalContentLoading]);

  useEffect(() => {
    if (activeView === "FAQs" && adminUser?.token && !hasLoadedFaqs && !isFaqsLoading) {
      loadFaqs();
    }
  }, [activeView, adminUser?.token, hasLoadedFaqs, isFaqsLoading]);

  useEffect(() => {
    if (adminUser?.token) {
      loadAdminNotifications(1);
    }
  }, [adminUser?.token]);

  useEffect(() => {
    if (activeView === "Notifications" && notificationsTab === "notifications" && adminUser?.token) {
      loadAppNotifications();
    }
  }, [activeView, notificationsTab, adminUser?.token]);

  useEffect(() => {
    if (activeView === "Notifications" && notificationsTab === "users" && adminUser?.token && !notificationUsersData && !isNotificationsLoading) {
      loadNotificationUsers();
    }
  }, [activeView, notificationsTab, adminUser?.token, notificationUsersData, isNotificationsLoading]);

  useEffect(() => {
    if (activeView === "Plans & Benefits" && adminUser?.token && !hasLoadedAdminPlans && !isAdminPlansLoading) {
      loadAdminPlans();
    }
  }, [activeView, adminUser?.token, hasLoadedAdminPlans, isAdminPlansLoading]);

  useEffect(() => {
    if (activeView === "Basic Plan" && adminUser?.token && !hasLoadedBasicPlan && !isBasicPlanLoading) {
      loadBasicPlan();
    }
  }, [activeView, adminUser?.token, hasLoadedBasicPlan, isBasicPlanLoading]);

  useEffect(() => {
    if (activeView === "Plans & Benefits" && adminUser?.token && plansBenefitsTab === "repair" && !hasLoadedCibilRepair && !isCibilRepairLoading) {
      loadCibilRepairContent();
    }
  }, [activeView, adminUser?.token, plansBenefitsTab, hasLoadedCibilRepair, isCibilRepairLoading]);

  useEffect(() => {
    if (!shouldScrollToNewCibilRepairTimeline.current) {
      return;
    }

    newCibilRepairTimelineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    shouldScrollToNewCibilRepairTimeline.current = false;
  }, [cibilRepairContent.timelines.length]);

  useEffect(() => {
    if ((activeView === "Users" || activeView === "Basic Subscriptions") && adminUser?.token && !usersData && !isUsersLoading) {
      loadUsers();
    }
  }, [activeView, adminUser?.token, usersData, isUsersLoading]);

  useEffect(() => {
    if (activeView === "Report Downloads" && adminUser?.token && !reportDownloadsData && !isReportDownloadsLoading) {
      loadReportDownloads();
    }
  }, [activeView, adminUser?.token, reportDownloadsData, isReportDownloadsLoading]);

  useEffect(() => {
    if (activeView === "API Logs" && adminUser?.token) {
      setApiLogsData(null);
      loadApiLogs();
    }
  }, [activeView, adminUser?.token]);

  useEffect(() => {
    if (activeView === "Download CIBIL" && adminUser?.token && !cibilUsersData && !isCibilUsersLoading) {
      loadCibilUsers();
    }
  }, [activeView, adminUser?.token, cibilUsersData, isCibilUsersLoading]);

  useEffect(() => {
    if (activeView === "Manual Report" && manualReportTab === "downloads" && adminUser?.token && !manualReportDownloadsData && !isManualReportDownloadsLoading) {
      loadManualReportDownloads();
    }
  }, [activeView, manualReportTab, adminUser?.token, manualReportDownloadsData, isManualReportDownloadsLoading]);

  useEffect(() => {
    if (activeView === "Employees" && adminUser?.token && !employeesData && !isEmployeesLoading) {
      loadEmployees();
      loadEmployeeRoles();
    }
  }, [activeView, adminUser?.token, employeesData, isEmployeesLoading]);

  useEffect(() => {
    if (activeView === "Roles" && adminUser?.token && !employeeRolesData && !isEmployeeRolesLoading) {
      loadEmployeeRoles();
      loadEmployeeMenuAccess();
    }
  }, [activeView, adminUser?.token, employeeRolesData, isEmployeeRolesLoading]);

  useEffect(() => {
    if (activeView === "Login History" && adminUser?.token && !loginEventsData && !isLoginEventsLoading) {
      loadLoginEvents();
    }
  }, [activeView, adminUser?.token, loginEventsData, isLoginEventsLoading]);

  useEffect(() => {
    if (activeView === "Feedback" && adminUser?.token && !feedbackData && !isFeedbackLoading) {
      loadFeedback();
    }
  }, [activeView, adminUser?.token, feedbackData, isFeedbackLoading]);

  useEffect(() => {
    if (activeView === "Contact Us" && adminUser?.token && !contactRequestsData && !isContactLoading) {
      loadContactRequests();
    }
  }, [activeView, adminUser?.token, contactRequestsData, isContactLoading]);

  useEffect(() => {
    if (activeView === "Loans" && adminUser?.token && !loansData && !isLoansLoading) {
      loadLoans();
    }
  }, [activeView, adminUser?.token, loansData, isLoansLoading]);

  useEffect(() => {
    if (activeView === "Credit Repair" && adminUser?.token && !creditRepairData && !isCreditRepairLoading) {
      loadCreditRepairRequests();
    }
  }, [activeView, adminUser?.token, creditRepairData, isCreditRepairLoading]);

  useEffect(() => {
    if (activeView === "Disputes" && adminUser?.token && !disputesData && !isDisputesLoading) {
      loadDisputes();
    }
  }, [activeView, adminUser?.token, disputesData, isDisputesLoading]);

  useEffect(() => {
    if (activeView === "Basic Subscription" && adminUser?.token && !basicSubscriptionsData && !isBasicSubscriptionsLoading) {
      loadBasicSubscriptions();
    }
  }, [activeView, adminUser?.token, basicSubscriptionsData, isBasicSubscriptionsLoading]);

  useEffect(() => {
    if ((activeView === "Repair Service Subscription" || activeView === "Repair Subscriptions") && adminUser?.token && !repairSubscriptionsData && !isRepairSubscriptionsLoading) {
      loadRepairSubscriptions();
    }
  }, [activeView, adminUser?.token, repairSubscriptionsData, isRepairSubscriptionsLoading]);

  useEffect(() => {
    if (activeView === "Chats" && adminUser?.token && !chatsData && !isChatsLoading) {
      loadChats();
    }
  }, [activeView, adminUser?.token, chatsData, isChatsLoading]);

  useEffect(() => {
    if (step !== "otp") {
      return;
    }

    setResendSeconds(45);

    const timer = window.setInterval(() => {
      setResendSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, mobile]);

  useEffect(() => {
    const savedAdmin = sessionStorage.getItem("scorecare_admin") || localStorage.getItem("scorecare_admin");

    if (!savedAdmin) {
      if (!["/login", "/otp"].includes(pathname)) {
        router.replace("/login");
      }

      setIsSessionChecking(false);
      return;
    }

    const savedAdminSession = savedAdmin;

    async function restoreSession() {
      try {
        const admin = JSON.parse(savedAdminSession) as AdminUser;

        if (!admin.token) {
          sessionStorage.removeItem("scorecare_admin");
          localStorage.removeItem("scorecare_admin");
          setIsSessionChecking(false);
          return;
        }

        sessionStorage.setItem("scorecare_admin", savedAdminSession);
        localStorage.setItem("scorecare_admin", savedAdminSession);
        setAdminUser(admin);
        const permissions = await loadUserPermissions(admin.token);
        const isValidSession = permissions ? await loadDashboardCounts(admin.token) : false;

        if (isValidSession && permissions) {
          const currentRouteView = routeViews[pathname] || "Dashboard";
          const routeView = hasViewPermission(currentRouteView, permissions) ? currentRouteView : getFirstAllowedView(permissions);

          if (!routeView) {
            setStep("mobile");
            router.replace("/login");
            return;
          }

          setActiveView(routeView);
          setStep("admin");
          router.replace(viewRoutes[routeView]);
          loadAdminViewData(routeView);
        }
      } catch {
        sessionStorage.removeItem("scorecare_admin");
        localStorage.removeItem("scorecare_admin");
        router.replace("/login");
      } finally {
        setIsSessionChecking(false);
      }
    }

    restoreSession();
  }, []);

  async function submitMobile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mobile.length !== 10) {
      setError("Enter a valid 10 digit mobile number");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: mobile }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send OTP");
      }

      sessionStorage.setItem("scorecare_otp_mobile", mobile);
      setStep("otp");
      router.push("/otp");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to send OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function resendOtp() {
    const otpMobile = mobile || sessionStorage.getItem("scorecare_otp_mobile") || "";

    if (!otpMobile || resendSeconds > 0) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: otpMobile }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to resend OTP");
      }

      setOtp("");
      setMobile(otpMobile);
      sessionStorage.setItem("scorecare_otp_mobile", otpMobile);
      setResendSeconds(45);
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to resend OTP");
    } finally {
      setIsLoading(false);
    }
  }

  function goBackToMobile() {
    setOtp("");
    setAuthenticatorCode("");
    setMfaToken("");
    setAuthenticatorSetup(null);
    setError("");
    setStep("mobile");
    router.push("/login");
  }

  function updateOtpAtIndex(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = otp.padEnd(6, " ").split("");
    nextOtp[index] = digit || " ";

    setOtp(nextOtp.join("").replace(/\s/g, ""));

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pastedOtp = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(pastedOtp);
    otpInputRefs.current[Math.min(pastedOtp.length, 5)]?.focus();
  }

  async function completeAdminLogin(authData: any) {
    const user = authData.employee;

    if (!user) {
      setError("You do not have admin access");
      return;
    }

    const sessionUser = {
      token: authData.token,
      tokenType: authData.tokenType,
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      isAdmin: Boolean(user.isAdmin || user.role?.toLowerCase() === "admin"),
      loginEventId: authData.loginEventId,
    };

    sessionStorage.setItem("scorecare_admin", JSON.stringify(sessionUser));
    localStorage.setItem("scorecare_admin", JSON.stringify(sessionUser));
    sessionStorage.removeItem("scorecare_otp_mobile");
    setAdminUser(sessionUser);
    const permissions = await loadUserPermissions(authData.token);
    const isDashboardReady = permissions ? await loadDashboardCounts(authData.token) : false;

    if (isDashboardReady && permissions) {
      const routeView = getFirstAllowedView(permissions);

      if (!routeView) {
        setError("You do not have admin access");
        return;
      }

      setActiveView(routeView);
      setStep("admin");
      router.push(viewRoutes[routeView]);
    }
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const otpMobile = mobile || sessionStorage.getItem("scorecare_otp_mobile") || "";
      const response = await fetch(`${API_BASE_URL}/auth/admin/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: otpMobile, otp }),
      });
      const result = await response.json();

      if (!response.ok || (result.status && result.status !== "success")) {
        throw new Error(result.message || "Invalid OTP");
      }

      const authData = result.data || result;

      if (authData.requiresAuthenticator) {
        setMfaToken(authData.mfaToken);
        setAuthenticatorSetup(authData.authenticatorSetupRequired ? authData.authenticatorSetup : null);
        setAuthenticatorCode("");
        setStep("authenticator");
        return;
      }

      await completeAdminLogin(authData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitAuthenticator(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/verify-authenticator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mfaToken}`,
        },
        body: JSON.stringify({ code: authenticatorCode }),
      });
      const result = await response.json();

      if (!response.ok || (result.status && result.status !== "success")) {
        throw new Error(result.message || "Invalid authenticator code");
      }

      await completeAdminLogin(result.data || result);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid authenticator code");
    } finally {
      setIsLoading(false);
    }
  }

  function getProfileInitials() {
    const source = adminUser?.fullName || adminUser?.email || "Score Care";
    const parts = source.trim().split(/\s+/);
    const firstLetter = parts[0]?.[0] || "S";
    const lastLetter = (parts.length > 1 ? parts[parts.length - 1]?.[0] : source.trim().slice(-1)) || "C";

    return `${firstLetter}${lastLetter}`.toUpperCase();
  }

  async function logoutAdmin() {
    if (adminUser?.token) {
      try {
        await fetch(`${API_BASE_URL}/auth/admin/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${adminUser.token}` },
        });
      } catch {
        // continue local logout
      }
    }

    sessionStorage.removeItem("scorecare_admin");
    localStorage.removeItem("scorecare_admin");
    setAdminUser(null);
    setUserMenuAccess([]);
    setIsProfileOpen(false);
    setStep("mobile");
    router.push("/login");
  }

  if (step === "admin") {
    const monthlyRecords = dashboardCounts?.graphs.monthlyRecords ?? [];
    const accessTypeGraph = dashboardCounts?.graphs.usersByAccessType ?? [];
    const subscriptionStatusGraph = dashboardCounts?.graphs.subscriptionsByStatus ?? [];
    const feedbackRatingGraph = dashboardCounts?.graphs.feedbackByRating ?? [];
    const repairStatusGraph = dashboardCounts?.graphs.cibilRepairByStatus ?? [];
    const disputesStatusGraph = dashboardCounts?.graphs.disputesByStatus ?? [];
    const totalRevenue = dashboardCounts?.revenue?.total ?? dashboardCounts?.amount ?? 0;
    const kpiCards = [
      { label: "Users", value: dashboardCounts?.totalUsers ?? 0, meta: `${dashboardCounts?.newUsers ?? 0} new`, icon: dashboardIcons.users, trend: "2.29% ↗", view: "Users" as AppView, tone: "orange" },
      { label: "Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, meta: "Total collected", icon: dashboardIcons.revenue, trend: "2.19% ↗", view: "Basic Subscription" as AppView, tone: "green" },
      { label: "Subscriptions", value: dashboardCounts?.subscriptions ?? 0, meta: `${dashboardCounts?.upcomingOverdues ?? 0} past due`, icon: dashboardIcons.subscriptions, trend: "3.19% ↘", view: "Basic Subscriptions" as AppView, tone: "blue" },
      { label: "Credit Reports", value: dashboardCounts?.totalCreditReports ?? 0, meta: `${dashboardCounts?.reportsWithScore ?? 0} with score`, icon: dashboardIcons.reports, trend: "0.00% →", view: "Report Downloads" as AppView, tone: "purple" },
      { label: "Messages", value: dashboardCounts?.totalMessages ?? 0, meta: "Total chats", icon: dashboardIcons.messages, trend: "1.24% ↗", view: "Chats" as AppView, tone: "cyan" },
      { label: "Feedback", value: dashboardCounts?.totalFeedback ?? 0, meta: "User ratings", icon: dashboardIcons.feedback, trend: "2.02% ↗", view: "Feedback" as AppView, tone: "red" },
      { label: "Notifications", value: dashboardCounts?.totalNotifications ?? 0, meta: `${dashboardCounts?.unreadNotifications ?? 0} unread`, icon: dashboardIcons.notifications, trend: "0.00% →", view: "Notifications" as AppView, tone: "orange" },
      { label: "Employees", value: dashboardCounts?.employees?.total ?? 0, meta: `${dashboardCounts?.employees?.active ?? 0} active`, icon: dashboardIcons.employees, trend: "0.00% →", view: "Employees" as AppView, tone: "green" },
      { label: "Roles", value: dashboardCounts?.roles?.total ?? 0, meta: `${dashboardCounts?.roles?.active ?? 0} active`, icon: dashboardIcons.roles, trend: "0.00% →", view: "Roles" as AppView, tone: "blue" },
      { label: "API History", value: dashboardCounts?.apiHistoryCount ?? 0, meta: "Credit bureau requests", icon: dashboardIcons.apiLogs, trend: "0.00% →", view: "API Logs" as AppView, tone: "purple" },
    ];
    const pieColors = ["#1769e0", "#13a8a8", "#f59e0b", "#ef4444", "#7c3aed"];
    const subscriptionColors = ["#1769e0", "#13a8a8", "#f59e0b", "#ef4444"];
    const revenueBreakdown = dashboardCounts?.revenue
      ? [{
        name: "Revenue",
        subscriptionRevenue: dashboardCounts.revenue.subscriptions,
        cibilRepairRevenue: dashboardCounts.revenue.cibilRepair,
      }]
      : [];
    const feedbackBars = [1, 2, 3, 4, 5].map((rating) => {
      const item = feedbackRatingGraph.find((entry) => Number(entry.label) === rating);

      return {
        rating: `${rating} Star`,
        count: item?.count ?? 0,
        percentage: item?.percentage ?? 0,
      };
    });
    const hasFeedbackData = feedbackBars.some((item) => item.count > 0);
    const dashboardTooltip = ({ active, payload, label }: any) => {
      if (!active || !payload?.length) {
        return null;
      }

      return (
        <div className="analytics-tooltip">
          {label ? <strong>{label}</strong> : null}
          {payload.map((item: any) => (
            <span key={item.name || item.dataKey} style={{ color: item.color }}>
              {item.name}: {String(item.dataKey).toLowerCase().includes("revenue") ? `₹${Number(item.value || 0).toLocaleString("en-IN")}` : item.value}
            </span>
          ))}
        </div>
      );
    };
    const canCreateHomepageThemes = hasActionPermission("Homepage Themes", "create");
    const canUpdateHomepageThemes = hasActionPermission("Homepage Themes", "update");
    const canDeleteHomepageThemes = hasActionPermission("Homepage Themes", "delete");
    const canUpdateGeneral = hasActionPermission("General", "update");
    const canUpdateWebsiteSettings = hasActionPermission("Website Settings", "update");
    const canUpdateLegal = hasActionPermission("Legal Center", "update");
    const canCreateNotifications = hasActionPermission("Notifications", "create");
    const canCreateFaqs = hasActionPermission("FAQs", "create");
    const canUpdateFaqs = hasActionPermission("FAQs", "update");
    const canDeleteFaqs = hasActionPermission("FAQs", "delete");
    const canCreatePlans = hasActionPermission("Plans & Benefits", "create");
    const canUpdatePlans = hasActionPermission("Plans & Benefits", "update");
    const canDeletePlans = hasActionPermission("Plans & Benefits", "delete");
    const canUpdateBasicPlan = hasActionPermission("Basic Plan", "update");
    const canUpdateCreditRepair = hasActionPermission("Credit Repair", "update");
    const canManageCreditRepairAdminFields = Boolean(adminUser?.isAdmin);
    const canUpdateDisputes = hasActionPermission("Disputes", "update");
    const canCreateManualReport = hasActionPermission("Manual Report", "create");
    const canExportUsers = hasActionPermission("Users", "export");
    const canCreateEmployees = hasActionPermission("Employees", "create");
    const canUpdateEmployees = hasActionPermission("Employees", "update");
    const canDeleteEmployees = hasActionPermission("Employees", "delete");
    const canCreateRoles = hasActionPermission("Roles", "create");
    const canUpdateRoles = hasActionPermission("Roles", "update");
    const canDeleteRoles = hasActionPermission("Roles", "delete");
    const canUpdateSubscriptions = hasActionPermission("Basic Subscriptions", "update");
    const canExportLoans = hasActionPermission("Loans", "export");
    const canUpdateLoans = hasActionPermission("Loans", "update");
    const loadedUsers = usersData?.users ?? [];
    const userStatusCards = [
      {
        label: "OTP login, no PAN",
        value: usersData?.counts?.otp_login_no_pan ?? loadedUsers.filter((user) => !user.panNumber).length,
        status: "otp_login_no_pan",
        tone: "default",
      },
      {
        label: "PAN submitted",
        value: usersData?.counts?.pan_submitted ?? loadedUsers.filter((user) => Boolean(user.panNumber)).length,
        status: "pan_submitted",
        tone: "default",
      },
      {
        label: "Checkout started",
        value: usersData?.counts?.checkout_started ?? loadedUsers.filter((user) => /checkout|pending|initiated/i.test(user.subscriptionStatus)).length,
        status: "checkout_started",
        tone: "warning",
      },
      {
        label: "Subscribed",
        value: usersData?.counts?.subscribed ?? loadedUsers.filter((user) => /active|subscribed/i.test(user.subscriptionStatus)).length,
        status: "subscribed",
        tone: "success",
      },
    ];
    const usersColumns = ["Name", "Mobile", "Email", "Access", "Subscription", "Started At", "Due At", "Credit Score", "Messages", "Loans", "Status"];
    const usersRows = usersData?.users.map((user) => [
      user.fullName,
      user.mobileNumber,
      user.email,
      user.accessType,
      user.subscriptionStatus,
      formatDate(user.subscriptionStartedAt),
      formatDate(user.subscriptionDueAt),
      user.creditScore || "-",
      user.totalMessages,
      user.loans.latestStatus || user.loans.total,
      user.status,
    ]) ?? [];
    const cibilUserColumns = ["Name", "Mobile", "Email", "PAN", "CIBIL Score", "Status", "Action"];
    const cibilUserRows = cibilUsersData?.users.map((user) => [
      user.fullName,
      user.mobileNumber,
      user.email,
      user.panNumber || "-",
      user.creditScore || "-",
      user.status,
      <button
        aria-label={`Download CIBIL report for ${user.fullName}`}
        className="table-action download-report-action"
        disabled={downloadingCibilUserId === user.publicId}
        title="Download CIBIL report"
        type="button"
        onClick={() => downloadUserCibilReport(user)}
      >
        {downloadingCibilUserId === user.publicId ? <span className="api-loader" /> : (
          <svg className="button-icon" viewBox="0 0 24 24">
            <path d="M12 3v12M7 10l5 5 5-5M5 20h14" />
          </svg>
        )}
      </button>,
    ]) ?? [];
    const reportDownloadColumns = ["User", "Mobile", "Email", "PAN", "Report Type", "Provider", "CIBIL Score", "Fetched At", "Downloaded At"];
    const reportDownloadRows = reportDownloadsData?.downloads.map((download) => [
      download.fullName,
      download.mobileNumber,
      download.email,
      download.panNumber || "-",
      download.reportType,
      download.provider || "-",
      download.creditScore || "-",
      formatDate(download.reportFetchedAt),
      formatDate(download.downloadedAt),
    ]) ?? [];
    const apiLogColumns = [
      "Bureau",
      "Operation",
      "Method",
      "Endpoint",
      "Mobile / PAN",
      "Status",
      "HTTP",
      "Duration",
      "Requested By",
      "Created At",
    ];
    const apiLogRows = apiLogsData?.hits.map((hit) => [
      hit.bureauType.toUpperCase(),
      formatLabel(hit.operationType),
      hit.httpMethod || "-",
      hit.endpoint,
      [hit.mobile, hit.pan].filter(Boolean).join(" / ") || "-",
      hit.success ? "Success" : "Failed",
      hit.httpStatus ?? "-",
      `${hit.durationMs} ms`,
      hit.requestedByEmployeeName
        ? `${hit.requestedByEmployeeName}${hit.requestedByEmployeeCode ? ` (${hit.requestedByEmployeeCode})` : ""}`
        : hit.requestedByUserName || "-",
      formatDate(hit.createdAt),
    ]) ?? [];
    const manualReportDownloadColumns = ["Bureau", "Name", "Mobile", "PAN", "Credit Score", "PDF", "Downloaded By", "Downloaded At", "Action"];
    const manualReportDownloadRows = manualReportDownloadsData?.downloads.map((download) => [
      download.type.toUpperCase(),
      download.name || `${download.firstName || ""} ${download.lastName || ""}`.trim() || "-",
      download.mobile,
      download.pan,
      download.creditScore || "-",
      download.hasPdf ? "Available" : "Unavailable",
      download.downloadedByEmployeeName || download.downloadedByUserName || "-",
      formatDate(download.downloadedAt),
      <button
        aria-label={`Download ${download.type.toUpperCase()} report`}
        className="table-action download-report-action"
        disabled={!download.creditReportLink || downloadingManualReportId === download.id}
        title="Download report"
        type="button"
        onClick={() => downloadManualReportFile(download)}
      >
        {downloadingManualReportId === download.id ? <span className="api-loader" /> : (
          <svg className="button-icon" viewBox="0 0 24 24">
            <path d="M12 3v12M7 10l5 5 5-5M5 20h14" />
          </svg>
        )}
      </button>,
    ]) ?? [];
    const employeeColumns = [
      "Code",
      "Name",
      "Mobile",
      "Email",
      "Role",
      "Department",
      "Designation",
      "Status",
      "Joined At",
      ...(canUpdateEmployees || canDeleteEmployees ? ["Action"] : []),
    ];
    const employeeRows = employeesData?.employees.map((employee) => [
      employee.employeeCode,
      employee.fullName,
      employee.mobileNumber,
      employee.email,
      employee.role,
      employee.department,
      employee.designation,
      employee.status,
      formatDate(employee.joinedAt),
      ...(canUpdateEmployees || canDeleteEmployees
        ? [
          <div className="homepage-theme-row-actions">
            {canUpdateEmployees ? (
              <button type="button" onClick={() => openEmployeeModal(employee)}>
                <ActionIcon type="edit" />
                Edit
              </button>
            ) : null}
            {canDeleteEmployees ? (
              <button type="button" onClick={() => setDeletingEmployee(employee)}>
                <ActionIcon type="delete" />
                Delete
              </button>
            ) : null}
          </div>,
        ]
        : []),
    ]) ?? [];
    const employeeRoles = getEmployeeRoles({ data: employeeRolesData || undefined });
    const employeeRoleColumns = ["Role", "Description", "Status", "Menu Access", ...(canUpdateRoles || canDeleteRoles ? ["Action"] : [])];
    const employeeRoleRows = employeeRoles.map((role) => [
      role.roleName,
      role.description || "-",
      role.status,
      role.menuAccess?.length ?? "-",
      ...(canUpdateRoles || canDeleteRoles
        ? [
          <div className="homepage-theme-row-actions">
            {canUpdateRoles ? (
              <button type="button" onClick={() => openEmployeeRoleModal(role)}>
                <ActionIcon type="edit" />
                Edit
              </button>
            ) : null}
            {canDeleteRoles ? (
              <button type="button" onClick={() => setDeletingEmployeeRole(role)}>
                <ActionIcon type="delete" />
                Delete
              </button>
            ) : null}
          </div>,
        ]
        : []),
    ]);
    const loginEventColumns = ["Employee", "Email", "Mobile", "Role", "IP Address", "Login At", "Logout At"];
    const loginEventRows = loginEventsData?.loginEvents.map((event) => [
      event.employeeName || event.fullName || event.employeeCode || "-",
      event.email || "-",
      event.mobileNumber || "-",
      event.role || "-",
      event.ipAddress || "-",
      formatDateTime(event.loginAt || event.loggedInAt || event.createdAt || null),
      formatDateTime(event.logoutAt || event.loggedOutAt || null),
    ]) ?? [];
    const subscriptionColumns = ["Name", "Mobile", "Email", "Plan", "Started At", "Due At", "Updated By", "Status", ...(canUpdateSubscriptions ? ["Action"] : [])];
    const subscriptionRows = usersData?.users.map((user) => [
      user.fullName,
      user.mobileNumber,
      user.email,
      user.subscriptionStatus,
      formatDate(user.subscriptionStartedAt),
      formatDate(user.subscriptionDueAt),
      user.planUpdatedByUserName || "-",
      user.status,
      ...(canUpdateSubscriptions
        ? [
          <div className="subscription-actions">
            <button className="table-action primary" type="button" onClick={() => loadSubscriptionPlans(user)}>
              <ActionIcon type="edit" />
              Update
            </button>
          </div>,
        ]
        : []),
    ]) ?? [];
    const notificationPageUserIds = notificationUsersData?.users.map((user) => user.publicId) || [];
    const areAllNotificationUsersSelected =
      notificationPageUserIds.length > 0 && notificationPageUserIds.every((id) => selectedNotificationUserIds.includes(id));
    const notificationUserColumns = [
      ...(canCreateNotifications ? [<input checked={areAllNotificationUsersSelected} type="checkbox" onChange={toggleAllNotificationUsers} />] : []),
      "Name",
      "PAN",
      "DOB",
      "Mobile",
      "CIBIL Score",
      "Subscription Type",
      "Due Date",
      ...(canCreateNotifications ? ["Action"] : []),
    ];
    const notificationUserRows = notificationUsersData?.users.map((user) => [
      ...(canCreateNotifications
        ? [<input checked={selectedNotificationUserIds.includes(user.publicId)} type="checkbox" onChange={() => toggleNotificationUser(user.publicId)} />]
        : []),
      user.fullName,
      user.panNumber || "-",
      formatDate(user.dob || user.dateOfBirth || null),
      user.mobileNumber,
      user.creditScore || "-",
      user.subscriptionStatus || "-",
      formatDate(user.subscriptionDueAt),
      ...(canCreateNotifications
        ? [
          <button className="table-action" type="button" onClick={() => openNotificationModal("users", user.publicId)}>
            Send Notification
          </button>,
        ]
        : []),
    ]) ?? [];
    const notificationColumns = ["Type", "Title", "Message", "Status", "Created At", "Action"];
    const notificationRows = appNotificationsData?.notifications.map((notification) => [
      notification.type || "-",
      notification.title || "-",
      notification.message || "-",
      notification.isRead || notification.readAt ? "Read" : "Unread",
      formatDate(notification.createdAt || null),
      notification.isRead || notification.readAt ? "-" : (
        <button
          className="table-action"
          disabled={isNotificationMarking}
          type="button"
          onClick={() => markAdminNotificationRead(notification.publicId)}
        >
          Mark read
        </button>
      ),
    ]) ?? [];
    const loanColumns = [
      "Name",
      "Mobile",
      "PAN",
      "Email",
      "Amount",
      "Loan Type",
      "Employment",
      "Income",
      "Experience",
      "Status",
      "Remarks",
      "Updated By",
      "Created At",
      ...(canExportLoans || canUpdateLoans ? ["Action"] : []),
    ];
    const loanRows = loansData?.loans.map((loan) => [
      loan.user.fullName,
      loan.user.mobileNumber,
      loan.user.panNumber,
      loan.user.email,
      `₹${loan.loanAmount}`,
      getLoanTypeLabel(loan.loanType),
      loan.employmentType,
      `₹${loan.monthlyIncome}`,
      loan.workExperience,
      loan.status,
      loan.remarks || "-",
      loan.updatedBy ? `${loan.updatedBy.fullName} (${loan.updatedBy.mobileNumber})` : "-",
      formatDate(loan.createdAt),
      ...(canExportLoans || canUpdateLoans
        ? [
          <div className="table-actions">
            {canExportLoans ? (
              <button className="table-action" disabled={downloadingLoanId === loan.id} type="button" onClick={() => downloadLoanDetails(loan)}>
                {downloadingLoanId === loan.id ? "Downloading..." : "Download"}
              </button>
            ) : null}
            {canUpdateLoans ? (
              <button className="table-action" type="button" onClick={() => openLoanUpdate(loan)}>
                <ActionIcon type="edit" />
                Update
              </button>
            ) : null}
          </div>,
        ]
        : []),
    ]) ?? [];
    const creditRepairColumns = [
      "User",
      "Mobile",
      "Email",
      "Plan",
      "Amount",
      "Payment Status",
      "Repair Status",
      "Assigned To",
      "Accounts",
      "Documents",
      "Remarks",
      "Created At",
      "Updated At",
      "Active Disputes",
      "Resolved Disputes",
      "Points Gained",
      ...(canUpdateCreditRepair ? ["Action"] : []),
    ];
    const creditRepairRows = creditRepairData?.requests.map((request) => {
      const documents = (request.documents || []).map((document) => ({
        documentType: document.documentType || "document",
        documentUrl: document.documentUrl || "",
      })).filter((document) => document.documentUrl);

      return [
        request.userName || "-",
        request.mobileNumber || "-",
        request.email || "-",
        request.planName || "-",
        `${request.currency || "INR"} ${Number(request.amount || 0).toLocaleString("en-IN")}`,
        formatLabel(request.paymentStatus),
        formatLabel(request.repairStatus),
        request.assignedEmployee?.fullName || "-",
        request.accounts?.length ? (
          <div className="credit-repair-accounts">
            {request.accounts.map((account, index) => (
              <span key={`${account.accountNumber}-${index}`}>
                <strong>{account.subscriberName || "-"}</strong>
                {account.accountType || "-"} · {account.accountNumber || "-"} · {account.issueType || "-"}
              </span>
            ))}
          </div>
        ) : "-",
        documents.length ? (
          <div className="dispute-documents">
            {documents.map((document, index) => (
              <a
                className="table-action"
                href={document.documentUrl}
                key={`${document.documentUrl}-${index}`}
                rel="noreferrer"
                target="_blank"
              >
                {formatLabel(document.documentType || `Document ${index + 1}`)}
              </a>
            ))}
          </div>
        ) : "-",
        request.remarks || "-",
        formatDate(request.createdAt || null),
        formatDate(request.updatedAt || null),
        request.activeDisputes ?? 0,
        request.resolvedDisputes ?? 0,
        request.pointsGained ?? 0,
        ...(canUpdateCreditRepair ? [
          <button className="table-action" type="button" onClick={() => openCreditRepairUpdate(request)}>
            <ActionIcon type="edit" />Update
          </button>,
        ] : []),
      ];
    }) ?? [];
    const disputeColumns = ["User", "Account", "Dispute", "Documents", "Status", "Progress", "Timeline", ...(canUpdateDisputes ? ["Action"] : [])];
    const disputeRows = disputesData?.disputes.map((dispute) => [
      <div className="dispute-table-cell">
        <strong>{dispute.userName || "-"}</strong>
        <span>{dispute.mobileNumber || "-"}</span>
        <span>{dispute.email || "-"}</span>
      </div>,
      <div className="dispute-table-cell">
        <strong>{dispute.lenderName || dispute.accountData?.lenderName || "-"}</strong>
        <span>{dispute.accountData?.accountType || "-"}</span>
        <span>{dispute.accountNumber || dispute.accountData?.accountNumber || "-"}</span>
      </div>,
      <div className="dispute-table-cell">
        <strong>{dispute.errorType || "-"}</strong>
        <span>{dispute.bureaus?.join(", ") || "-"}</span>
        {dispute.additionalDetails ? <span>{dispute.additionalDetails}</span> : null}
        {dispute.remarks ? <span>Remarks: {dispute.remarks}</span> : null}
      </div>,
      dispute.documents && Object.keys(dispute.documents).length ? (
        <div className="dispute-documents">
          {Object.entries(dispute.documents).map(([name, url]) => (
            <a className="table-action" href={url} key={name} rel="noreferrer" target="_blank">{formatLabel(name)}</a>
          ))}
        </div>
      ) : "-",
      <span className="dispute-status">{formatLabel(dispute.status)}</span>,
      <div className="dispute-table-cell">
        <span>Step <strong>{dispute.progressStep ?? 0}</strong></span>
        <span>Points <strong>{dispute.pointsGained ?? 0}</strong></span>
      </div>,
      <div className="dispute-table-cell dispute-timeline">
        <span>Submitted <strong>{formatDate(dispute.submittedAt || dispute.createdAt || null)}</strong></span>
        <span>Resolved <strong>{formatDate(dispute.resolvedAt || null)}</strong></span>
        <span>Updated <strong>{formatDate(dispute.updatedAt || null)}</strong></span>
      </div>,
      ...(canUpdateDisputes ? [
        <button className="table-action" type="button" onClick={() => openDisputeUpdate(dispute)}>
          <ActionIcon type="edit" />Update
        </button>,
      ] : []),
    ]) ?? [];
    const basicSubscriptionColumns = ["User", "Mobile", "Email", "Plan", "Amount", "Payment Status", "Subscription Status", "Started At", "Due At", "Ends At", "Created At"];
    const basicSubscriptionRows = basicSubscriptionsData?.subscriptions.map((subscription) => [
      subscription.userName || subscription.fullName || subscription.user?.fullName || "-",
      subscription.mobileNumber || subscription.user?.mobileNumber || "-",
      subscription.email || subscription.user?.email || "-",
      subscription.planName || "Basic Plan",
      `${subscription.currency || "INR"} ${Number(subscription.amount || 0).toLocaleString("en-IN")}`,
      formatLabel(subscription.paymentStatus || "-"),
      formatLabel(subscription.subscriptionStatus || subscription.status || "-"),
      formatDate(subscription.subscriptionStartedAt || null),
      formatDate(subscription.subscriptionDueAt || null),
      formatDate(subscription.subscriptionEndsAt || null),
      formatDate(subscription.createdAt || null),
    ]) ?? [];
    const repairSubscriptionColumns = ["User", "Mobile", "Email", "Amount", "Payment Status", "Repair Status", "Active Repairs", "Resolved Repairs", "Closed Repairs", "Cancelled Repairs", "Created At"];
    const repairSubscriptionRows = repairSubscriptionsData?.requests.map((request) => [
      request.userName || "-",
      request.mobileNumber || "-",
      request.email || "-",
      `${request.currency || "INR"} ${Number(request.amount || 0).toLocaleString("en-IN")}`,
      formatLabel(request.paymentStatus),
      formatLabel(request.repairStatus),
      request.activeRepairRequests ?? 0,
      request.resolvedRepairRequests ?? 0,
      request.closedRepairRequests ?? 0,
      request.cancelledRepairRequests ?? 0,
      formatDate(request.createdAt || null),
    ]) ?? [];
    const chatColumns = ["User", "Mobile", "PAN", "Question ID", "Question", "Created At"];
    const chatRows = chatsData?.users?.flatMap((user) =>
      user.questions.map((question) => [
        user.fullName,
        user.mobileNumber,
        user.panNumber,
        question.id,
        question.question,
        formatDate(question.createdAt),
      ])
    ) ?? [];
    const feedbackColumns = ["User", "Mobile", "Email", "Rating", "Reaction", "Message", "Created At"];
    const feedbackRows = feedbackData?.feedbacks.map((feedback) => [
      feedback.user?.fullName || "-",
      feedback.user?.mobileNumber || "-",
      feedback.user?.email || "-",
      feedback.rating,
      feedback.isLiked ? "Liked" : feedback.isDisliked ? "Disliked" : "-",
      feedback.message || "-",
      formatDate(feedback.createdAt),
    ]) ?? [];
    const contactColumns = ["Name", "Email", "Message", "Created At"];
    const contactRows = contactRequestsData?.contactRequests.map((request) => [
      request.fullName || request.name || `${request.firstName || ""} ${request.lastName || ""}`.trim() || "-",
      request.emailAddress || request.email || "-",
      request.message || "-",
      formatDate(request.createdAt || null),
    ]) ?? [];

    return (
      <main className="admin-layout">
        <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-brand">
            <img src="/scorecare-logo-sidebar.png" alt="ScoreCare" />
            {/* <button className="sidebar-close" type="button" onClick={() => setIsSidebarCollapsed(true)}>
              ×
            </button> */}
          </div>
          <nav>
                    {hasViewPermission("Dashboard") ? (
                      <button className={activeView === "Dashboard" ? "active" : ""} type="button" onClick={() => openAdminView("Dashboard")}>
                        <span className="menu-icon">{menuIcons.Dashboard}</span>
                        Dashboard
                      </button>
                    ) : null}
                    {["General", "Website Settings", "Homepage Themes", "Legal Center", "Notifications", "FAQs"].some((view) => hasViewPermission(view as AppView)) ? (
                      <div className={`sidebar-group ${activeView === "General" || activeView === "Website Settings" || activeView === "Homepage Themes" || activeView === "Legal Center" || activeView === "Notifications" || activeView === "FAQs" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsGeneralMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.General}</span>
                          General
                          <span className="sidebar-chevron">{isGeneralMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isGeneralMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("General") ? <button className={activeView === "General" ? "active" : ""} type="button" onClick={() => openAdminView("General")}><span className="menu-icon">{menuIcons["Site Settings"]}</span>Site Settings</button> : null}
                            {hasViewPermission("Website Settings") ? <button className={activeView === "Website Settings" ? "active" : ""} type="button" onClick={() => openAdminView("Website Settings")}><span className="menu-icon">{menuIcons["Site Settings"]}</span>Website Settings</button> : null}
                            {hasViewPermission("Homepage Themes") ? <button className={activeView === "Homepage Themes" ? "active" : ""} type="button" onClick={() => openAdminView("Homepage Themes")}><span className="menu-icon">{menuIcons["Homepage Themes"]}</span>Homepage Themes</button> : null}
                            {hasViewPermission("Legal Center") ? <button className={activeView === "Legal Center" ? "active" : ""} type="button" onClick={() => openAdminView("Legal Center")}><span className="menu-icon">{menuIcons["Legal Center"]}</span>Legal Center</button> : null}
                            {hasViewPermission("Notifications") ? <button className={activeView === "Notifications" ? "active" : ""} type="button" onClick={() => openAdminView("Notifications")}><span className="menu-icon">{menuIcons.Notifications}</span>Notifications</button> : null}
                            {hasViewPermission("FAQs") ? <button className={activeView === "FAQs" ? "active" : ""} type="button" onClick={() => openAdminView("FAQs")}><span className="menu-icon">{menuIcons.FAQ}</span>FAQ</button> : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Users") ? (
                      <div className={`sidebar-group ${activeView === "Users" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsUserManagementMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.Users}</span>
                          User management
                          <span className="sidebar-chevron">{isUserManagementMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isUserManagementMenuOpen ? (
                          <div className="sidebar-submenu">
                            <button className={activeView === "Users" ? "active" : ""} type="button" onClick={() => openAdminView("Users")}>
                              <span className="menu-icon">{menuIcons.Users}</span>
                              Users
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Employees") || hasViewPermission("Roles") || hasViewPermission("Login History") ? (
                      <div className={`sidebar-group ${activeView === "Employees" || activeView === "Roles" || activeView === "Login History" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsEmployeeManagementMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.Users}</span>
                          Employee management
                          <span className="sidebar-chevron">{isEmployeeManagementMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isEmployeeManagementMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("Employees") ? <button className={activeView === "Employees" ? "active" : ""} type="button" onClick={() => openAdminView("Employees")}><span className="menu-icon">{menuIcons.Users}</span>Employees</button> : null}
                            {hasViewPermission("Roles") ? <button className={activeView === "Roles" ? "active" : ""} type="button" onClick={() => openAdminView("Roles")}><span className="menu-icon">{menuIcons.Users}</span>Roles</button> : null}
                            {hasViewPermission("Login History") ? <button className={activeView === "Login History" ? "active" : ""} type="button" onClick={() => openAdminView("Login History")}><span className="menu-icon">{menuIcons.Users}</span>Login History</button> : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Basic Subscriptions") || hasViewPermission("Repair Subscriptions") ? (
                      <div className={`sidebar-group ${activeView === "Basic Subscriptions" || activeView === "Repair Subscriptions" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsSubscriptionsMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.Subscriptions}</span>
                          Subscriptions
                          <span className="sidebar-chevron">{isSubscriptionsMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isSubscriptionsMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("Basic Subscriptions") ? <button className={activeView === "Basic Subscriptions" ? "active" : ""} type="button" onClick={() => openAdminView("Basic Subscriptions")}><span className="menu-icon">{menuIcons.Subscriptions}</span>Basic Subscriptions</button> : null}
                            {hasViewPermission("Repair Subscriptions") ? <button className={activeView === "Repair Subscriptions" ? "active" : ""} type="button" onClick={() => openAdminView("Repair Subscriptions")}><span className="menu-icon">{menuIcons.Subscriptions}</span>Repair Subscriptions</button> : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Plans & Benefits") || hasViewPermission("Basic Plan") ? (
                      <div className={`sidebar-group ${activeView === "Plans & Benefits" || activeView === "Basic Plan" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsPlansBenefitsMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons["Plans & Benefits"]}</span>
                          Plans & Benefits
                          <span className="sidebar-chevron">{isPlansBenefitsMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isPlansBenefitsMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("Plans & Benefits") ? (
                              <button className={activeView === "Plans & Benefits" && plansBenefitsTab === "repair" ? "active" : ""} type="button" onClick={() => openPlansBenefitsTab("repair")}>
                                <span className="menu-icon">{menuIcons["Plans & Benefits"]}</span>
                                Repair service
                              </button>
                            ) : null}
                            {hasViewPermission("Basic Plan") ? (
                              <button className={activeView === "Basic Plan" ? "active" : ""} type="button" onClick={() => openAdminView("Basic Plan")}>
                                <span className="menu-icon">{menuIcons["Plans & Benefits"]}</span>
                                Basic plan
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Credit Repair") || hasViewPermission("Disputes") ? (
                      <div className={`sidebar-group ${activeView === "Credit Repair" || activeView === "Disputes" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsServicesMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.Services}</span>
                          Services
                          <span className="sidebar-chevron">{isServicesMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isServicesMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("Credit Repair") ? <button className={activeView === "Credit Repair" ? "active" : ""} type="button" onClick={() => openAdminView("Credit Repair")}><span className="menu-icon">{menuIcons.Services}</span>Credit Repair</button> : null}
                            {hasViewPermission("Disputes") ? <button className={activeView === "Disputes" ? "active" : ""} type="button" onClick={() => openAdminView("Disputes")}><span className="menu-icon">{menuIcons.Services}</span>Disputes</button> : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Basic Subscription") || hasViewPermission("Repair Service Subscription") ? (
                      <div className={`sidebar-group ${activeView === "Basic Subscription" || activeView === "Repair Service Subscription" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsRevenueMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.Revenue}</span>
                          Revenue
                          <span className="sidebar-chevron">{isRevenueMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isRevenueMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("Basic Subscription") ? <button className={activeView === "Basic Subscription" ? "active" : ""} type="button" onClick={() => openAdminView("Basic Subscription")}><span className="menu-icon">{menuIcons.Revenue}</span>Basic Subscription</button> : null}
                            {hasViewPermission("Repair Service Subscription") ? <button className={activeView === "Repair Service Subscription" ? "active" : ""} type="button" onClick={() => openAdminView("Repair Service Subscription")}><span className="menu-icon">{menuIcons.Revenue}</span>Repair Service Subscription</button> : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {hasViewPermission("Report Downloads") || hasViewPermission("Download CIBIL") || hasViewPermission("Manual Report") ? (
                      <div className={`sidebar-group ${activeView === "Report Downloads" || activeView === "Download CIBIL" || activeView === "Manual Report" ? "active" : ""}`}>
                        <button className="sidebar-group-toggle" type="button" onClick={() => setIsReportsMenuOpen((current) => !current)}>
                          <span className="menu-icon">{menuIcons.Reports}</span>
                          Reports
                          <span className="sidebar-chevron">{isReportsMenuOpen ? "⌄" : "›"}</span>
                        </button>
                        {isReportsMenuOpen ? (
                          <div className="sidebar-submenu">
                            {hasViewPermission("Report Downloads") ? <button className={activeView === "Report Downloads" ? "active" : ""} type="button" onClick={() => openAdminView("Report Downloads")}><span className="menu-icon">{menuIcons.Reports}</span>Downloads</button> : null}
                            {hasViewPermission("Download CIBIL") ? <button className={activeView === "Download CIBIL" ? "active" : ""} type="button" onClick={() => openAdminView("Download CIBIL")}><span className="menu-icon">{menuIcons.Reports}</span>Download CIBIL</button> : null}
                            {hasViewPermission("Manual Report") ? <button className={activeView === "Manual Report" ? "active" : ""} type="button" onClick={() => openAdminView("Manual Report")}><span className="menu-icon">{menuIcons.Reports}</span>Manual Report</button> : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
          </nav>
        </aside>
        <section className="content">
          <header className="topbar">
            <div className="topbar-actions">
              <button type="button" onClick={() => setIsSidebarCollapsed((current) => !current)}>
                ☰
              </button>
            </div>
            {/* <div className="search-box">⌕ <span>Search here...</span></div> */}
            <div className="topbar-profile">
              <div className="current-time" aria-label="Current time">
                <svg viewBox="0 0 24 24">
                  <path d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18" />
                </svg>
                <div>
                  <strong>{currentTime ? currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) : "--:--:--"}</strong>
                </div>
              </div>
              <button className="topbar-bell" type="button" onClick={openNotificationsDrawer}>
                {menuIcons.Notifications}
                {notificationsData?.unreadCount ? <span className="topbar-bell-count">{notificationsData.unreadCount}</span> : null}
              </button>
              <div className="profile-menu">
                <button
                  className="profile-logo"
                  type="button"
                  onClick={() => setIsProfileOpen((current) => !current)}
                >
                  {getProfileInitials()}
                </button>
                {isProfileOpen ? (
                  <div className="profile-dropdown">
                    <strong>{adminUser?.fullName || "Admin"}</strong>
                    <span>{adminUser?.email || "No email available"}</span>
                    <button type="button" onClick={logoutAdmin}>
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="dashboard-body">
            {activeView === "General" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>General</h2>
                    <p>Manage website contact settings</p>
                  </div>
                  {/* <span>{isGeneralLoading ? "Loading..." : "Settings"}</span> */}
                </section>

                {generalError ? <p className="dashboard-error">{generalError}</p> : null}

                <form className="general-form panel" onSubmit={updateGeneralSettings}>
                  {isGeneralLoading ? <span className="table-loader" /> : null}
                  <label>
                    Website
                    <input
                      required
                      value={generalFormSettings.website}
                      onChange={(event) => updateGeneralSetting("website", event.target.value)}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      value={generalFormSettings.email}
                      onChange={(event) => updateGeneralSetting("email", event.target.value)}
                    />
                  </label>
                  <label>
                    Mobile Number
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={generalFormSettings.mobileNumber}
                      onChange={(event) => updateGeneralSetting("mobileNumber", event.target.value.replace(/\D/g, ""))}
                    />
                  </label>
                  <label>
                    WhatsApp Number
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={generalFormSettings.whatsappNumber}
                      onChange={(event) => updateGeneralSetting("whatsappNumber", event.target.value.replace(/\D/g, ""))}
                    />
                  </label>
                  <label>
                    Address
                    <textarea
                      rows={4}
                      value={generalFormSettings.address}
                      onChange={(event) => updateGeneralSetting("address", event.target.value)}
                    />
                  </label>
                  <label>
                    Prompt Message
                    <textarea
                      rows={4}
                      value={generalFormSettings.prompt_message}
                      onChange={(event) => updateGeneralSetting("prompt_message", event.target.value)}
                    />
                  </label>
                  {/* <label>
                    Selected Language
                    <input
                      required
                      value={generalFormSettings.selectedLanguage}
                      onChange={(event) => updateGeneralSetting("selectedLanguage", event.target.value)}
                    />
                  </label> */}
                  {canUpdateGeneral ? (
                    <div className="general-actions">
                      <button disabled={isGeneralLoading || isGeneralSaving} type="submit">
                        {isGeneralSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : null}
                </form>
              </>
            ) : activeView === "Website Settings" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Website Settings</h2>
                    <p>Upload website PDF documents</p>
                  </div>
                </section>

                {websiteSettingsError ? <p className="dashboard-error">{websiteSettingsError}</p> : null}

                <form className="general-form panel" onSubmit={updateWebsiteSettings}>
                  {isWebsiteSettingsLoading ? <span className="table-loader" /> : null}
                  <label>
                    Privacy Policy
                    <input
                      accept="application/pdf"
                      type="file"
                      onChange={(event) => setWebsiteSettingsFiles((files) => ({ ...files, privacyPolicy: event.target.files?.[0] || null }))}
                    />
                    {(websiteSettingsFiles.privacyPolicy?.name || websiteSettingsData?.privacyPolicy) ? (
                      <span className="settings-file-name">{websiteSettingsFiles.privacyPolicy?.name || getWebsiteSettingsFileName(websiteSettingsData?.privacyPolicy)}</span>
                    ) : null}
                  </label>
                  <label>
                    Terms Of Service
                    <input
                      accept="application/pdf"
                      type="file"
                      onChange={(event) => setWebsiteSettingsFiles((files) => ({ ...files, termsOfService: event.target.files?.[0] || null }))}
                    />
                    {(websiteSettingsFiles.termsOfService?.name || websiteSettingsData?.termsOfService) ? (
                      <span className="settings-file-name">{websiteSettingsFiles.termsOfService?.name || getWebsiteSettingsFileName(websiteSettingsData?.termsOfService)}</span>
                    ) : null}
                  </label>
                  <label>
                    Disclaimer
                    <input
                      accept="application/pdf"
                      type="file"
                      onChange={(event) => setWebsiteSettingsFiles((files) => ({ ...files, disclaimer: event.target.files?.[0] || null }))}
                    />
                    {(websiteSettingsFiles.disclaimer?.name || websiteSettingsData?.disclaimer) ? (
                      <span className="settings-file-name">{websiteSettingsFiles.disclaimer?.name || getWebsiteSettingsFileName(websiteSettingsData?.disclaimer)}</span>
                    ) : null}
                  </label>
                  <label>
                    Account Deletion
                    <input
                      accept="application/pdf"
                      type="file"
                      onChange={(event) => setWebsiteSettingsFiles((files) => ({ ...files, accountDeletion: event.target.files?.[0] || null }))}
                    />
                    {(websiteSettingsFiles.accountDeletion?.name || websiteSettingsData?.accountDeletion) ? (
                      <span className="settings-file-name">{websiteSettingsFiles.accountDeletion?.name || getWebsiteSettingsFileName(websiteSettingsData?.accountDeletion)}</span>
                    ) : null}
                  </label>

                  {canUpdateWebsiteSettings ? (
                    <div className="general-actions">
                      <button disabled={isWebsiteSettingsLoading || isWebsiteSettingsSaving} type="submit">
                        {isWebsiteSettingsSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : null}
                </form>
              </>
            ) : activeView === "Homepage Themes" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Homepage Themes</h2>
                    <p>Update homepage theme images</p>
                  </div>
                  <span>{homepageThemes.length} themes</span>
                </section>

                {homepageThemesError ? <p className="dashboard-error">{homepageThemesError}</p> : null}

                <section className="homepage-themes-panel panel">
                  {canCreateHomepageThemes ? (
                    <div className="homepage-themes-actions">
                      <button type="button" onClick={() => openHomepageThemeModal()}>
                        <ActionIcon type="add" />
                        Add
                      </button>
                    </div>
                  ) : null}

                  {isHomepageThemesLoading ? <span className="table-loader" /> : null}

                  {!isHomepageThemesLoading && !homepageThemes.length ? (
                    <div className="empty-state compact">
                      <img src="/no-records.svg" alt="No records found" />
                      <strong>No homepage themes found</strong>
                    </div>
                  ) : null}

                  <div className="homepage-theme-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Image Name</th>
                          <th>Prev Image URL</th>
                          <th>Preview</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {homepageThemes.map((theme, themeIndex) => {
                          const imageUrl = getHomepageThemeImageUrl(theme.fileName);

                          return (
                            <tr key={`${theme.imageName}-${themeIndex}`}>
                              <td>{theme.imageName}</td>
                              <td>
                                <span>{imageUrl || "-"}</span>
                              </td>
                              <td>
                                {imageUrl ? <img src={imageUrl} alt={theme.imageName || "Homepage theme"} /> : "-"}
                              </td>
                              <td>
                                <div className="homepage-theme-row-actions">
                                  {canUpdateHomepageThemes ? (
                                    <button type="button" onClick={() => openHomepageThemeModal(theme)}>
                                      <ActionIcon type="edit" />
                                      Update
                                    </button>
                                  ) : null}
                                  {canDeleteHomepageThemes ? (
                                    <button type="button" onClick={() => openDeleteHomepageThemeModal(theme)}>
                                      <ActionIcon type="delete" />
                                      Delete
                                    </button>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : activeView === "Legal Center" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Legal Center</h2>
                    <p>Manage terms, privacy policy, and consent content</p>
                  </div>
                  {legalContent.updatedAt ? <span>Updated {new Date(legalContent.updatedAt).toLocaleDateString()}</span> : null}
                </section>

                {legalContentError ? <p className="dashboard-error">{legalContentError}</p> : null}

                <form className="legal-editor-panel panel" onSubmit={updateLegalContent}>
                  {isLegalContentLoading ? <span className="table-loader" /> : null}
                  <div className="legal-panel-heading">
                    <span>Editor</span>
                    <strong>Content Editor</strong>
                  </div>
                  <HtmlEditor
                    label="Terms and Conditions"
                    value={legalContent.termsAndConditions}
                    onChange={(value) => setLegalContent((content) => ({ ...content, termsAndConditions: value }))}
                  />
                  <HtmlEditor
                    label="Privacy Policy"
                    value={legalContent.privacyPolicy}
                    onChange={(value) => setLegalContent((content) => ({ ...content, privacyPolicy: value }))}
                  />
                  <HtmlEditor
                    label="Consent"
                    value={legalContent.consent}
                    onChange={(value) => setLegalContent((content) => ({ ...content, consent: value }))}
                  />
                  {canUpdateLegal ? (
                    <div className="general-actions">
                      <button disabled={isLegalContentLoading || isLegalContentSaving} type="submit">
                        {isLegalContentSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : null}
                </form>
              </>
            ) : activeView === "Notifications" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Notifications</h2>
                    <p>Send app notifications to all users or selected users</p>
                  </div>
                  <span>{selectedNotificationUserIds.length} selected</span>
                </section>

                {notificationsError ? <p className="dashboard-error">{notificationsError}</p> : null}

                <div className="section-tabs">
                  <button
                    className={notificationsTab === "notifications" ? "active" : ""}
                    type="button"
                    onClick={() => {
                      setNotificationsTab("notifications");
                      loadAppNotifications(1);
                    }}
                  >
                    Notifications
                  </button>
                  <button
                    className={notificationsTab === "users" ? "active" : ""}
                    type="button"
                    onClick={() => setNotificationsTab("users")}
                  >
                    Users
                  </button>
                </div>

                {notificationsTab === "notifications" ? (
                  <>
                    <section className="table-toolbar notification-users-toolbar">
                      <input
                        placeholder="Search notifications..."
                        value={notificationsSearch}
                        onChange={(event) => setNotificationsSearch(event.target.value)}
                      />
                      <button className="icon-button" title="Reset notifications" type="button" onClick={resetNotificationsList}>
                        ↻
                      </button>
                      <button type="button" onClick={() => loadAppNotifications(1)}>
                        Search
                      </button>
                      {adminUser?.isAdmin ? (
                        <button disabled={isNotificationMarking} type="button" onClick={markAllAdminNotificationsRead}>
                          Read all
                        </button>
                      ) : null}
                      {canCreateNotifications ? (
                        <button type="button" onClick={() => openNotificationModal("all")}>
                          Send All
                        </button>
                      ) : null}
                    </section>

                    <div className="notifications-scroll" onScroll={handleAppNotificationsScroll}>
                      <CommonTable
                        columns={notificationColumns}
                        emptyText={isNotificationsLoading ? "Loading notifications..." : "No notifications found"}
                        isLoading={isNotificationsLoading}
                        rows={notificationRows}
                      />
                      {isNotificationsPaging ? <p className="notifications-loading-more">Loading more...</p> : null}
                    </div>
                  </>
                ) : (
                  <>
                    <section className="table-toolbar notification-users-toolbar">
                      <input
                        placeholder="Search users..."
                        value={notificationUserSearch}
                        onChange={(event) => setNotificationUserSearch(event.target.value)}
                      />
                      <button className="icon-button" title="Reset selected users" type="button" onClick={resetNotificationUsers}>
                        ↻
                      </button>
                      <button type="button" onClick={() => loadNotificationUsers(1)}>
                        Search
                      </button>
                      {canCreateNotifications ? (
                        <button type="button" onClick={() => openNotificationModal("users")}>
                          Send Selected
                        </button>
                      ) : null}
                    </section>

                    <CommonTable
                      columns={notificationUserColumns}
                      emptyText={isNotificationsLoading ? "Loading users..." : "No users found"}
                      isLoading={isNotificationsLoading}
                      pagination={
                        notificationUsersData?.pagination
                          ? {
                            page: notificationUsersData.pagination.page,
                            totalPages: notificationUsersData.pagination.totalPages,
                            onPrevious: () => loadNotificationUsers(notificationUsersData.pagination.page - 1),
                            onNext: () => loadNotificationUsers(notificationUsersData.pagination.page + 1),
                          }
                          : undefined
                      }
                      rows={notificationUserRows}
                    />
                  </>
                )}
              </>
            ) : activeView === "FAQs" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>FAQs</h2>
                    <p>Manage app FAQ categories and questions</p>
                  </div>
                  {/* <span>{faqCategories.length} categories</span> */}
                </section>

                {faqsError ? <p className="dashboard-error">{faqsError}</p> : null}

                <form className="faqs-form" onSubmit={updateFaqs}>
                  <div className="faq-page-actions">
                    {canCreateFaqs ? (
                      <button type="button" onClick={addFaqCategory}>
                        <ActionIcon type="add" />
                        Add Category
                      </button>
                    ) : null}
                    {canUpdateFaqs ? (
                      <button disabled={isFaqsLoading || isFaqsSaving} type="submit">
                        {isFaqsSaving ? "Saving..." : "Save FAQs"}
                      </button>
                    ) : null}
                  </div>

                  {isFaqsLoading ? <span className="table-loader" /> : null}

                  {!isFaqsLoading && !faqCategories.length ? (
                    <div className="empty-state panel">
                      <img src="/no-records.svg" alt="No records found" />
                      <strong>No records found</strong>
                    </div>
                  ) : null}

                  {faqCategories.map((category, categoryIndex) => (
                    <section className="faq-category panel" key={categoryIndex}>
                      <div className="faq-category-header">
                        <div>
                          <h3>{category.categoryLabel || "New Category"}</h3>
                          <p>{category.questions.length} FAQs</p>
                        </div>
                        {canDeleteFaqs ? (
                          <button type="button" onClick={() => removeFaqCategory(categoryIndex)}>
                            <ActionIcon type="delete" />
                            Remove Category
                          </button>
                        ) : null}
                      </div>

                      <details className="faq-category-settings">
                        <summary>Category settings</summary>
                        <div className="faq-category-grid">
                          <label>
                            Name
                            <input
                              required
                              value={category.categoryLabel}
                              onChange={(event) => updateFaqCategory(categoryIndex, "categoryLabel", event.target.value)}
                            />
                          </label>
                          <label>
                            Key
                            <input
                              required
                              value={category.category}
                              onChange={(event) => updateFaqCategory(categoryIndex, "category", event.target.value)}
                            />
                          </label>
                          <label>
                            Icon
                            <input
                              required
                              value={category.icon}
                              onChange={(event) => updateFaqCategory(categoryIndex, "icon", event.target.value)}
                            />
                          </label>
                        </div>
                      </details>

                      {category.questions.map((question, questionIndex) => (
                        <div className="faq-question" key={question.publicId || question.id || questionIndex}>
                          <div className="faq-question-header">
                            <strong>FAQ {questionIndex + 1}</strong>
                            {canDeleteFaqs ? (
                              <button type="button" onClick={() => removeFaqQuestion(categoryIndex, questionIndex)}>
                                <ActionIcon type="delete" />
                                Remove
                              </button>
                            ) : null}
                          </div>
                          <div className="faq-question-top">
                            <label>
                              Question
                              <input
                                required
                                value={question.question}
                                onChange={(event) => updateFaqQuestion(categoryIndex, questionIndex, "question", event.target.value)}
                              />
                            </label>
                            <label>
                              Order
                              <input
                                required
                                min={1}
                                type="number"
                                value={question.displayOrder}
                                onChange={(event) => updateFaqQuestion(categoryIndex, questionIndex, "displayOrder", Number(event.target.value))}
                              />
                            </label>
                            <label className="faq-checkbox">
                              Active
                              <input
                                checked={question.isActive}
                                type="checkbox"
                                onChange={(event) => updateFaqQuestion(categoryIndex, questionIndex, "isActive", event.target.checked)}
                              />
                            </label>
                          </div>
                          <label>
                            Answer
                            <textarea
                              required
                              value={question.answer}
                              onChange={(event) => updateFaqQuestion(categoryIndex, questionIndex, "answer", event.target.value)}
                            />
                          </label>
                        </div>
                      ))}

                      {canCreateFaqs ? (
                        <button className="faq-add-question" type="button" onClick={() => addFaqQuestion(categoryIndex)}>
                          <ActionIcon type="add" />
                          Add FAQ
                        </button>
                      ) : null}
                    </section>
                  ))}
                </form>
              </>
            ) : activeView === "Basic Plan" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Basic Plan</h2>
                    <p>Manage the basic plan, benefits, and comparison benefits</p>
                  </div>
                </section>

                <div className="section-tabs">
                  <button className={basicPlanTab === "plan" ? "active" : ""} type="button" onClick={() => setBasicPlanTab("plan")}>Plans</button>
                  <button className={basicPlanTab === "benefits" ? "active" : ""} type="button" onClick={() => setBasicPlanTab("benefits")}>Benefits</button>
                  <button className={basicPlanTab === "comparison" ? "active" : ""} type="button" onClick={() => setBasicPlanTab("comparison")}>Comparison Benefits</button>
                </div>

                {basicPlanError ? <p className="dashboard-error">{basicPlanError}</p> : null}

                <form className="admin-plan-form panel" onSubmit={saveBasicPlan}>
                  {isBasicPlanLoading ? (
                    <div className="plan-loading">
                      <span className="table-loader" />
                      Loading basic plan...
                    </div>
                  ) : basicPlanTab === "plan" ? (
                    <div className="admin-plan-grid">
                      <label>
                        Amount
                        <input required min={0} type="number" value={basicPlanForm.amount} onChange={(event) => setBasicPlanForm((plan) => ({ ...plan, amount: event.target.value }))} />
                      </label>
                      <label>
                        GST Percentage
                        <input required min={0} type="number" value={basicPlanForm.gstPercentage} onChange={(event) => setBasicPlanForm((plan) => ({ ...plan, gstPercentage: event.target.value }))} />
                      </label>
                      <label>
                        Offer Tag
                        <input value={basicPlanForm.offerTag} onChange={(event) => setBasicPlanForm((plan) => ({ ...plan, offerTag: event.target.value }))} />
                      </label>
                    </div>
                  ) : basicPlanTab === "benefits" ? (
                    <div className="repair-content-list">
                      {basicPlanForm.benefits.map((benefit, index) => (
                        <section className="repair-content-card" key={`basic-plan-benefit-${index}`}>
                          <div className="admin-plan-grid">
                            <label>
                              Title
                              <input required value={benefit.title} onChange={(event) => updateBasicPlanBenefit(index, "title", event.target.value)} />
                            </label>
                            <label>
                              Description
                              <textarea required value={benefit.description} onChange={(event) => updateBasicPlanBenefit(index, "description", event.target.value)} />
                            </label>
                          </div>
                        </section>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="admin-plan-form-header">
                        <h3>Comparison Benefits</h3>
                        {canUpdateBasicPlan ? <button type="button" onClick={addComparisonBenefit}><ActionIcon type="add" />Add Benefit</button> : null}
                      </div>
                      {basicPlanForm.comparisonBenefits.map((benefit, index) => (
                        <section className="repair-content-card" key={`comparison-benefit-${index}`}>
                          <div className="admin-plan-grid">
                            <label>
                              Benefit
                              <input required value={benefit.benefit} onChange={(event) => updateComparisonBenefit(index, "benefit", event.target.value)} />
                            </label>
                            <div className="comparison-benefit-options">
                              <label className="faq-checkbox">
                                <input checked={benefit.free} type="checkbox" onChange={(event) => updateComparisonBenefit(index, "free", event.target.checked)} />
                                Free
                              </label>
                              <label className="faq-checkbox">
                                <input checked={benefit.scorecarePro} type="checkbox" onChange={(event) => updateComparisonBenefit(index, "scorecarePro", event.target.checked)} />
                                ScoreCare Pro
                              </label>
                            </div>
                          </div>
                          {canUpdateBasicPlan ? <button className="table-action danger-action" type="button" onClick={() => removeComparisonBenefit(index)}><ActionIcon type="delete" />Remove</button> : null}
                        </section>
                      ))}
                    </>
                  )}

                  <footer className="modal-actions">
                    <button disabled={isBasicPlanLoading || isBasicPlanSaving} type="submit">{isBasicPlanSaving ? "Updating..." : "Update"}</button>
                  </footer>
                </form>
              </>
            ) : activeView === "Plans & Benefits" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Plans & Benefits</h2>
                    <p>Manage subscription plans, features, and benefits</p>
                  </div>
                  <span>
                    {plansBenefitsTab === "repair"
                      ? cibilRepairTab === "plans"
                        ? `${cibilRepairContent.plans.length} repair plans`
                        : `${cibilRepairContent.timelines.length} timelines`
                      : `${adminPlans.length} plans`}
                  </span>
                </section>

                <div className="section-tabs">
                  {plansBenefitsTab === "repair" ? (
                    <>
                      <button
                        className={cibilRepairTab === "plans" ? "active" : ""}
                        type="button"
                        onClick={() => setCibilRepairTab("plans")}
                      >
                        Plans
                      </button>
                      <button
                        className={cibilRepairTab === "timelines" ? "active" : ""}
                        type="button"
                        onClick={() => setCibilRepairTab("timelines")}
                      >
                        Timelines
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={plansBenefitsTab === "plans" ? "active" : ""}
                        type="button"
                        onClick={() => setPlansBenefitsTab("plans")}
                      >
                        Plans
                      </button>
                      <button
                        className={plansBenefitsTab === "benefits" ? "active" : ""}
                        type="button"
                        onClick={() => setPlansBenefitsTab("benefits")}
                      >
                        Benefits
                      </button>
                    </>
                  )}
                </div>

                {adminPlansError ? <p className="dashboard-error">{adminPlansError}</p> : null}
                {cibilRepairError ? <p className="dashboard-error">{cibilRepairError}</p> : null}

                {plansBenefitsTab !== "repair" && !isAdminPlansLoading && !adminPlans.length ? (
                  <div className="empty-state panel">
                    <img src="/no-records.svg" alt="No records found" />
                    <strong>No records found</strong>
                  </div>
                ) : null}

                {plansBenefitsTab === "plans" ? (
                  <>
                    <section className="admin-plans-list">
                      {adminPlans.map((plan) => (
                        <article className="admin-plan-card panel" key={plan.publicId}>
                          <div className="admin-plan-card-main">
                            <div className="admin-plan-title-row">
                              <div>
                                <h3>{plan.planName}</h3>
                                <p>{plan.publicId}</p>
                              </div>
                              <strong>{plan.currency} {plan.amount}</strong>
                            </div>
                            <div className="admin-plan-badges">
                              <span>Amount: {plan.currency} {plan.amount}</span>
                              <span>GST: {plan.gstPercentage ?? 0}%</span>
                              {plan.billingCycle ? <span>{formatLabel(plan.billingCycle)}</span> : null}
                              {plan.offerTag ? <span>Offer: {plan.offerTag}</span> : null}
                              <span>Order {plan.displayOrder ?? "-"}</span>
                            </div>
                            <p>{plan.recommendedFor || plan.description || "-"}</p>
                          </div>
                          <em className={plan.isActive === false ? "inactive" : ""}>{plan.isActive === false ? "Inactive" : "Active"}</em>
                          {canUpdatePlans || canDeletePlans ? (
                            <div className="table-actions">
                              {canUpdatePlans ? (
                                <button className="table-action" type="button" onClick={() => editAdminPlan(plan)}>
                                  <ActionIcon type="edit" />
                                  Edit
                                </button>
                              ) : null}
                              {canDeletePlans ? (
                                <button className="table-action" disabled={plan.isActive === false || isAdminPlanSaving} type="button" onClick={() => inactiveAdminPlan(plan)}>
                                  Inactive
                                </button>
                              ) : null}
                            </div>
                          ) : null}
                        </article>
                      ))}
                    </section>
                  </>
                ) : plansBenefitsTab === "repair" ? (
                  <form className="admin-plan-form panel" onSubmit={saveCibilRepairContent}>
                    <div className="admin-plan-form-header">
                      <h3>{cibilRepairTab === "plans" ? "Repair Plans" : "Timelines"}</h3>
                      {canCreatePlans && cibilRepairTab === "timelines" ? (
                        <button type="button" onClick={addCibilRepairTimeline}>
                          <ActionIcon type="add" />
                          Add Timeline
                        </button>
                      ) : null}
                    </div>

                    {isCibilRepairLoading ? (
                      <div className="plan-loading">
                        <span className="table-loader" />
                        Loading repair content...
                      </div>
                    ) : (
                      <>
                        {cibilRepairTab === "plans" ? (
                          cibilRepairContent.plans.map((plan, index) => (
                            <section className="repair-content-card" key={`${plan.publicId}-${index}`}>
                              <div className="admin-plan-grid">
                                <label>
                                  Public ID
                                  <input required value={plan.publicId} onChange={(event) => updateCibilRepairPlan(index, "publicId", event.target.value)} />
                                </label>
                                <label>
                                  Plan Name
                                  <input required value={plan.planName} onChange={(event) => updateCibilRepairPlan(index, "planName", event.target.value)} />
                                </label>
                                <label>
                                  Amount
                                  <input required min={0} type="number" value={plan.amount} onChange={(event) => updateCibilRepairPlan(index, "amount", event.target.value)} />
                                </label>
                                <label>
                                  GST Percentage
                                  <input required min={0} type="number" value={plan.gstPercentage} onChange={(event) => updateCibilRepairPlan(index, "gstPercentage", event.target.value)} />
                                </label>
                                <label>
                                  Offer Tag
                                  <input value={plan.offerTag} onChange={(event) => updateCibilRepairPlan(index, "offerTag", event.target.value)} />
                                </label>
                              </div>
                            </section>
                          ))
                        ) : (
                          cibilRepairContent.timelines.map((timeline, index) => (
                            <section
                              className="repair-content-card"
                              key={timeline.publicId || timeline.localId || `timeline-${index}`}
                              ref={index === cibilRepairContent.timelines.length - 1 ? newCibilRepairTimelineRef : null}
                            >
                              <div className="admin-plan-grid">
                                <label>
                                  Display Order
                                  <input required min={1} type="number" value={timeline.displayOrder} onChange={(event) => updateCibilRepairTimeline(index, "displayOrder", event.target.value)} />
                                </label>
                                <label>
                                  Title
                                  <input required value={timeline.title} onChange={(event) => updateCibilRepairTimeline(index, "title", event.target.value)} />
                                </label>
                              </div>
                              <label>
                                Description
                                <textarea required value={timeline.description} onChange={(event) => updateCibilRepairTimeline(index, "description", event.target.value)} />
                              </label>
                              <div className="repair-content-footer">
                                <label className="faq-checkbox admin-plan-active">
                                  <input checked={timeline.isActive} type="checkbox" onChange={(event) => updateCibilRepairTimeline(index, "isActive", event.target.checked)} />
                                  Active
                                </label>
                                {canDeletePlans ? (
                                  <button className="table-action danger-action" disabled={isCibilRepairSaving} type="button" onClick={() => setDeletingCibilRepairTimelineIndex(index)}>
                                    <ActionIcon type="delete" />
                                    Remove
                                  </button>
                                ) : null}
                              </div>
                            </section>
                          ))
                        )}
                      </>
                    )}

                    {canUpdatePlans ? (
                      <footer className="modal-actions">
                        <button disabled={isCibilRepairSaving || isCibilRepairLoading} type="submit">
                          {isCibilRepairSaving ? "Saving..." : cibilRepairTab === "timelines" ? "Save Timelines" : "Save Plan"}
                        </button>
                      </footer>
                    ) : null}
                  </form>
                ) : (
                  <section className="benefits-list">
                    {adminPlans.map((plan) => (
                      <article className="benefit-card panel" key={plan.publicId}>
                        <div className="benefit-card-header">
                          <div>
                            <h3>{plan.planName}</h3>
                            <p>{plan.title || plan.recommendedFor || "-"}</p>
                          </div>
                          <span>{plan.currency} {plan.amount}</span>
                        </div>
                        <ul className="benefits-only-list">
                          {(plan.benefits || []).map((benefit) => (
                            <li key={benefit}>{benefit}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </section>
                )}
              </>
            ) : activeView === "Feedback" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Feedback</h2>
                    <p>Review user ratings and messages</p>
                  </div>
                  <span>{feedbackData?.pagination?.total ?? feedbackData?.feedbacks.length ?? 0} records</span>
                </section>

                <div className="mobile-toolbar-actions single">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                </div>

                <section className={`table-toolbar feedback-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search feedback..."
                    value={feedbackSearch}
                    onChange={(event) => setFeedbackSearch(event.target.value)}
                  />
                  <DateFilter label="Start date" value={feedbackFromDate} onChange={setFeedbackFromDate} />
                  <DateFilter label="End date" value={feedbackToDate} onChange={setFeedbackToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetFeedbackFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadFeedback(1)}>
                    Search
                  </button>
                </section>

                {feedbackError ? <p className="dashboard-error">{feedbackError}</p> : null}

                <CommonTable
                  columns={feedbackColumns}
                  emptyText={isFeedbackLoading ? "Loading feedback..." : "No feedback found"}
                  isLoading={isFeedbackLoading}
                  pagination={
                    feedbackData?.pagination
                      ? {
                        page: feedbackData.pagination.page,
                        totalPages: feedbackData.pagination.totalPages,
                        onPrevious: () => loadFeedback(feedbackData.pagination!.page - 1),
                        onNext: () => loadFeedback(feedbackData.pagination!.page + 1),
                      }
                      : undefined
                  }
                  rows={feedbackRows}
                />
              </>
            ) : activeView === "Contact Us" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Contact Us</h2>
                    <p>Review contact requests</p>
                  </div>
                  <span>{contactRequestsData?.pagination.total ?? 0} records</span>
                </section>

                <div className="mobile-toolbar-actions single">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                </div>

                <section className={`table-toolbar feedback-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search contact requests..."
                    value={contactSearch}
                    onChange={(event) => setContactSearch(event.target.value)}
                  />
                  <DateFilter label="Start date" value={contactFromDate} onChange={setContactFromDate} />
                  <DateFilter label="End date" value={contactToDate} onChange={setContactToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetContactFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadContactRequests(1)}>
                    Search
                  </button>
                </section>

                {contactError ? <p className="dashboard-error">{contactError}</p> : null}

                <CommonTable
                  columns={contactColumns}
                  emptyText={isContactLoading ? "Loading contact requests..." : "No contact requests found"}
                  isLoading={isContactLoading}
                  pagination={
                    contactRequestsData?.pagination
                      ? {
                        page: contactRequestsData.pagination.page,
                        totalPages: contactRequestsData.pagination.totalPages,
                        onPrevious: () => loadContactRequests(contactRequestsData.pagination.page - 1),
                        onNext: () => loadContactRequests(contactRequestsData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={contactRows}
                />
              </>
            ) : activeView === "API Logs" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>API Logs</h2>
                    <p>
                      {apiLogsData
                        ? `${apiLogsData.summary.successful} successful · ${apiLogsData.summary.failed} failed · ${apiLogsData.summary.averageDurationMs} ms average`
                        : "Credit bureau API request history"}
                    </p>
                  </div>
                  <span>{apiLogsData?.pagination.total ?? 0} requests</span>
                </section>

                <div className="mobile-toolbar-actions single">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>Filter</button>
                </div>

                <section className={`table-toolbar api-logs-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input placeholder="Search logs..." value={apiLogsSearch} onChange={(event) => setApiLogsSearch(event.target.value)} />
                  <select aria-label="Bureau type" value={apiLogsBureauType} onChange={(event) => setApiLogsBureauType(event.target.value)}>
                    <option value="">All bureaus</option>
                    <option value="experian">Experian</option>
                    <option value="cibil">CIBIL</option>
                    <option value="crif">CRIF</option>
                  </select>
                  <select aria-label="Operation type" value={apiLogsOperationType} onChange={(event) => setApiLogsOperationType(event.target.value)}>
                    <option value="">All operations</option>
                    <option value="score">Score</option>
                    <option value="report_data">Report data</option>
                    <option value="manual_report_download">Manual report download</option>
                  </select>
                  <select aria-label="Status" value={apiLogsStatus} onChange={(event) => setApiLogsStatus(event.target.value)}>
                    <option value="">All statuses</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                  </select>
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetApiLogFilters}>↻</button>
                  <button disabled={isApiLogsLoading} type="button" onClick={() => loadApiLogs(1)}>Search</button>
                </section>

                {apiLogsError ? <p className="dashboard-error">{apiLogsError}</p> : null}

                <CommonTable
                  columns={apiLogColumns}
                  emptyText={isApiLogsLoading ? "Loading API logs..." : "No API logs found"}
                  isLoading={isApiLogsLoading}
                  pagination={apiLogsData ? {
                    page: apiLogsData.pagination.page,
                    totalPages: apiLogsData.pagination.totalPages,
                    onPrevious: () => loadApiLogs(apiLogsData.pagination.page - 1),
                    onNext: () => loadApiLogs(apiLogsData.pagination.page + 1),
                  } : undefined}
                  rows={apiLogRows}
                />
              </>
            ) : activeView === "Report Downloads" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Report Downloads</h2>
                    <p>CIBIL report download history</p>
                  </div>
                  <span>{reportDownloadsData?.pagination.total ?? 0} downloads</span>
                </section>

                <div className="mobile-toolbar-actions single">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>Filter</button>
                </div>

                <section className={`table-toolbar report-download-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input placeholder="Search downloads..." value={reportDownloadsSearch} onChange={(event) => setReportDownloadsSearch(event.target.value)} />
                  <DateFilter label="Start date" value={reportDownloadsFromDate} onChange={setReportDownloadsFromDate} />
                  <DateFilter label="End date" value={reportDownloadsToDate} onChange={setReportDownloadsToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetReportDownloadFilters}>↻</button>
                  <button type="button" onClick={() => loadReportDownloads(1)}>Search</button>
                </section>

                {reportDownloadsError ? <p className="dashboard-error">{reportDownloadsError}</p> : null}

                <CommonTable
                  columns={reportDownloadColumns}
                  emptyText={isReportDownloadsLoading ? "Loading downloads..." : "No report downloads found"}
                  isLoading={isReportDownloadsLoading}
                  pagination={reportDownloadsData ? {
                    page: reportDownloadsData.pagination.page,
                    totalPages: reportDownloadsData.pagination.totalPages,
                    onPrevious: () => loadReportDownloads(reportDownloadsData.pagination.page - 1),
                    onNext: () => loadReportDownloads(reportDownloadsData.pagination.page + 1),
                  } : undefined}
                  rows={reportDownloadRows}
                />
              </>
            ) : activeView === "Download CIBIL" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Download CIBIL</h2>
                    <p>Download saved CIBIL reports for active users</p>
                  </div>
                  <span>{cibilUsersData?.pagination.total ?? 0} users</span>
                </section>

                <div className="mobile-toolbar-actions single">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                </div>

                <section className={`table-toolbar report-download-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search active users..."
                    value={cibilUsersSearch}
                    onChange={(event) => setCibilUsersSearch(event.target.value)}
                  />
                  <DateFilter label="Start date" value={cibilUsersFromDate} onChange={setCibilUsersFromDate} />
                  <DateFilter label="End date" value={cibilUsersToDate} onChange={setCibilUsersToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetCibilUserFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadCibilUsers(1)}>
                    Search
                  </button>
                </section>

                {cibilUsersError ? <p className="dashboard-error">{cibilUsersError}</p> : null}

                <CommonTable
                  columns={cibilUserColumns}
                  emptyText={isCibilUsersLoading ? "Loading users..." : "No active users found"}
                  isLoading={isCibilUsersLoading}
                  pagination={
                    cibilUsersData
                      ? {
                        page: cibilUsersData.pagination.page,
                        totalPages: cibilUsersData.pagination.totalPages,
                        onPrevious: () => loadCibilUsers(cibilUsersData.pagination.page - 1),
                        onNext: () => loadCibilUsers(cibilUsersData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={cibilUserRows}
                />
              </>
            ) : activeView === "Manual Report" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Manual Credit Report</h2>
                    <p>Fetch and download a bureau credit report</p>
                  </div>
                  {manualReportTab === "downloads" ? <span>{manualReportDownloadsData?.pagination.total ?? 0} downloads</span> : null}
                </section>

                <section className="section-tabs" aria-label="Manual report views">
                  <button className={manualReportTab === "download" ? "active" : ""} type="button" onClick={() => setManualReportTab("download")}>Download</button>
                  <button className={manualReportTab === "downloads" ? "active" : ""} type="button" onClick={() => setManualReportTab("downloads")}>History</button>
                </section>

                {manualReportTab === "download" ? (
                  <>
                    {manualReportError ? <p className="dashboard-error">{manualReportError}</p> : null}

                    <form className="manual-report-form panel" onSubmit={downloadManualCreditReport}>
                  <fieldset className="manual-report-bureaus">
                    <legend>Credit Bureau</legend>
                    <div>
                      {(["experian", "cibil", "crif"] as ManualReportType[]).map((type) => (
                        <button
                          className={manualReportForm.type === type ? "active" : ""}
                          key={type}
                          type="button"
                          onClick={() => setManualReportForm((form) => ({ ...form, type }))}
                        >
                          {type === "cibil" ? "CIBIL" : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="manual-report-fields">
                    {manualReportForm.type === "crif" ? (
                      <>
                        <label>
                          First Name
                          <input required value={manualReportForm.firstName} onChange={(event) => setManualReportForm((form) => ({ ...form, firstName: event.target.value }))} />
                        </label>
                        <label>
                          Last Name
                          <input required value={manualReportForm.lastName} onChange={(event) => setManualReportForm((form) => ({ ...form, lastName: event.target.value }))} />
                        </label>
                      </>
                    ) : (
                      <label className="manual-report-wide-field">
                        Full Name
                        <input required value={manualReportForm.name} onChange={(event) => setManualReportForm((form) => ({ ...form, name: event.target.value }))} />
                      </label>
                    )}

                    <label>
                      Mobile Number
                      <input
                        required
                        inputMode="numeric"
                        maxLength={10}
                        pattern="[6-9][0-9]{9}"
                        value={manualReportForm.mobile}
                        onChange={(event) => setManualReportForm((form) => ({ ...form, mobile: event.target.value.replace(/\D/g, "") }))}
                      />
                    </label>
                    <label>
                      PAN Number
                      <input
                        required
                        maxLength={10}
                        pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]"
                        value={manualReportForm.pan}
                        onChange={(event) => setManualReportForm((form) => ({ ...form, pan: event.target.value.toUpperCase() }))}
                      />
                    </label>
                    {manualReportForm.type === "cibil" ? (
                      <label>
                        Gender
                        <select value={manualReportForm.gender} onChange={(event) => setManualReportForm((form) => ({ ...form, gender: event.target.value }))}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </label>
                    ) : null}
                  </div>

                  <label className="manual-report-consent">
                    <input required checked={manualReportForm.consent} type="checkbox" onChange={(event) => setManualReportForm((form) => ({ ...form, consent: event.target.checked }))} />
                    I confirm that the customer has provided consent to fetch this credit report.
                  </label>

                  {canCreateManualReport ? (
                    <div className="manual-report-actions">
                      <button disabled={isManualReportDownloading || !manualReportForm.consent} type="submit">
                        <svg className="button-icon" viewBox="0 0 24 24">
                          <path d="M12 3v12M7 10l5 5 5-5M5 20h14" />
                        </svg>
                        {isManualReportDownloading ? "Downloading..." : "Download Report"}
                      </button>
                    </div>
                  ) : null}
                    </form>
                  </>
                ) : (
                  <>
                    <div className="mobile-toolbar-actions single">
                      <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>Filter</button>
                    </div>

                    <section className={`table-toolbar manual-report-download-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                      <input placeholder="Search downloads..." value={manualReportDownloadsSearch} onChange={(event) => setManualReportDownloadsSearch(event.target.value)} />
                      <select value={manualReportDownloadsType} onChange={(event) => setManualReportDownloadsType(event.target.value)}>
                        <option value="">All bureaus</option>
                        <option value="experian">Experian</option>
                        <option value="cibil">CIBIL</option>
                        <option value="crif">CRIF</option>
                      </select>
                      <DateFilter label="Start date" value={manualReportDownloadsFromDate} onChange={setManualReportDownloadsFromDate} />
                      <DateFilter label="End date" value={manualReportDownloadsToDate} onChange={setManualReportDownloadsToDate} />
                      <button className="icon-button" title="Reset filters" type="button" onClick={resetManualReportDownloadFilters}>↻</button>
                      <button type="button" onClick={() => loadManualReportDownloads(1)}>Search</button>
                    </section>

                    {manualReportDownloadsError ? <p className="dashboard-error">{manualReportDownloadsError}</p> : null}

                    <CommonTable
                      columns={manualReportDownloadColumns}
                      emptyText={isManualReportDownloadsLoading ? "Loading downloads..." : "No manual report downloads found"}
                      isLoading={isManualReportDownloadsLoading}
                      pagination={manualReportDownloadsData ? {
                        page: manualReportDownloadsData.pagination.page,
                        totalPages: manualReportDownloadsData.pagination.totalPages,
                        onPrevious: () => loadManualReportDownloads(manualReportDownloadsData.pagination.page - 1),
                        onNext: () => loadManualReportDownloads(manualReportDownloadsData.pagination.page + 1),
                      } : undefined}
                      rows={manualReportDownloadRows}
                    />
                  </>
                )}
              </>
            ) : activeView === "Users" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Users</h2>
                    <p>Manage ScoreCare users</p>
                  </div>
                  <span>{usersData?.pagination.total ?? 0} users</span>
                </section>

                <section className="users-status-grid">
                  {userStatusCards.map((card, index) => (
                    <button
                      className={`users-status-card ${usersStatus === card.status ? "active" : ""}`}
                      key={card.label}
                      type="button"
                      onClick={() => {
                        setUsersStatus(card.status);
                        loadUsers(1, usersSearch, false, card.status);
                      }}
                    >
                      <span>{card.label}</span>
                      <strong className={`tone-${card.tone}`}>{card.value}</strong>
                    </button>
                  ))}
                </section>

                <div className="mobile-toolbar-actions">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                  {canExportUsers ? (
                    <button className="export-button" disabled={isExporting} type="button" onClick={exportUsers}>
                      {isExporting ? "Exporting..." : "Export"}
                    </button>
                  ) : null}
                </div>

                <section className={`table-toolbar has-export ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search users..."
                    value={usersSearch}
                    onChange={(event) => setUsersSearch(event.target.value)}
                  />
                  <DateFilter label="Start date" value={usersFromDate} onChange={setUsersFromDate} />
                  <DateFilter label="End date" value={usersToDate} onChange={setUsersToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetUsersFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadUsers(1, usersSearch, false)}>
                    Search
                  </button>
                  {canExportUsers ? (
                    <button className="export-button" disabled={isExporting} type="button" onClick={exportUsers}>
                      {isExporting ? "Exporting..." : "Export"}
                    </button>
                  ) : null}
                </section>

                {usersError ? <p className="dashboard-error">{usersError}</p> : null}

                <CommonTable
                  columns={usersColumns}
                  emptyText={isUsersLoading ? "Loading users..." : "No users found"}
                  isLoading={isUsersLoading}
                  onRowClick={(rowIndex) => {
                    const user = usersData?.users[rowIndex];
                    if (user?.publicId) {
                      loadUserDetail(user.publicId);
                    }
                  }}
                  pagination={
                    usersData
                      ? {
                        page: usersData.pagination.page,
                        totalPages: usersData.pagination.totalPages,
                        onPrevious: () => loadUsers(usersData.pagination.page - 1),
                        onNext: () => loadUsers(usersData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={usersRows}
                />
              </>
            ) : activeView === "Employees" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Employees</h2>
                    <p>Manage employee records</p>
                  </div>
                  <span>{employeesData?.pagination.total ?? 0} employees</span>
                </section>

                <section className="table-toolbar employee-toolbar">
                  <input
                    placeholder="Search employees..."
                    value={employeesSearch}
                    onChange={(event) => setEmployeesSearch(event.target.value)}
                  />
                  <select value={employeesStatus} onChange={(event) => setEmployeesStatus(event.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <button type="button" onClick={() => loadEmployees(1)}>
                    Search
                  </button>
                  {canCreateEmployees ? (
                    <button className="add-button" type="button" onClick={() => openEmployeeModal()}>
                      <ActionIcon type="add" />
                      Add Employee
                    </button>
                  ) : null}
                </section>

                {employeesError ? <p className="dashboard-error">{employeesError}</p> : null}

                <CommonTable
                  columns={employeeColumns}
                  emptyText={isEmployeesLoading ? "Loading employees..." : "No employees found"}
                  isLoading={isEmployeesLoading}
                  pagination={
                    employeesData
                      ? {
                        page: employeesData.pagination.page,
                        totalPages: employeesData.pagination.totalPages,
                        onPrevious: () => loadEmployees(employeesData.pagination.page - 1),
                        onNext: () => loadEmployees(employeesData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={employeeRows}
                />
              </>
            ) : activeView === "Roles" ? (
              <>
                {isEmployeeRoleModalOpen ? (
                  <>
                    <section className="welcome-panel">
                      <div>
                        <h2>{editingEmployeeRoleId ? "Edit Role" : "Add Role"}</h2>
                        <p>Employee Management</p>
                      </div>
                      <button className="role-back-button" type="button" onClick={closeEmployeeRoleForm} aria-label="Back">
                        <ActionIcon type="back" />
                      </button>
                    </section>

                    {employeeRolesError ? <p className="dashboard-error">{employeeRolesError}</p> : null}

                    <form className="admin-plan-form employee-role-page-form" onSubmit={saveEmployeeRole}>
                      <div className="admin-plan-grid employee-role-details-grid">
                        <label>
                          Role Name
                          <input required value={employeeRoleForm.roleName} onChange={(event) => setEmployeeRoleForm((role) => ({ ...role, roleName: event.target.value }))} />
                        </label>
                        <label>
                          Status
                          <select value={employeeRoleForm.status} onChange={(event) => setEmployeeRoleForm((role) => ({ ...role, status: event.target.value }))}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </label>
                      </div>
                      <label>
                        Description
                        <textarea value={employeeRoleForm.description} onChange={(event) => setEmployeeRoleForm((role) => ({ ...role, description: event.target.value }))} />
                      </label>
                      <section className="employee-role-access-list">
                        <div className="employee-role-access-title">
                          <strong>Page Access</strong>
                          <label className="employee-role-select-all">
                            <input
                              checked={isAllEmployeeRoleAccessSelected()}
                              type="checkbox"
                              onChange={toggleAllEmployeeRoleAccess}
                            />
                            Select All
                          </label>
                        </div>
                        {employeeMenuAccess.map((access) => {
                          const accessKey = getEmployeeRoleAccessKey(access);
                          const selectedAccess = getSelectedEmployeeRoleAccess(access);
                          const viewPermission = getViewPermission(access);
                          const isExpanded = expandedEmployeeRoleAccess.includes(accessKey);

                          return (
                            <div className="employee-role-access-item" key={accessKey}>
                              <div className="employee-role-access-header">
                                <label>
                                  <input
                                    checked={Boolean(selectedAccess)}
                                    type="checkbox"
                                    onChange={() => toggleEmployeeRoleAccess(access)}
                                  />
                                  {access.menuName}{access.childMenuName ? ` / ${access.childMenuName}` : ""}
                                </label>
                                <button type="button" onClick={() => toggleEmployeeRoleAccessExpansion(access)}>
                                  {isExpanded ? "−" : "+"}
                                </button>
                              </div>
                              {isExpanded ? (
                                <div className="employee-role-actions">
                                  {access.permissions.map((permission) => (
                                    <label key={permission}>
                                      <input
                                        checked={permission === viewPermission ? Boolean(selectedAccess) : Boolean(selectedAccess?.permissions.includes(permission))}
                                        disabled={permission === viewPermission}
                                        type="checkbox"
                                        onChange={() => toggleEmployeeRolePermission(access, permission)}
                                      />
                                      {permission}
                                    </label>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </section>
                      <footer className="modal-actions">
                        <button type="button" onClick={closeEmployeeRoleForm}>
                          Cancel
                        </button>
                        {(editingEmployeeRoleId ? canUpdateRoles : canCreateRoles) ? (
                          <button disabled={isEmployeeRolesLoading} type="submit">
                            {isEmployeeRolesLoading ? "Saving..." : editingEmployeeRoleId ? "Update" : "Add"}
                          </button>
                        ) : null}
                      </footer>
                    </form>
                  </>
                ) : (
                  <>
                    <section className="welcome-panel">
                      <div>
                        <h2>Roles</h2>
                        <p>Manage employee role access</p>
                      </div>
                      <span>{employeeRoles.length} roles</span>
                    </section>

                    <section className="table-toolbar notification-users-toolbar">
                      <input
                        placeholder="Search roles..."
                        value={employeeRolesSearch}
                        onChange={(event) => setEmployeeRolesSearch(event.target.value)}
                      />
                      <button className="icon-button" title="Reset roles" type="button" onClick={() => {
                        setEmployeeRolesSearch("");
                        loadEmployeeRoles(1, "");
                      }}>
                        ↻
                      </button>
                      <button type="button" onClick={() => loadEmployeeRoles(1)}>
                        Search
                      </button>
                      {canCreateRoles ? (
                        <button className="add-button" type="button" onClick={() => openEmployeeRoleModal()}>
                          Add Role
                        </button>
                      ) : null}
                    </section>

                    {employeeRolesError ? <p className="dashboard-error">{employeeRolesError}</p> : null}

                    <CommonTable
                      columns={employeeRoleColumns}
                      emptyText={isEmployeeRolesLoading ? "Loading roles..." : "No roles found"}
                      isLoading={isEmployeeRolesLoading}
                      pagination={
                        employeeRolesData?.pagination
                          ? {
                            page: employeeRolesData.pagination.page,
                            totalPages: employeeRolesData.pagination.totalPages,
                            onPrevious: () => loadEmployeeRoles(employeeRolesData.pagination!.page - 1),
                            onNext: () => loadEmployeeRoles(employeeRolesData.pagination!.page + 1),
                          }
                          : undefined
                      }
                      rows={employeeRoleRows}
                    />

                  </>
                )}
              </>
            ) : activeView === "Login History" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Login History</h2>
                    <p>Track admin and employee login sessions</p>
                  </div>
                  <span>{loginEventsData?.pagination.total ?? 0} records</span>
                </section>

                <section className="table-toolbar login-history-toolbar">
                  <input
                    placeholder="Search login history..."
                    value={loginEventsSearch}
                    onChange={(event) => setLoginEventsSearch(event.target.value)}
                  />
                  <DateFilter label="Login from" value={loginEventsFromDate} onChange={setLoginEventsFromDate} />
                  <DateFilter label="Logout to" value={loginEventsToDate} onChange={setLoginEventsToDate} />
                  <button className="icon-button" title="Reset login history" type="button" onClick={() => {
                    setLoginEventsSearch("");
                    setLoginEventsFromDate("");
                    setLoginEventsToDate("");
                    loadLoginEvents(1, "", "", "");
                  }}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadLoginEvents(1)}>
                    Search
                  </button>
                </section>

                {loginEventsError ? <p className="dashboard-error">{loginEventsError}</p> : null}

                <CommonTable
                  columns={loginEventColumns}
                  emptyText={isLoginEventsLoading ? "Loading login history..." : "No login history found"}
                  isLoading={isLoginEventsLoading}
                  pagination={
                    loginEventsData?.pagination
                      ? {
                        page: loginEventsData.pagination.page,
                        totalPages: loginEventsData.pagination.totalPages,
                        onPrevious: () => loadLoginEvents(loginEventsData.pagination.page - 1),
                        onNext: () => loadLoginEvents(loginEventsData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={loginEventRows}
                />
              </>
            ) : activeView === "Basic Subscriptions" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Basic Subscriptions</h2>
                    <p>Manage basic user subscriptions</p>
                  </div>
                  <span>{usersData?.pagination.total ?? 0} records</span>
                </section>

                <div className="mobile-toolbar-actions">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                  {canExportUsers ? (
                    <button className="export-button" disabled={isExporting} type="button" onClick={exportUsers}>
                      {isExporting ? "Exporting..." : "Export"}
                    </button>
                  ) : null}
                </div>

                <section className={`table-toolbar has-export ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search subscriptions..."
                    value={usersSearch}
                    onChange={(event) => setUsersSearch(event.target.value)}
                  />
                  <DateFilter label="Start date" value={usersFromDate} onChange={setUsersFromDate} />
                  <DateFilter label="End date" value={usersToDate} onChange={setUsersToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetUsersFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadUsers(1, usersSearch, true)}>
                    Search
                  </button>
                  {canExportUsers ? (
                    <button className="export-button" disabled={isExporting} type="button" onClick={exportUsers}>
                      {isExporting ? "Exporting..." : "Export"}
                    </button>
                  ) : null}
                </section>

                {usersError ? <p className="dashboard-error">{usersError}</p> : null}

                <CommonTable
                  columns={subscriptionColumns}
                  emptyText={isUsersLoading ? "Loading subscriptions..." : "No subscriptions found"}
                  isLoading={isUsersLoading}
                  pagination={usersData ? {
                    page: usersData.pagination.page,
                    totalPages: usersData.pagination.totalPages,
                    onPrevious: () => loadUsers(usersData.pagination.page - 1, usersSearch, true),
                    onNext: () => loadUsers(usersData.pagination.page + 1, usersSearch, true),
                  } : undefined}
                  rows={subscriptionRows}
                />
              </>
            ) : activeView === "Basic Subscription" ? (
              <>
                <section className="welcome-panel">
                  <div><h2>Basic Plan Subscriptions</h2><p>Review basic plan subscription revenue</p></div>
                  <span>{basicSubscriptionsData?.pagination?.total ?? basicSubscriptionsData?.subscriptions.length ?? 0} subscriptions</span>
                </section>
                <div className="mobile-toolbar-actions"><button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>Filter</button></div>
                <section className={`table-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input placeholder="Search subscriptions..." value={basicSubscriptionsSearch} onChange={(event) => setBasicSubscriptionsSearch(event.target.value)} />
                  <DateFilter label="Start date" value={basicSubscriptionsFromDate} onChange={setBasicSubscriptionsFromDate} />
                  <DateFilter label="End date" value={basicSubscriptionsToDate} onChange={setBasicSubscriptionsToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetBasicSubscriptionFilters}>↻</button>
                  <button type="button" onClick={() => loadBasicSubscriptions(1)}>Search</button>
                </section>
                {basicSubscriptionsError ? <p className="dashboard-error">{basicSubscriptionsError}</p> : null}
                <CommonTable
                  columns={basicSubscriptionColumns}
                  emptyText={isBasicSubscriptionsLoading ? "Loading basic subscriptions..." : "No basic subscriptions found"}
                  isLoading={isBasicSubscriptionsLoading}
                  pagination={basicSubscriptionsData?.pagination ? {
                    page: basicSubscriptionsData.pagination.page,
                    totalPages: basicSubscriptionsData.pagination.totalPages,
                    onPrevious: () => loadBasicSubscriptions(basicSubscriptionsData.pagination!.page - 1),
                    onNext: () => loadBasicSubscriptions(basicSubscriptionsData.pagination!.page + 1),
                  } : undefined}
                  rows={basicSubscriptionRows}
                />
              </>
            ) : activeView === "Repair Service Subscription" || activeView === "Repair Subscriptions" ? (
              <>
                <section className="welcome-panel">
                  <div><h2>Repair Subscriptions</h2><p>Review credit repair subscriptions</p></div>
                  <span>{repairSubscriptionsData?.pagination?.total ?? repairSubscriptionsData?.requests.length ?? 0} subscriptions</span>
                </section>
                <div className="mobile-toolbar-actions"><button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>Filter</button></div>
                <section className={`table-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input placeholder="Search subscriptions..." value={repairSubscriptionsSearch} onChange={(event) => setRepairSubscriptionsSearch(event.target.value)} />
                  <DateFilter label="Start date" value={repairSubscriptionsFromDate} onChange={setRepairSubscriptionsFromDate} />
                  <DateFilter label="End date" value={repairSubscriptionsToDate} onChange={setRepairSubscriptionsToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetRepairSubscriptionFilters}>↻</button>
                  <button type="button" onClick={() => loadRepairSubscriptions(1)}>Search</button>
                </section>
                {repairSubscriptionsError ? <p className="dashboard-error">{repairSubscriptionsError}</p> : null}
                <CommonTable
                  columns={repairSubscriptionColumns}
                  emptyText={isRepairSubscriptionsLoading ? "Loading repair subscriptions..." : "No repair subscriptions found"}
                  isLoading={isRepairSubscriptionsLoading}
                  pagination={repairSubscriptionsData?.pagination ? {
                    page: repairSubscriptionsData.pagination.page,
                    totalPages: repairSubscriptionsData.pagination.totalPages,
                    onPrevious: () => loadRepairSubscriptions(repairSubscriptionsData.pagination!.page - 1),
                    onNext: () => loadRepairSubscriptions(repairSubscriptionsData.pagination!.page + 1),
                  } : undefined}
                  rows={repairSubscriptionRows}
                />
              </>
            ) : activeView === "Credit Repair" ? (
              <>
                <section className="welcome-panel">
                  <div><h2>Credit Repair</h2><p>Review and update credit repair requests</p></div>
                  <span>{creditRepairData?.pagination?.total ?? creditRepairData?.requests.length ?? 0} requests</span>
                </section>
                {creditRepairError ? <p className="dashboard-error">{creditRepairError}</p> : null}
                <CommonTable
                  columns={creditRepairColumns}
                  emptyText={isCreditRepairLoading ? "Loading credit repair requests..." : "No credit repair requests found"}
                  isLoading={isCreditRepairLoading}
                  pagination={creditRepairData?.pagination ? {
                    page: creditRepairData.pagination.page,
                    totalPages: creditRepairData.pagination.totalPages,
                    onPrevious: () => loadCreditRepairRequests(creditRepairData.pagination!.page - 1),
                    onNext: () => loadCreditRepairRequests(creditRepairData.pagination!.page + 1),
                  } : undefined}
                  rows={creditRepairRows}
                />
              </>
            ) : activeView === "Disputes" ? (
              <>
                <section className="welcome-panel">
                  <div><h2>Disputes</h2><p>Review and update raised disputes</p></div>
                  <span>{disputesData?.pagination?.total ?? disputesData?.disputes.length ?? 0} disputes</span>
                </section>
                {disputesError ? <p className="dashboard-error">{disputesError}</p> : null}
                <CommonTable
                  columns={disputeColumns}
                  emptyText={isDisputesLoading ? "Loading disputes..." : "No disputes found"}
                  isLoading={isDisputesLoading}
                  pagination={disputesData?.pagination ? {
                    page: disputesData.pagination.page,
                    totalPages: disputesData.pagination.totalPages,
                    onPrevious: () => loadDisputes(disputesData.pagination!.page - 1),
                    onNext: () => loadDisputes(disputesData.pagination!.page + 1),
                  } : undefined}
                  rows={disputeRows}
                />
              </>
            ) : activeView === "Loans" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Loans</h2>
                    <p>Review loan applications and documents</p>
                  </div>
                  <span>{loansData?.pagination.total ?? 0} loans</span>
                </section>

                <div className="mobile-toolbar-actions">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                  {canExportLoans ? (
                    <button className="export-button" disabled={isLoansExporting} type="button" onClick={exportLoans}>
                      {isLoansExporting ? "Exporting..." : "Export"}
                    </button>
                  ) : null}
                </div>

                <section className={`table-toolbar loan-toolbar has-export ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search loans..."
                    value={loansSearch}
                    onChange={(event) => setLoansSearch(event.target.value)}
                  />
                  <select value={loansStatus} onChange={(event) => setLoansStatus(event.target.value)}>
                    <option value="">All Status</option>
                    {loanStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatLabel(status)}
                      </option>
                    ))}
                  </select>
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetLoansFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadLoans(1)}>
                    Search
                  </button>
                  {canExportLoans ? (
                    <button className="export-button" disabled={isLoansExporting} type="button" onClick={exportLoans}>
                      {isLoansExporting ? "Exporting..." : "Export"}
                    </button>
                  ) : null}
                </section>

                {loansError ? <p className="dashboard-error">{loansError}</p> : null}

                <CommonTable
                  columns={loanColumns}
                  emptyText={isLoansLoading ? "Loading loans..." : "No loans found"}
                  isLoading={isLoansLoading}
                  pagination={
                    loansData
                      ? {
                        page: loansData.pagination.page,
                        totalPages: loansData.pagination.totalPages,
                        onPrevious: () => loadLoans(loansData.pagination.page - 1),
                        onNext: () => loadLoans(loansData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={loanRows}
                />
              </>
            ) : activeView === "Chats" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Chats</h2>
                    <p>Review recent user chat messages</p>
                  </div>
                  <span>{chatsData?.pagination.total ?? 0} questions</span>
                </section>

                <div className="mobile-toolbar-actions single">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                </div>

                <section className={`table-toolbar chat-toolbar ${isMobileFiltersOpen ? "mobile-open" : ""}`}>
                  <input
                    placeholder="Search chats..."
                    value={chatsSearch}
                    onChange={(event) => setChatsSearch(event.target.value)}
                  />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetChatsFilters}>
                    ↻
                  </button>
                  <button type="button" onClick={() => loadChats(1)}>
                    Search
                  </button>
                </section>

                {chatsError ? <p className="dashboard-error">{chatsError}</p> : null}

                <CommonTable
                  columns={chatColumns}
                  emptyText={isChatsLoading ? "Loading chats..." : "No chats found"}
                  isLoading={isChatsLoading}
                  pagination={
                    chatsData
                      ? {
                        page: chatsData.pagination.page,
                        totalPages: chatsData.pagination.totalPages,
                        onPrevious: () => loadChats(chatsData.pagination.page - 1),
                        onNext: () => loadChats(chatsData.pagination.page + 1),
                      }
                      : undefined
                  }
                  rows={chatRows}
                />
              </>
            ) : (
              <section className="analytics-dashboard">
                <div className="analytics-hero-grid">
                  <div className="analytics-hero">
                    <div>
                      <span>👋 Hello {adminUser?.fullName?.split(" ")[0] || "Admin"},</span>
                      <h2>Welcome to your ScoreCare Dashboard!</h2>
                      <p>Monitor users, track revenue, and review service activity in one place.</p>
                      <button type="button" onClick={() => openAdminView("Users")}>Start AI</button>
                    </div>
                  </div>
                  <aside className="analytics-ideas-card">
                    <div className="analytics-ideas-top">
                      <h3>Ideas for You</h3>
                      <div>
                        <button type="button" aria-label="Previous idea">‹</button>
                        <button type="button" aria-label="Next idea">›</button>
                      </div>
                    </div>
                    <h2>Create a report for your product</h2>
                    <p>Review users, subscriptions, revenue, and service performance from the latest dashboard data.</p>
                    <button type="button" onClick={() => openAdminView("Report Downloads")}>Read Now</button>
                  </aside>
                </div>

                <section className="table-toolbar dashboard-filter-toolbar">
                  <DateFilter label="Start date" value={dashboardFromDate} onChange={setDashboardFromDate} />
                  <DateFilter label="End date" value={dashboardToDate} onChange={setDashboardToDate} />
                  <button className="icon-button" title="Reset filters" type="button" onClick={resetDashboardFilters}>↻</button>
                  <button disabled={!adminUser?.token} type="button" onClick={() => adminUser?.token && loadDashboardCounts(adminUser.token)}>Apply</button>
                </section>

                {dashboardError ? <p className="dashboard-error">{dashboardError}</p> : null}

                <section className="analytics-kpi-grid">
                  {kpiCards.map((card) => {
                    const canOpenCard = hasViewPermission(card.view);

                    return (
                      <article
                        className={`analytics-kpi-card${canOpenCard ? " clickable" : ""}`}
                        key={card.label}
                        role={canOpenCard ? "button" : undefined}
                        tabIndex={canOpenCard ? 0 : undefined}
                        onClick={() => canOpenCard && openAdminView(card.view)}
                        onKeyDown={(event) => {
                          if (canOpenCard && (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            openAdminView(card.view);
                          }
                        }}
                      >
                        <div className={`analytics-kpi-icon ${card.tone}`}>{card.icon}</div>
                        <div>
                          <span>{card.label}</span>
                          <strong>{card.value}</strong>
                          <small>{card.meta}</small>
                        </div>
                        <em>{card.trend}</em>
                      </article>
                    );
                  })}
                </section>

                <section className="analytics-chart-grid">
                  <article className="analytics-chart-card">
                    <header>
                      <div>
                        <h3>Users by Access Type</h3>
                        <p>Free vs paid distribution</p>
                      </div>
                    </header>
                    {accessTypeGraph.length ? (
                      <ResponsiveContainer height={280} width="100%">
                        <PieChart>
                          <Pie animationDuration={800} data={accessTypeGraph} dataKey="count" innerRadius={70} nameKey="label" outerRadius={105} paddingAngle={3}>
                            {accessTypeGraph.map((entry, index) => (
                              <Cell fill={pieColors[index % pieColors.length]} key={entry.label} />
                            ))}
                          </Pie>
                          <Tooltip content={dashboardTooltip} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>

                  <article className="analytics-chart-card">
                    <header>
                      <div>
                        <h3>Subscription Status</h3>
                        <p>Active, free and past due</p>
                      </div>
                    </header>
                    {subscriptionStatusGraph.length ? (
                      <ResponsiveContainer height={280} width="100%">
                        <PieChart>
                          <Pie animationDuration={800} data={subscriptionStatusGraph} dataKey="count" innerRadius={72} nameKey="label" outerRadius={108} paddingAngle={4}>
                            {subscriptionStatusGraph.map((entry, index) => (
                              <Cell fill={subscriptionColors[index % subscriptionColors.length]} key={entry.label} />
                            ))}
                          </Pie>
                          <Tooltip content={dashboardTooltip} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>

                  <article className="analytics-chart-card wide">
                    <header>
                      <div>
                        <h3>Revenue Breakdown</h3>
                        <p>Subscription Revenue vs CIBIL Repair Revenue</p>
                      </div>
                    </header>
                    {revenueBreakdown.length ? (
                      <ResponsiveContainer height={310} width="100%">
                        <BarChart data={revenueBreakdown}>
                          <CartesianGrid stroke="#e8edf5" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" />
                          <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value}`} />
                          <Tooltip content={dashboardTooltip} />
                          <Legend />
                          <Bar animationDuration={800} dataKey="subscriptionRevenue" fill="#1769e0" name="Subscription Revenue" radius={[8, 8, 0, 0]} stackId="revenue" />
                          <Bar animationDuration={800} dataKey="cibilRepairRevenue" fill="#13a8a8" name="CIBIL Repair Revenue" radius={[8, 8, 0, 0]} stackId="revenue" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>

                  <article className="analytics-chart-card">
                    <header>
                      <div>
                        <h3>Feedback Rating Distribution</h3>
                        <p>Ratings from 1-5 stars</p>
                      </div>
                    </header>
                    {hasFeedbackData ? (
                      <ResponsiveContainer height={300} width="100%">
                        <BarChart data={feedbackBars} layout="vertical">
                          <CartesianGrid stroke="#e8edf5" horizontal={false} />
                          <XAxis stroke="#64748b" type="number" />
                          <YAxis dataKey="rating" stroke="#64748b" type="category" width={70} />
                          <Tooltip content={dashboardTooltip} />
                          <Bar animationDuration={800} dataKey="count" name="Ratings" radius={[0, 8, 8, 0]}>
                            {feedbackBars.map((entry) => (
                              <Cell fill={entry.rating.startsWith("5") ? "#1769e0" : "#8fb5ef"} key={entry.rating} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>

                  <article className="analytics-chart-card">
                    <header>
                      <div>
                        <h3>CIBIL Repair Status</h3>
                        <p>Upload Document, Submitted, Processing, Closed</p>
                      </div>
                    </header>
                    {repairStatusGraph.length ? (
                      <ResponsiveContainer height={280} width="100%">
                        <PieChart>
                          <Pie data={repairStatusGraph} dataKey="count" innerRadius={70} nameKey="label" outerRadius={105}>
                            {repairStatusGraph.map((entry, index) => (
                              <Cell fill={pieColors[index % pieColors.length]} key={entry.label} />
                            ))}
                          </Pie>
                          <Tooltip content={dashboardTooltip} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>

                  <article className="analytics-chart-card">
                    <header>
                      <div>
                        <h3>Disputes Status</h3>
                        <p>Open, resolved and rejected</p>
                      </div>
                    </header>
                    {disputesStatusGraph.length ? (
                      <ResponsiveContainer height={280} width="100%">
                        <PieChart>
                          <Pie data={disputesStatusGraph} dataKey="count" innerRadius={70} nameKey="label" outerRadius={105}>
                            {disputesStatusGraph.map((entry, index) => (
                              <Cell fill={pieColors[index % pieColors.length]} key={entry.label} />
                            ))}
                          </Pie>
                          <Tooltip content={dashboardTooltip} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>

                  <article className="analytics-chart-card full">
                    <header>
                      <div>
                        <h3>Monthly Activity</h3>
                        <p>Users, messages and loans by month</p>
                      </div>
                    </header>
                    {monthlyRecords.length ? (
                      <ResponsiveContainer height={340} width="100%">
                        <LineChart data={monthlyRecords}>
                          <CartesianGrid stroke="#e8edf5" vertical={false} />
                          <XAxis dataKey="label" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip content={dashboardTooltip} />
                          <Legend />
                          <Line animationDuration={900} dataKey="users" dot={false} name="Users" stroke="#1769e0" strokeWidth={3} type="monotone" />
                          <Line animationDuration={900} dataKey="messages" dot={false} name="Messages" stroke="#13a8a8" strokeWidth={3} type="monotone" />
                          <Line animationDuration={900} dataKey="loans" dot={false} name="Loans" stroke="#f59e0b" strokeWidth={3} type="monotone" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="analytics-empty">No Data Available</div>
                    )}
                  </article>
                </section>
              </section>
            )}
          </div>
        </section>
        {isHomepageThemeModalOpen ? (
          <div className="modal-backdrop">
            <section className="plan-modal homepage-theme-modal">
              <header>
                <div>
                  <h3>{homepageThemeForm.originalImageName ? "Update Theme" : "Add Theme"}</h3>
                  {/* <p>Homepage Themes</p> */}
                </div>
                <button type="button" onClick={closeHomepageThemeModal}>
                  ×
                </button>
              </header>

              <form className="homepage-theme-form" onSubmit={saveHomepageTheme}>
                <label>
                  Image Name
                  <input
                    required
                    value={homepageThemeForm.imageName}
                    onChange={(event) => setHomepageThemeForm((theme) => ({ ...theme, imageName: event.target.value }))}
                  />
                </label>
                <label>
                  Image
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(event) => setHomepageThemeForm((theme) => ({ ...theme, image: event.target.files?.[0] || null }))}
                  />
                </label>
                <label className="faq-checkbox">
                  Active
                  <input
                    checked={homepageThemeForm.isActive}
                    type="checkbox"
                    onChange={(event) => setHomepageThemeForm((theme) => ({ ...theme, isActive: event.target.checked }))}
                  />
                </label>
                <footer className="modal-actions">
                  <button type="button" onClick={closeHomepageThemeModal}>
                    Cancel
                  </button>
                  {(homepageThemeForm.originalImageName ? canUpdateHomepageThemes : canCreateHomepageThemes) ? (
                    <button disabled={Boolean(savingHomepageTheme) && savingHomepageTheme === homepageThemeForm.imageName} type="submit">
                      {Boolean(savingHomepageTheme) && savingHomepageTheme === homepageThemeForm.imageName ? (
                        "Saving..."
                      ) : (
                        <>
                          <ActionIcon type={homepageThemeForm.originalImageName ? "edit" : "add"} />
                          {homepageThemeForm.originalImageName ? "Update" : "Add"}
                        </>
                      )}
                    </button>
                  ) : null}
                </footer>
              </form>
            </section>
          </div>
        ) : null}
        {deletingHomepageTheme && canDeleteHomepageThemes ? (
          <div className="modal-backdrop">

            <section className="plan-modal confirm-delete-modal">
              <p>Are you sure want to delete?</p>

              <footer className="modal-actions">
                <button
                  disabled={isDeletingHomepageTheme}
                  type="button"
                  onClick={closeDeleteHomepageThemeModal}
                >
                  Cancel
                </button>

                <button
                  className="danger-action"
                  disabled={isDeletingHomepageTheme}
                  type="button"
                  onClick={deleteHomepageTheme}
                >
                  {isDeletingHomepageTheme ? "Deleting..." : "Delete"}
                </button>
              </footer>
            </section>

          </div>
        ) : null}
        {deletingCibilRepairTimelineIndex !== null && canDeletePlans ? (
          <div className="modal-backdrop">
            <section className="plan-modal confirm-delete-modal">
              <h4>Are you sure want to delete?</h4>

              <footer className="modal-actions">
                <button
                  disabled={isCibilRepairSaving}
                  type="button"
                  onClick={() => setDeletingCibilRepairTimelineIndex(null)}
                >
                  Cancel
                </button>

                <button
                  className="danger-action"
                  disabled={isCibilRepairSaving}
                  type="button"
                  onClick={() => removeCibilRepairTimeline(deletingCibilRepairTimelineIndex)}
                >
                  {isCibilRepairSaving ? "Deleting..." : "Delete"}
                </button>
              </footer>
            </section>
          </div>
        ) : null}
        {isNotificationsDrawerOpen ? (
          <div className="notifications-drawer-backdrop" onClick={() => setIsNotificationsDrawerOpen(false)}>
            <aside className="notifications-drawer" onClick={(event) => event.stopPropagation()}>
              <header>
                <div>
                  <h3>Notifications</h3>
                  <p>{notificationsData?.unreadCount ?? 0} unread</p>
                </div>
                <button type="button" onClick={() => setIsNotificationsDrawerOpen(false)}>
                  ×
                </button>
              </header>

              <div className="notifications-drawer-list" onScroll={handleNotificationsScroll}>
                {notificationsData?.notifications.length ? (
                  notificationsData.notifications.map((notification) => (
                    <button
                      className={`notifications-drawer-item ${notification.isRead || notification.readAt ? "" : "unread"}`}
                      key={notification.publicId || notification.id}
                      type="button"
                      onClick={() => markAdminNotificationRead(notification.publicId)}
                    >
                      <span>{notification.type || "notification"}</span>
                      <strong>{notification.title || "-"}</strong>
                      <p>{notification.message || "-"}</p>
                      <small>{formatDate(notification.createdAt || null)}</small>
                    </button>
                  ))
                ) : (
                  <div className="notifications-drawer-empty">
                    <span>{isNotificationsLoading ? "↻" : "🔔"}</span>
                    <strong>{isNotificationsLoading ? "Loading notifications" : "You're all caught up"}</strong>
                    <p>{isNotificationsLoading ? "Please wait while we fetch updates." : "No new notifications to show right now."}</p>
                  </div>
                )}
                {isNotificationsPaging ? <p className="notifications-loading-more">Loading more...</p> : null}
              </div>
            </aside>
          </div>
        ) : null}
        {isNotificationModalOpen && canCreateNotifications ? (
          <div className="modal-backdrop">
            <section className="plan-modal admin-plan-modal notification-modal">
              <header>
                <div>
                  <h3>{notificationModalScope === "all" ? "Send to all users" : "Send notification"}</h3>
                  <p>{notificationModalScope === "users" ? `${selectedNotificationUserIds.length} selected` : "All active users"}</p>
                </div>
                <button type="button" onClick={closeNotificationModal}>
                  ×
                </button>
              </header>

              <form className="general-form modal-plan-form" onSubmit={(event) => {
                event.preventDefault();
                sendAdminNotification(notificationModalScope);
              }}>
                <label>
                  Title
                  <input required value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} />
                </label>
                <label>
                  Message
                  <textarea required value={notificationMessage} onChange={(event) => setNotificationMessage(event.target.value)} />
                </label>
                <footer className="modal-actions">
                  <button disabled={isNotificationSending} type="button" onClick={closeNotificationModal}>
                    Cancel
                  </button>
                  <button disabled={isNotificationSending || !notificationTitle || !notificationMessage} type="submit">
                    {isNotificationSending ? "Sending..." : "Send"}
                  </button>
                </footer>
              </form>
            </section>
          </div>
        ) : null}
        {isEmployeeModalOpen ? (
          <div className="modal-backdrop">
            <section className="plan-modal admin-plan-modal employee-modal">
              <header>
                <div>
                  <h3>{editingEmployeeId ? "Edit Employee" : "Add Employee"}</h3>
                  <p>Employee Management</p>
                </div>
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)}>
                  ×
                </button>
              </header>

              <form className="admin-plan-form modal-plan-form" onSubmit={saveEmployee}>
                <div className="admin-plan-grid">
                  <label>
                    Full Name
                    <input required value={employeeForm.fullName} onChange={(event) => setEmployeeForm((employee) => ({ ...employee, fullName: event.target.value }))} />
                  </label>
                  <label>
                    Mobile Number
                    <input required maxLength={10} value={employeeForm.mobileNumber} onChange={(event) => setEmployeeForm((employee) => ({ ...employee, mobileNumber: event.target.value.replace(/\D/g, "") }))} />
                  </label>
                  <label>
                    Email
                    <input required type="email" value={employeeForm.email} onChange={(event) => setEmployeeForm((employee) => ({ ...employee, email: event.target.value }))} />
                  </label>
                  <label>
                    Role
                    <select
                      value={employeeForm.rolePublicId}
                      onChange={(event) => {
                        const role = employeeRoles.find((item) => item.publicId === event.target.value);
                        setEmployeeForm((employee) => ({
                          ...employee,
                          rolePublicId: event.target.value,
                          role: role?.roleName || "",
                        }));
                      }}
                    >
                      <option value="">Select Role</option>
                      {employeeRoles.map((role) => (
                        <option key={role.publicId} value={role.publicId}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Department
                    <input required value={employeeForm.department} onChange={(event) => setEmployeeForm((employee) => ({ ...employee, department: event.target.value }))} />
                  </label>
                  <label>
                    Designation
                    <input required value={employeeForm.designation} onChange={(event) => setEmployeeForm((employee) => ({ ...employee, designation: event.target.value }))} />
                  </label>
                  <label>
                    Status
                    <select value={employeeForm.status} onChange={(event) => setEmployeeForm((employee) => ({ ...employee, status: event.target.value }))}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </label>
                  <label>
                    Joined At
                    <DateFilter
                      className="employee-joined-date"
                      label="Joined At"
                      value={employeeForm.joinedAt}
                      onChange={(value) => setEmployeeForm((employee) => ({ ...employee, joinedAt: value }))}
                    />
                  </label>
                </div>
                <footer className="modal-actions">
                  <button type="button" onClick={() => setIsEmployeeModalOpen(false)}>
                    Cancel
                  </button>
                  {(editingEmployeeId ? canUpdateEmployees : canCreateEmployees) ? (
                    <button disabled={isEmployeeSaving} type="submit">
                      {isEmployeeSaving ? "Saving..." : editingEmployeeId ? "Update" : "Add"}
                    </button>
                  ) : null}
                </footer>
              </form>
            </section>
          </div>
        ) : null}
        {deletingEmployee && canDeleteEmployees ? (
          <div className="modal-backdrop">
            <section className="plan-modal confirm-delete-modal">
              <p>Are you sure want to delete?</p>
              <footer className="modal-actions">
                <button disabled={isEmployeeSaving} type="button" onClick={() => setDeletingEmployee(null)}>
                  Cancel
                </button>
                <button className="danger-action" disabled={isEmployeeSaving} type="button" onClick={deleteEmployee}>
                  {isEmployeeSaving ? "Deleting..." : "Delete"}
                </button>
              </footer>
            </section>
          </div>
        ) : null}
        {deletingEmployeeRole && canDeleteRoles ? (
          <div className="modal-backdrop">
            <section className="plan-modal confirm-delete-modal">
              <p>Are you sure want to delete?</p>
              <footer className="modal-actions">
                <button disabled={isEmployeeRolesLoading} type="button" onClick={() => setDeletingEmployeeRole(null)}>
                  Cancel
                </button>
                <button className="danger-action" disabled={isEmployeeRolesLoading} type="button" onClick={deleteEmployeeRole}>
                  {isEmployeeRolesLoading ? "Deleting..." : "Delete"}
                </button>
              </footer>
            </section>
          </div>
        ) : null}
        {isAdminPlanModalOpen ? (
          <div className="modal-backdrop">
            <section className="plan-modal admin-plan-modal">
              <header>
                <div>
                  <h3>{editingAdminPlanId ? "Edit Plan" : "Add Plan"}</h3>
                  <p>Plans & Benefits</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminPlanModalOpen(false);
                    setEditingAdminPlanId(null);
                    setAdminPlanForm(emptyAdminPlanForm);
                  }}
                >
                  ×
                </button>
              </header>

              <form className="admin-plan-form modal-plan-form" onSubmit={saveAdminPlan}>
                <div className="admin-plan-grid">
                  <label>
                    Public ID
                    <input
                      disabled={Boolean(editingAdminPlanId)}
                      required
                      value={adminPlanForm.publicId}
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, publicId: event.target.value }))}
                    />
                  </label>
                  <label>
                    Plan Name
                    <input
                      required
                      value={adminPlanForm.planName}
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, planName: event.target.value }))}
                    />
                  </label>
                  <label>
                    Amount
                    <input
                      required
                      min={0}
                      type="number"
                      value={adminPlanForm.amount}
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, amount: event.target.value }))}
                    />
                  </label>
                  <label>
                    GST Percentage
                    <input
                      required
                      min={0}
                      type="number"
                      value={adminPlanForm.gstPercentage}
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, gstPercentage: event.target.value }))}
                    />
                  </label>
                  <label>
                    Offer Tag
                    <input
                      value={adminPlanForm.offerTag}
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, offerTag: event.target.value }))}
                    />
                  </label>
                  <label>
                    Display Order
                    <input
                      required
                      min={1}
                      type="number"
                      value={adminPlanForm.displayOrder}
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, displayOrder: event.target.value }))}
                    />
                  </label>
                </div>

                <label>
                  Benefits
                  <textarea
                    value={adminPlanForm.benefits}
                    onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, benefits: event.target.value }))}
                  />
                </label>
                <div className="admin-plan-grid compact">
                  <label className="faq-checkbox admin-plan-active">
                    <input
                      checked={adminPlanForm.isActive}
                      type="checkbox"
                      onChange={(event) => setAdminPlanForm((plan) => ({ ...plan, isActive: event.target.checked }))}
                    />
                    Active
                  </label>
                </div>
                <footer className="modal-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminPlanModalOpen(false);
                      setEditingAdminPlanId(null);
                      setAdminPlanForm(emptyAdminPlanForm);
                    }}
                  >
                    Cancel
                  </button>
                  {(editingAdminPlanId ? canUpdatePlans : canCreatePlans) ? (
                    <button disabled={isAdminPlanSaving} type="submit">
                      {isAdminPlanSaving ? (
                        "Saving..."
                      ) : (
                        <>
                          <ActionIcon type={editingAdminPlanId ? "edit" : "add"} />
                          {editingAdminPlanId ? "Update Plan" : "Add Plan"}
                        </>
                      )}
                    </button>
                  ) : null}
                </footer>
              </form>
            </section>
          </div>
        ) : null}
        {isUserDetailLoading || selectedUserError || selectedUserDetail ? (
          <div className="user-detail-backdrop" onClick={() => {
            setSelectedUserDetail(null);
            setSelectedUserError("");
          }}>
            <aside className="user-detail-drawer" onClick={(event) => event.stopPropagation()}>
              <header>
                <div className="user-detail-profile">
                  <span>{selectedUserDetail?.user.fullName?.slice(0, 2).toUpperCase() || selectedUserDetail?.user.mobileNumber.slice(-2) || "--"}</span>
                  <div>
                    <h3>{selectedUserDetail?.user.fullName || "User details"}</h3>
                    <p>
                      {[selectedUserDetail?.user.panNumber, selectedUserDetail?.user.mobileNumber].filter(Boolean).join(" · ") || "-"}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => {
                  setSelectedUserDetail(null);
                  setSelectedUserError("");
                }}>
                  ×
                </button>
              </header>

              {isUserDetailLoading ? (
                <div className="user-detail-loading">
                  <span className="table-loader" />
                </div>
              ) : selectedUserError ? (
                <p className="dashboard-error">{selectedUserError}</p>
              ) : selectedUserDetail ? (
                <>
                  <section>
                    <h4>User Info</h4>
                    <div className="user-detail-metrics">
                      <span><small>Email</small><strong>{selectedUserDetail.user.email || "-"}</strong></span>
                      <span><small>DOB</small><strong>{formatDate(selectedUserDetail.user.dateOfBirth || null)}</strong></span>
                      <span><small>Access</small><strong>{formatLabel(selectedUserDetail.user.accessType || "-")}</strong></span>
                      <span><small>Status</small><strong>{formatLabel(selectedUserDetail.user.status || "-")}</strong></span>
                      <span><small>Admin</small><strong>{selectedUserDetail.user.isAdmin ? "Yes" : "No"}</strong></span>
                      <span><small>Last login</small><strong>{formatDateTime(selectedUserDetail.user.lastLoginAt || null)}</strong></span>
                      <span><small>Created</small><strong>{formatDateTime(selectedUserDetail.user.createdAt || null)}</strong></span>
                      <span><small>Updated</small><strong>{formatDateTime(selectedUserDetail.user.updatedAt || null)}</strong></span>
                    </div>
                  </section>

                  <section>
                    <h4>Subscription</h4>
                    <div className="user-detail-metrics">
                      <span><small>Status</small><strong>{formatLabel(selectedUserDetail.user.subscriptionStatus || "-")}</strong></span>
                      <span><small>Amount</small><strong>INR {Number(selectedUserDetail.user.subscriptionAmount || 0).toLocaleString("en-IN")}</strong></span>
                      <span><small>Latest amount</small><strong>INR {Number(selectedUserDetail.user.latestSubscriptionAmount || 0).toLocaleString("en-IN")}</strong></span>
                      <span><small>Started</small><strong>{formatDateTime(selectedUserDetail.user.subscriptionStartedAt || null)}</strong></span>
                      <span><small>Due</small><strong>{formatDateTime(selectedUserDetail.user.subscriptionDueAt || null)}</strong></span>
                      <span><small>Ends</small><strong>{formatDateTime(selectedUserDetail.user.subscriptionEndsAt || null)}</strong></span>
                      <span><small>Updated by</small><strong>{selectedUserDetail.user.planUpdatedByUserName || selectedUserDetail.user.planUpdatedBy || "-"}</strong></span>
                    </div>
                  </section>

                  <section>
                    <h4>KYC Status</h4>
                    <div className="user-detail-list">
                      {Object.entries(selectedUserDetail.kycStatus).map(([key, item]) => (
                        <div key={key}>
                          <span className={`status-dot ${item.status}`} />
                          <strong>{formatLabel(key)}</strong>
                          <em className={item.status}>{formatLabel(item.status)} · {formatDateTime(item.verifiedAt || item.completedAt || null)}</em>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4>Bureau Scores</h4>
                    {selectedUserDetail.bureauScores.length ? (
                      <div className="user-score-grid">
                        {selectedUserDetail.bureauScores.map((score, index) => (
                          <article key={`${score.bureau || score.name || "score"}-${index}`}>
                            <span>{formatLabel(score.bureau || score.name || "Bureau")}</span>
                            <strong>{score.creditScore ?? score.score ?? "-"}</strong>
                            <em>{[score.reportType ? formatLabel(score.reportType) : "", score.providerMessage || score.status || "", formatDateTime(score.syncedAt || score.lastSyncedAt || null)].filter(Boolean).join(" · ")}</em>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="user-detail-empty">No bureau scores found</p>
                    )}
                  </section>

                  <section>
                    <h4>Recent Activity</h4>
                    {selectedUserDetail.recentActivity.length ? (
                      <div className="user-activity-list">
                        {selectedUserDetail.recentActivity.map((activity, index) => (
                          <div key={`${activity.type}-${index}`}>
                            <strong>{activity.label || formatLabel(activity.type)}{activity.amount != null ? ` · ${activity.currency || "INR"} ${Number(activity.amount).toLocaleString("en-IN")}` : ""}</strong>
                            <span>{formatDateTime(activity.occurredAt)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="user-detail-empty">No recent activity found</p>
                    )}
                  </section>
                </>
              ) : null}
            </aside>
          </div>
        ) : null}
        {selectedSubscriptionUser ? (
          <div className="modal-backdrop">
            <section className="plan-modal">
              <header>
                <div>
                  <h3>Update Plan</h3>
                  <p>{selectedSubscriptionUser.fullName}</p>
                </div>
                <button type="button" onClick={() => setSelectedSubscriptionUser(null)}>
                  ×
                </button>
              </header>

              {plansError ? <p className="dashboard-error">{plansError}</p> : null}

              <div className="plan-grid">
                {isPlansLoading ? (
                  <div className="plan-loading">
                    <span className="table-loader" />
                    Loading plans...
                  </div>
                ) : (
                  subscriptionPlans.map((plan) => (
                    <button
                      className={selectedPlanId === plan.publicId ? "selected" : ""}
                      key={plan.publicId}
                      type="button"
                      onClick={() => {
                        setSelectedPlanId(plan.publicId);
                        setPlanAmount(String(plan.amount));
                      }}
                    >
                      <strong>{plan.planName}</strong>
                      <span>{plan.currency} {plan.amount}</span>
                      {plan.offerTag ? <em>{plan.offerTag}</em> : null}
                      {plan.recommendedFor ? <small>{plan.recommendedFor}</small> : null}
                    </button>
                  ))
                )}
              </div>

              <label className="amount-field">
                Amount
                <input value={planAmount} onChange={(event) => setPlanAmount(event.target.value.replace(/[^\d.]/g, ""))} />
              </label>
              <footer className="modal-actions">
                <button type="button" onClick={() => setSelectedSubscriptionUser(null)}>
                  Cancel
                </button>
                {canUpdateSubscriptions ? (
                  <button disabled={isUpdatingPlan || !planAmount} type="button" onClick={updateSubscriptionPlan}>
                    {isUpdatingPlan ? "Updating..." : "Submit"}
                  </button>
                ) : null}
              </footer>
            </section>
          </div>
        ) : null}
        {selectedCreditRepair ? (
          <div className="modal-backdrop">
            <section className="plan-modal credit-repair-modal">
              <header>
                <div><h3>Update Credit Repair</h3><p>{selectedCreditRepair.userName || "Request"}</p></div>
                <button type="button" onClick={() => setSelectedCreditRepair(null)}>×</button>
              </header>
              <div className="credit-repair-drawer">
                <div className="credit-repair-main">
                  <div className="credit-repair-case-header">
                    <div>
                      <span>Case #{selectedCreditRepair.publicId || selectedCreditRepair.id}</span>
                      <strong>{selectedCreditRepair.userName || "-"}</strong>
                      <small>{selectedCreditRepair.mobileNumber || "-"} · {selectedCreditRepair.email || "-"} · Submitted {formatDate(selectedCreditRepair.createdAt || null)}</small>
                      <div className="credit-repair-badges">
                        <em className="success">{formatLabel(selectedCreditRepair.paymentStatus)} · {selectedCreditRepair.currency || "INR"} {Number(selectedCreditRepair.amount || 0).toLocaleString("en-IN")}</em>
                        <em>{selectedCreditRepair.planName || "-"}</em>
                        <em className="warning">{formatLabel(selectedCreditRepair.repairStatus)}</em>
                        {isCreditRepairDetailLoading ? <em>Loading details...</em> : null}
                      </div>
                    </div>
                  </div>

                  <div className="credit-repair-section-title">User details</div>
                  <div className="credit-repair-info-grid">
                    <span><small>Mobile</small><strong>{selectedCreditRepair.mobileNumber || "-"}</strong></span>
                    <span><small>Email</small><strong>{selectedCreditRepair.email || "-"}</strong></span>
                    <span><small>Plan</small><strong>{selectedCreditRepair.planName || "-"}</strong></span>
                    <span><small>Amount paid</small><strong>{selectedCreditRepair.currency || "INR"} {Number(selectedCreditRepair.amount || 0).toLocaleString("en-IN")}</strong></span>
                    <span><small>Payment status</small><strong>{formatLabel(selectedCreditRepair.paymentStatus)}</strong></span>
                    <span><small>Bureau</small><strong>{selectedCreditRepair.bureau || "-"}</strong></span>
                    <span><small>Updated</small><strong>{formatDate(selectedCreditRepair.updatedAt || null)}</strong></span>
                  </div>

                  <div className="credit-repair-section-title">Credit accounts with issues</div>
                  <div className="credit-repair-account-list">
                    {selectedCreditRepair.accounts?.length ? selectedCreditRepair.accounts.map((account, index) => (
                      <div className="credit-repair-account-card" key={`${account.accountNumber}-${index}`}>
                        <div>
                          <strong>{account.subscriberName || "-"} · {account.accountType || "-"}</strong>
                          <small>Acc: {account.accountNumber || "-"}</small>
                        </div>
                        <em>{formatLabel(account.issueType || "issue")}</em>
                        <div className="credit-repair-dispute-row">
                          <small>Dispute status:</small>
                          <em>{formatLabel(account.disputeStatus || "not_filed")}</em>
                          <button type="button" disabled={!account.id || filingCreditRepairAccountId === account.id} onClick={() => fileCreditRepairDispute(account)}>
                            {filingCreditRepairAccountId === account.id ? "Filing..." : "File dispute"}
                          </button>
                        </div>
                      </div>
                    )) : <div className="credit-repair-empty">No account issues found</div>}
                  </div>

                  <div className="credit-repair-section-title">Uploaded documents</div>
                  <div className="credit-repair-doc-list">
                    {selectedCreditRepair.documents?.length ? selectedCreditRepair.documents.map((document, index) => (
                      <div className="credit-repair-doc-item" key={document.id || `${document.documentUrl}-${index}`}>
                        <span>PDF</span>
                        <div>
                          <strong>{formatLabel(document.documentType || `Document ${index + 1}`)}</strong>
                          <small>{document.accountType || "Document"}{document.fileSize ? ` · ${document.fileSize}` : ""} · Uploaded {formatDate(document.createdAt || null)}</small>
                        </div>
                        {document.documentUrl ? (
                          <a className="table-action" href={document.documentUrl} rel="noreferrer" target="_blank">View</a>
                        ) : null}
                      </div>
                    )) : <div className="credit-repair-empty">No documents uploaded</div>}
                    <div className="credit-repair-upload-box">
                      <select value={creditRepairUploadAccountNumber} onChange={(event) => setCreditRepairUploadAccountNumber(event.target.value)}>
                        <option value="">Select account</option>
                        {selectedCreditRepair.accounts?.map((account, index) => (
                          <option key={`${account.accountNumber}-${index}`} value={account.accountNumber}>{account.subscriberName || account.accountType || "Account"} · {account.accountNumber}</option>
                        ))}
                      </select>
                      <input type="file" onChange={(event) => setCreditRepairUploadFile(event.target.files?.[0] || null)} />
                      <button className="credit-repair-upload-row" type="button" disabled={isUploadingCreditRepairDocument || !creditRepairUploadFile || !creditRepairUploadAccountNumber} onClick={uploadCreditRepairDocument}>
                        {isUploadingCreditRepairDocument ? "Uploading..." : "Upload additional document"}
                      </button>
                    </div>
                  </div>

                  <div className="credit-repair-section-title">Activity timeline</div>
                  <div className="credit-repair-timeline">
                    {selectedCreditRepair.timeline?.length ? selectedCreditRepair.timeline.map((item) => (
                      <div key={item.id}>
                        <span />
                        <p><small>{formatDateTime(item.createdAt || null)}</small>{item.title || "Activity"}{item.description ? `: ${item.description}` : ""}<strong>{item.actorName || "System"}</strong></p>
                      </div>
                    )) : (
                      <>
                        <div>
                          <span />
                          <p><small>{formatDateTime(selectedCreditRepair.createdAt || null)}</small>Case created. Payment of {selectedCreditRepair.currency || "INR"} {Number(selectedCreditRepair.amount || 0).toLocaleString("en-IN")} confirmed.<strong>System</strong></p>
                        </div>
                        {selectedCreditRepair.accounts?.length ? (
                          <div>
                            <span />
                            <p><small>{formatDateTime(selectedCreditRepair.createdAt || null)}</small>{selectedCreditRepair.accounts.length} account issue{selectedCreditRepair.accounts.length > 1 ? "s" : ""} found for review.<strong>System</strong></p>
                          </div>
                        ) : null}
                        <div>
                          <span />
                          <p><small>{formatDateTime(selectedCreditRepair.updatedAt || selectedCreditRepair.createdAt || null)}</small>Case marked "{formatLabel(selectedCreditRepair.repairStatus)}".<strong>Admin</strong></p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="credit-repair-section-title">Internal notes</div>
                  <label className="amount-field">
                    Remarks
                    <textarea value={creditRepairRemarks} onChange={(event) => setCreditRepairRemarks(event.target.value)} />
                  </label>
                  <button className="credit-repair-inline-action" disabled={isUpdatingCreditRepair} type="button" onClick={() => updateCreditRepairRequest(creditRepairStatus, false)}>
                    Save note
                  </button>
                </div>

                <aside className="credit-repair-side">
                  <div className="credit-repair-side-section">
                    <div className="credit-repair-side-title">Repair status</div>
                    <div className="credit-repair-stepper">
                      {creditRepairStatusOptions.map((status, index) => {
                        const activeIndex = creditRepairStatusOptions.indexOf(creditRepairStatus);
                        return (
                          <div className="credit-repair-step" key={status}>
                            <span className={index < activeIndex ? "done" : index === activeIndex ? "active" : ""}>{index < activeIndex ? "OK" : index + 1}</span>
                            <div>
                              <strong>{formatLabel(status)}</strong>
                              <small>{index === activeIndex ? "In progress" : index < activeIndex ? "Completed" : "Pending"}</small>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="credit-repair-side-section">
                    <div className="credit-repair-side-title">Assign employee</div>
                    <label className="amount-field">
                      Employee
                      <select disabled={!canManageCreditRepairAdminFields} value={creditRepairEmployeeId} onChange={(event) => setCreditRepairEmployeeId(event.target.value)}>
                        <option value="">-- Select employee --</option>
                        {employeesData?.employees.map((employee) => (
                          <option key={employee.publicId} value={employee.publicId}>{employee.fullName} ({formatLabel(employee.status)})</option>
                        ))}
                      </select>
                    </label>
                    <button className="credit-repair-side-action" type="button" disabled={!canManageCreditRepairAdminFields || isAssigningCreditRepair || !creditRepairEmployeeId} onClick={assignCreditRepairEmployee}>
                      {isAssigningCreditRepair ? "Assigning..." : "Assign & notify"}
                    </button>
                  </div>

                  <div className="credit-repair-side-section">
                    <div className="credit-repair-side-title">Update status</div>
                    <label className="amount-field">
                      Status
                      <select value={creditRepairStatus} onChange={(event) => setCreditRepairStatus(event.target.value)}>
                        {creditRepairStatusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                      </select>
                    </label>
                    <button className="credit-repair-side-action primary" disabled={isUpdatingCreditRepair} type="button" onClick={() => updateCreditRepairRequest()}>
                      Update status
                    </button>
                  </div>

                  <div className="credit-repair-side-section">
                    <div className="credit-repair-side-title">Progress</div>
                    <div className="credit-repair-stats">
                      <span><small>Active disputes</small><strong>{selectedCreditRepair.activeDisputes ?? 0}</strong></span>
                      <span><small>Resolved</small><strong>{selectedCreditRepair.resolvedDisputes ?? 0}</strong></span>
                      <span><small>Points gained</small><strong>{selectedCreditRepair.pointsGained ?? 0}</strong></span>
                    </div>
                  </div>

                  <div className="credit-repair-side-section">
                    <div className="credit-repair-side-title">Notify user</div>
                    <label className="credit-repair-toggle"><input type="checkbox" disabled={!canManageCreditRepairAdminFields} checked={creditRepairWhatsappNotify} onChange={(event) => setCreditRepairWhatsappNotify(event.target.checked)} /> WhatsApp on status change</label>
                    <label className="credit-repair-toggle"><input type="checkbox" disabled={!canManageCreditRepairAdminFields} checked={creditRepairEmailNotify} onChange={(event) => setCreditRepairEmailNotify(event.target.checked)} /> Email on dispute update</label>
                    <textarea className="credit-repair-message" disabled={!canManageCreditRepairAdminFields} value={creditRepairWhatsappMessage} onChange={(event) => setCreditRepairWhatsappMessage(event.target.value)} />
                    <button className="credit-repair-side-action" type="button" disabled={!canManageCreditRepairAdminFields || isSendingCreditRepairWhatsapp || !creditRepairWhatsappMessage.trim()} onClick={sendCreditRepairWhatsapp}>
                      {isSendingCreditRepairWhatsapp ? "Sending..." : "Send manual WhatsApp"}
                    </button>
                  </div>

                  <div className="credit-repair-side-section">
                    <div className="credit-repair-side-title">Case actions</div>
                    <button className="credit-repair-side-action success" disabled={isUpdatingCreditRepair} type="button" onClick={() => updateCreditRepairRequest("resolved")}>Mark resolved</button>
                    <button className="credit-repair-side-action danger" disabled={isUpdatingCreditRepair} type="button" onClick={() => updateCreditRepairRequest("cancelled")}>Reject & refund</button>
                  </div>
                </aside>
              </div>
              <footer className="modal-actions">
                <button type="button" onClick={() => setSelectedCreditRepair(null)}>Cancel</button>
                <button disabled={isUpdatingCreditRepair} type="button" onClick={() => updateCreditRepairRequest()}>{isUpdatingCreditRepair ? "Updating..." : "Submit"}</button>
              </footer>
            </section>
          </div>
        ) : null}
        {selectedDispute ? (
          <div className="modal-backdrop">
            <section className="plan-modal">
              <header>
                <div><h3>Update Dispute</h3><p>{selectedDispute.userName || "Dispute"}</p></div>
                <button type="button" onClick={() => setSelectedDispute(null)}>×</button>
              </header>
              <label className="amount-field">
                Status
                <select value={disputeStatus} onChange={(event) => setDisputeStatus(event.target.value)}>
                  {disputeStatusOptions.map((status) => <option key={status} value={status}>{formatLabel(status)}</option>)}
                </select>
              </label>
              <label className="amount-field">
                Remarks
                <textarea value={disputeRemarks} onChange={(event) => setDisputeRemarks(event.target.value)} />
              </label>
              <footer className="modal-actions">
                <button type="button" onClick={() => setSelectedDispute(null)}>Cancel</button>
                <button disabled={isUpdatingDispute} type="button" onClick={updateDispute}>{isUpdatingDispute ? "Updating..." : "Submit"}</button>
              </footer>
            </section>
          </div>
        ) : null}
        {selectedLoan ? (
          <div className="modal-backdrop">
            <section className="plan-modal">
              <header>
                <div>
                  <h3>Update Loan</h3>
                  <p>{selectedLoan.user.fullName}</p>
                </div>
                <button type="button" onClick={() => setSelectedLoan(null)}>
                  ×
                </button>
              </header>

              <div className="loan-details">
                <span>Loan Type <strong>{getLoanTypeLabel(selectedLoan.loanType)}</strong></span>
                <span>Amount <strong>₹{selectedLoan.loanAmount}</strong></span>
                <span>Mobile <strong>{selectedLoan.user.mobileNumber}</strong></span>
                <span>PAN <strong>{selectedLoan.user.panNumber}</strong></span>
                <span>Employment <strong>{selectedLoan.employmentType}</strong></span>
                <span>Income <strong>₹{selectedLoan.monthlyIncome}</strong></span>
              </div>

              <label className="amount-field">
                Status
                <select value={loanUpdateStatus} onChange={(event) => setLoanUpdateStatus(event.target.value)}>
                  {loanStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="amount-field">
                Remarks
                <textarea value={loanRemarks} onChange={(event) => setLoanRemarks(event.target.value)} />
              </label>

              <footer className="modal-actions">
                <button type="button" onClick={() => setSelectedLoan(null)}>
                  Cancel
                </button>
                {canUpdateLoans ? (
                  <button disabled={isUpdatingLoan} type="button" onClick={updateLoanStatus}>
                    {isUpdatingLoan ? "Updating..." : "Submit"}
                  </button>
                ) : null}
              </footer>
            </section>
          </div>
        ) : null}
        {toast ? <div className={`toast ${toast.type}`}>{toast.message}</div> : null}
      </main>
    );
  }

  if (isSessionChecking) {
    return <main className="auth-page" />;
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <aside className="auth-visual">
          <div className="auth-brand">
            <img src="/scorecare-logo.PNG" alt="ScoreCare" />
            <span>Score care</span>
          </div>
          <div className="auth-illustration" aria-hidden="true">
            <img src="/admin-login-illustration.svg" alt="" />
          </div>
        </aside>
        <section className="auth-panel">
          {step === "mobile" ? (
            <form className="auth-box" onSubmit={submitMobile}>
              <div className="auth-header">
                <h1>Welcome to ScoreCare Admin</h1>
                <p>Your Admin Dashboard</p>
              </div>
              <label htmlFor="mobile">Mobile Number</label>
              <div className="auth-field">
                <span className="country-code">
                  <span className="india-flag" aria-hidden="true">
                    <span />
                  </span>
                  +91
                </span>
                <input
                  id="mobile"
                  required
                  inputMode="numeric"
                  maxLength={10}
                  minLength={10}
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))}
                />
              </div>
              {error ? <p className="auth-error">{error}</p> : null}
              <button disabled={isLoading} type="submit">
                {isLoading ? "Sending OTP..." : "Next"}
              </button>
            </form>
          ) : step === "otp" ? (
            <form className="auth-box" onSubmit={submitOtp}>
              <button className="auth-back" type="button" onClick={goBackToMobile} aria-label="Back to mobile number">
                ‹
              </button>
              <div className="auth-header">
                <h1>Enter OTP</h1>
                <p>Verification code sent to {mobile}</p>
              </div>
              <label htmlFor="otp-0">OTP</label>
              <div className="otp-fields">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    id={index === 0 ? "otp-0" : undefined}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    required
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(event) => updateOtpAtIndex(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>
              {error ? <p className="auth-error">{error}</p> : null}
              <button disabled={isLoading} type="submit">
                {isLoading ? "Verifying..." : "Submit"}
              </button>
              <button className="auth-resend" disabled={isLoading || resendSeconds > 0} type="button" onClick={resendOtp}>
                Resend OTP {resendSeconds > 0 ? `00:${String(resendSeconds).padStart(2, "0")}` : ""}
              </button>
            </form>
          ) : (
            <form className="auth-box" onSubmit={submitAuthenticator}>
              <button className="auth-back" type="button" onClick={goBackToMobile} aria-label="Back to mobile number">
                ‹
              </button>
              <div className="auth-header">
                <h1>Authenticator</h1>
                <p>{authenticatorSetup ? "Scan this QR, then enter the 6 digit code" : "Enter the 6 digit code from your authenticator app"}</p>
              </div>
              {authenticatorSetup ? (
                <div className="authenticator-setup">
                  <QRCodeSVG className="authenticator-qr" value={authenticatorSetup.otpauthUrl} size={180} />
                  <p className="authenticator-secret">{authenticatorSetup.secret}</p>
                </div>
              ) : null}
              <label htmlFor="authenticator-code">Authenticator Code</label>
              <div className="auth-field">
                <input
                  id="authenticator-code"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  minLength={6}
                  placeholder="123456"
                  value={authenticatorCode}
                  onChange={(event) => setAuthenticatorCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>
              {error ? <p className="auth-error">{error}</p> : null}
              <button disabled={isLoading || authenticatorCode.length !== 6} type="submit">
                {isLoading ? "Verifying..." : "Verify"}
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}

function CommonTable({
  columns,
  rows,
  emptyText,
  isLoading,
  onRowClick,
  pagination,
}: {
  columns: ReactNode[];
  rows: Array<Array<ReactNode>>;
  emptyText: string;
  isLoading?: boolean;
  onRowClick?: (rowIndex: number) => void;
  pagination?: {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
  };
}) {
  return (
    <article className="panel common-table">
      <table>
        <thead>
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={columnIndex}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="table-empty" colSpan={columns.length}>
                <span className="table-loader" />
              </td>
            </tr>
          ) : rows.length ? (
            rows.map((row, rowIndex) => (
              <tr className={onRowClick ? "clickable-row" : ""} key={rowIndex} onClick={onRowClick ? () => onRowClick(rowIndex) : undefined}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="table-empty" colSpan={columns.length}>
                <img src="/no-records.svg" alt="No records found" />
                <strong>{emptyText}</strong>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pagination ? (
        <div className="table-pagination">
          <span>
            {pagination.page} / {pagination.totalPages}
          </span>
          <button disabled={pagination.page <= 1} type="button" onClick={pagination.onPrevious}>
            Prev
          </button>
          <button disabled={pagination.page >= pagination.totalPages} type="button" onClick={pagination.onNext}>
            Next
          </button>
        </div>
      ) : null}
    </article>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-IN");
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLoanTypeLabel(value: string) {
  return loanTypeOptions.find((option) => option.value === value)?.label || formatLabel(value);
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
