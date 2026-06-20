"use client";

import { ClipboardEvent, FormEvent, Fragment, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE_URL } from "./api/api";

const menuItems = ["Dashboard", /* "Loans", */ "Chats", "Feedback", "Contact Us"];
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
const emptyAdminPlanForm: AdminPlanForm = {
  publicId: "",
  planName: "",
  amount: "",
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

type DashboardCounts = {
  totalUsers: number;
  newUsers: number;
  subscriptions: number;
  amount: number;
  upcomingOverdues: number;
  totalMessages: number;
  totalFeedback?: number;
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
};

type AppView = "Dashboard" | "General" | "Homepage Themes" | "Legal Center" | "Notifications" | "Plans & Benefits" | "Users" | "Subscriptions" | "Loans" | "Chats" | "FAQs" | "Feedback" | "Contact Us";

const viewRoutes: Record<AppView, string> = {
  Dashboard: "/dashboard",
  General: "/general",
  "Homepage Themes": "/homepage-themes",
  "Legal Center": "/legal-center",
  Notifications: "/notifications",
  "Plans & Benefits": "/plans-benefits",
  Users: "/users",
  Subscriptions: "/subscriptions",
  Loans: "/loans",
  Chats: "/chat",
  FAQs: "/faqs",
  Feedback: "/feedback",
  "Contact Us": "/contact-us",
};

const routeViews: Record<string, AppView> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/general": "General",
  "/homepage-themes": "Homepage Themes",
  "/legal-center": "Legal Center",
  "/notifications": "Notifications",
  "/faqs": "FAQs",
  "/plans-benefits": "Plans & Benefits",
  "/feedback": "Feedback",
  "/contact-us": "Contact Us",
  "/users": "Users",
  "/subscriptions": "Subscriptions",
  "/loans": "Loans",
  "/chat": "Chats",
};

type ActionIconType = "add" | "edit" | "delete";

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

function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
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
    <div className="date-filter" ref={pickerRef}>
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
  fullName: string;
  mobileNumber: string;
  email: string;
  panNumber?: string | null;
  dob?: string | null;
  dateOfBirth?: string | null;
  status: string;
  accessType: string;
  subscriptionStatus: string;
  subscriptionStartedAt: string | null;
  subscriptionDueAt: string | null;
  planUpdatedByUserName?: string | null;
  creditScore: string | null;
  totalMessages: number;
  loans: {
    total: number;
    latestStatus: string | null;
  };
  createdAt: string;
};

type SubscriptionPlan = {
  id: string;
  publicId: string;
  planName: string;
  billingCycle?: string | null;
  amount: number;
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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
  id?: number;
  title?: string;
  message?: string;
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
  const [step, setStep] = useState<"mobile" | "otp" | "admin">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [resendSeconds, setResendSeconds] = useState(45);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCounts | null>(null);
  const [error, setError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionChecking, setIsSessionChecking] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGeneralMenuOpen, setIsGeneralMenuOpen] = useState(false);
  const [isUserManagementMenuOpen, setIsUserManagementMenuOpen] = useState(false);
  const [isSubscriptionsMenuOpen, setIsSubscriptionsMenuOpen] = useState(false);
  const [isPlansBenefitsMenuOpen, setIsPlansBenefitsMenuOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("Dashboard");
  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [usersSearch, setUsersSearch] = useState("");
  const [usersFromDate, setUsersFromDate] = useState("");
  const [usersToDate, setUsersToDate] = useState("");
  const [usersError, setUsersError] = useState("");
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    website: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    selectedLanguage: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [isGeneralSaving, setIsGeneralSaving] = useState(false);
  const [hasLoadedGeneral, setHasLoadedGeneral] = useState(false);
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
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationModalScope, setNotificationModalScope] = useState<"all" | "users">("all");
  const [notificationsData, setNotificationsData] = useState<AdminNotificationsResponse | null>(null);
  const [notificationsError, setNotificationsError] = useState("");
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
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
    if (view === "General" && !hasLoadedGeneral) {
      loadGeneralSettings();
    }

    if (view === "FAQs" && !hasLoadedFaqs) {
      loadFaqs();
    }

    if (view === "Homepage Themes" && !hasLoadedHomepageThemes) {
      loadHomepageThemes();
    }

    if (view === "Legal Center" && !hasLoadedLegalContent) {
      loadLegalContent();
    }

    if (view === "Notifications" && !notificationUsersData) {
      loadNotificationUsers();
      loadAdminNotifications();
    }

    if (view === "Plans & Benefits" && !hasLoadedAdminPlans) {
      loadAdminPlans();
    }

    if (view === "Feedback" && !feedbackData) {
      loadFeedback();
    }

    if (view === "Contact Us" && !contactRequestsData) {
      loadContactRequests();
    }

    if ((view === "Users" || view === "Subscriptions") && !usersData) {
      loadUsers();
    }

    if (view === "Loans" && !loansData) {
      loadLoans();
    }

    if (view === "Chats" && !chatsData) {
      loadChats();
    }
  }

  function openAdminView(view: AppView) {
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

  async function loadDashboardCounts(token: string) {
    try {
      setDashboardError("");
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-counts`, {
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
    }
  }

  async function loadUsers(page = 1, search = usersSearch) {
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

      setGeneralSettings({
        website: result.data?.website || "",
        email: result.data?.email || "",
        mobileNumber: result.data?.mobileNumber || "",
        whatsappNumber: result.data?.whatsappNumber || "",
        selectedLanguage: result.data?.selectedLanguage || "",
      });
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

  async function loadAdminNotifications(page = 1) {
    if (!adminUser?.token) {
      return;
    }

    try {
      setNotificationsError("");
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        search: "",
        from: "",
        totime: "",
      });
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

      setNotificationsData(result.data);
    } catch (error) {
      setNotificationsError(error instanceof Error ? error.message : "Unable to load notifications");
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
      await loadAdminNotifications();
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
        body: JSON.stringify(generalSettings),
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
      setGeneralSettings({
        website: result.data?.website || generalSettings.website,
        email: result.data?.email || generalSettings.email,
        mobileNumber: result.data?.mobileNumber || generalSettings.mobileNumber,
        whatsappNumber: result.data?.whatsappNumber || generalSettings.whatsappNumber,
        selectedLanguage: result.data?.selectedLanguage || generalSettings.selectedLanguage,
      });
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Unable to update general settings");
    } finally {
      setIsGeneralSaving(false);
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

  function getAdminPlanPayload(includePublicId: boolean) {
    return {
      ...(includePublicId ? { publicId: adminPlanForm.publicId } : {}),
      planName: adminPlanForm.planName,
      amount: Number(adminPlanForm.amount),
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
    loadUsers(1, "");
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

      setIsGeneralMenuOpen(["General", "Homepage Themes", "Legal Center", "Notifications", "FAQs"].includes(routeView));
      setIsUserManagementMenuOpen(routeView === "Users");
      setIsSubscriptionsMenuOpen(routeView === "Subscriptions");
      setIsPlansBenefitsMenuOpen(routeView === "Plans & Benefits");

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
    if (activeView === "FAQs" && adminUser?.token && !hasLoadedFaqs && !isFaqsLoading) {
      loadFaqs();
    }
  }, [activeView, adminUser?.token, hasLoadedFaqs, isFaqsLoading]);

  useEffect(() => {
    if (activeView === "Notifications" && adminUser?.token && !notificationUsersData && !isNotificationsLoading) {
      loadNotificationUsers();
      loadAdminNotifications();
    }
  }, [activeView, adminUser?.token, notificationUsersData, isNotificationsLoading]);

  useEffect(() => {
    if (activeView === "Plans & Benefits" && adminUser?.token && !hasLoadedAdminPlans && !isAdminPlansLoading) {
      loadAdminPlans();
    }
  }, [activeView, adminUser?.token, hasLoadedAdminPlans, isAdminPlansLoading]);

  useEffect(() => {
    if (activeView === "Plans & Benefits" && plansBenefitsTab === "repair" && !hasLoadedCibilRepair && !isCibilRepairLoading) {
      loadCibilRepairContent();
    }
  }, [activeView, plansBenefitsTab, hasLoadedCibilRepair, isCibilRepairLoading]);

  useEffect(() => {
    if (!shouldScrollToNewCibilRepairTimeline.current) {
      return;
    }

    newCibilRepairTimelineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    shouldScrollToNewCibilRepairTimeline.current = false;
  }, [cibilRepairContent.timelines.length]);

  useEffect(() => {
    if ((activeView === "Users" || activeView === "Subscriptions") && adminUser?.token && !usersData && !isUsersLoading) {
      loadUsers();
    }
  }, [activeView, adminUser?.token, usersData, isUsersLoading]);

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
    const savedAdmin = sessionStorage.getItem("scorecare_admin");

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
          setIsSessionChecking(false);
          return;
        }

        setAdminUser(admin);
        const isValidSession = await loadDashboardCounts(admin.token);

        if (isValidSession) {
          const routeView = routeViews[pathname] || "Dashboard";
          setActiveView(routeView);
          setStep("admin");
          router.replace(viewRoutes[routeView]);
          loadAdminViewData(routeView);
        }
      } catch {
        sessionStorage.removeItem("scorecare_admin");
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

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const otpMobile = mobile || sessionStorage.getItem("scorecare_otp_mobile") || "";
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: otpMobile, otp }),
      });
      const result = await response.json();

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Invalid OTP");
      }

      if (!result.data?.user?.isAdmin) {
        setError("You do not have admin access");
        return;
      }

      const user = result.data.user;
      const sessionUser = {
        token: result.data.token,
        tokenType: result.data.tokenType,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      };

      sessionStorage.setItem("scorecare_admin", JSON.stringify(sessionUser));
      sessionStorage.removeItem("scorecare_otp_mobile");
      setAdminUser(sessionUser);
      const isDashboardReady = await loadDashboardCounts(result.data.token);

      if (isDashboardReady) {
        setStep("admin");
        router.push("/dashboard");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid OTP");
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

  function logoutAdmin() {
    sessionStorage.removeItem("scorecare_admin");
    setAdminUser(null);
    setIsProfileOpen(false);
    setStep("mobile");
    router.push("/login");
  }

  if (step === "admin") {
    const isAdminApiLoading =
      isUsersLoading ||
      isPlansLoading ||
      isLoansLoading ||
      isGeneralLoading ||
      isNotificationsLoading ||
      isNotificationSending ||
      isFaqsLoading ||
      isAdminPlansLoading ||
      isFeedbackLoading ||
      isHomepageThemesLoading ||
      isLegalContentLoading ||
      isChatsLoading ||
      isContactLoading;
    const statCards = [
      { label: "Total Users", value: dashboardCounts?.totalUsers ?? 0, meta: `${dashboardCounts?.newUsers ?? 0} new`, tone: "blue" },
      { label: "Subscriptions", value: dashboardCounts?.subscriptions ?? 0, meta: `₹${dashboardCounts?.amount ?? 0}`, tone: "green" },
      { label: "Messages", value: dashboardCounts?.totalMessages ?? 0, meta: "Total chats", tone: "yellow" },
      { label: "Loan Applied", value: dashboardCounts?.loans.applied ?? 0, meta: `${dashboardCounts?.loans.pending ?? 0} pending`, tone: "red" },
    ];
    const monthlyRecords = dashboardCounts?.graphs.monthlyRecords ?? [];
    const maxMonthlyValue = Math.max(1, ...monthlyRecords.flatMap((record) => [record.users, record.messages, record.loans]));
    const accessTypeGraph = dashboardCounts?.graphs.usersByAccessType ?? [];
    const feedbackRatingGraph = dashboardCounts?.graphs.feedbackByRating ?? [];
    const donutStops = accessTypeGraph.reduce(
      (stops, item, index) => {
        const colors = ["#5b8def", "#0b8f4e", "#f4ce45", "#4cc9c0"];
        const start = stops.total;
        const end = start + item.percentage;

        return {
          total: end,
          gradient: `${stops.gradient}${stops.gradient ? ", " : ""}${colors[index % colors.length]} ${start}% ${end}%`,
        };
      },
      { total: 0, gradient: "" }
    );
    const donutGradient = `${donutStops.gradient}${donutStops.total < 100 ? `${donutStops.gradient ? ", " : ""}#e5e7eb ${donutStops.total}% 100%` : ""}`;
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
    const subscriptionColumns = ["Name", "Mobile", "Email", "Plan", "Started At", "Due At", "Updated By", "Status", "Action"];
    const subscriptionRows = usersData?.users.map((user) => [
      user.fullName,
      user.mobileNumber,
      user.email,
      user.subscriptionStatus,
      formatDate(user.subscriptionStartedAt),
      formatDate(user.subscriptionDueAt),
      user.planUpdatedByUserName || "-",
      user.status,
      <div className="subscription-actions">
        <button className="table-action primary" type="button" onClick={() => loadSubscriptionPlans(user)}>
          <ActionIcon type="edit" />
          Update
        </button>
      </div>,
    ]) ?? [];
    const notificationPageUserIds = notificationUsersData?.users.map((user) => user.publicId) || [];
    const areAllNotificationUsersSelected =
      notificationPageUserIds.length > 0 && notificationPageUserIds.every((id) => selectedNotificationUserIds.includes(id));
    const notificationUserColumns = [
      <input checked={areAllNotificationUsersSelected} type="checkbox" onChange={toggleAllNotificationUsers} />,
      "Name",
      "PAN",
      "DOB",
      "Mobile",
      "CIBIL Score",
      "Subscription Type",
      "Due Date",
      "Action",
    ];
    const notificationUserRows = notificationUsersData?.users.map((user) => [
      <input checked={selectedNotificationUserIds.includes(user.publicId)} type="checkbox" onChange={() => toggleNotificationUser(user.publicId)} />,
      user.fullName,
      user.panNumber || "-",
      formatDate(user.dob || user.dateOfBirth || null),
      user.mobileNumber,
      user.creditScore || "-",
      user.subscriptionStatus || "-",
      formatDate(user.subscriptionDueAt),
      <button className="table-action" type="button" onClick={() => openNotificationModal("users", user.publicId)}>
        Send Notification
      </button>,
    ]) ?? [];
    const notificationColumns = ["Title", "Message", "User", "Screen", "Created At"];
    const notificationRows = notificationsData?.notifications.map((notification) => [
      notification.title || "-",
      notification.message || "-",
      notification.scope || notification.user?.fullName || "-",
      notification.screen || notification.data?.screen || "-",
      formatDate(notification.createdAt || null),
    ]) ?? [];
    const loanColumns = ["Name", "Mobile", "PAN", "Email", "Amount", "Loan Type", "Employment", "Income", "Experience", "Status", "Remarks", "Updated By", "Created At", "Action"];
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
      <div className="table-actions">
        <button className="table-action" disabled={downloadingLoanId === loan.id} type="button" onClick={() => downloadLoanDetails(loan)}>
          {downloadingLoanId === loan.id ? "Downloading..." : "Download"}
        </button>
        <button className="table-action" type="button" onClick={() => openLoanUpdate(loan)}>
          <ActionIcon type="edit" />
          Update
        </button>
      </div>,
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
        {isAdminApiLoading ? (
          <div className="api-loader-overlay">
            <span className="api-loader" />
          </div>
        ) : null}
        <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-brand">
            <img src="/scorecare-logo.PNG" alt="ScoreCare" />
            <button className="sidebar-close" type="button" onClick={() => setIsSidebarCollapsed(true)}>
              ×
            </button>
          </div>
          <nav>
            {menuItems.map((item) => (
              <Fragment key={item}>
                <button
                  className={activeView === item ? "active" : ""}
                  type="button"
                  onClick={() => openAdminView(item as AppView)}
                >
                  <span className="menu-icon">{menuIcons[item]}</span>
                  {item}
                </button>
                {item === "Dashboard" ? (
                  <>
                    <div className={`sidebar-group ${activeView === "General" || activeView === "Homepage Themes" || activeView === "Legal Center" || activeView === "Notifications" || activeView === "FAQs" ? "active" : ""}`}>
                      <button className="sidebar-group-toggle" type="button" onClick={() => setIsGeneralMenuOpen((current) => !current)}>
                        <span className="menu-icon">{menuIcons.General}</span>
                        General
                        <span className="sidebar-chevron">{isGeneralMenuOpen ? "⌄" : "›"}</span>
                      </button>
                      {isGeneralMenuOpen ? (
                        <div className="sidebar-submenu">
                          <button className={activeView === "General" ? "active" : ""} type="button" onClick={() => openAdminView("General")}>
                            <span className="menu-icon">{menuIcons["Site Settings"]}</span>
                            Site Settings
                          </button>
                          <button className={activeView === "Homepage Themes" ? "active" : ""} type="button" onClick={() => openAdminView("Homepage Themes")}>
                            <span className="menu-icon">{menuIcons["Homepage Themes"]}</span>
                            Homepage Themes
                          </button>
                          <button className={activeView === "Legal Center" ? "active" : ""} type="button" onClick={() => openAdminView("Legal Center")}>
                            <span className="menu-icon">{menuIcons["Legal Center"]}</span>
                            Legal Center
                          </button>
                          <button className={activeView === "Notifications" ? "active" : ""} type="button" onClick={() => openAdminView("Notifications")}>
                            <span className="menu-icon">{menuIcons.Notifications}</span>
                            Notifications
                          </button>
                          <button className={activeView === "FAQs" ? "active" : ""} type="button" onClick={() => openAdminView("FAQs")}>
                            <span className="menu-icon">{menuIcons.FAQ}</span>
                            FAQ
                          </button>
                        </div>
                      ) : null}
                    </div>
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
                    <div className={`sidebar-group ${activeView === "Subscriptions" ? "active" : ""}`}>
                      <button className="sidebar-group-toggle" type="button" onClick={() => setIsSubscriptionsMenuOpen((current) => !current)}>
                        <span className="menu-icon">{menuIcons.Subscriptions}</span>
                        Subscriptions
                        <span className="sidebar-chevron">{isSubscriptionsMenuOpen ? "⌄" : "›"}</span>
                      </button>
                      {isSubscriptionsMenuOpen ? (
                        <div className="sidebar-submenu">
                          <button className={activeView === "Subscriptions" ? "active" : ""} type="button" onClick={() => openAdminView("Subscriptions")}>
                            <span className="menu-icon">{menuIcons.Subscriptions}</span>
                            Subscriptions
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className={`sidebar-group ${activeView === "Plans & Benefits" ? "active" : ""}`}>
                      <button className="sidebar-group-toggle" type="button" onClick={() => setIsPlansBenefitsMenuOpen((current) => !current)}>
                        <span className="menu-icon">{menuIcons["Plans & Benefits"]}</span>
                        Plans & Benefits
                        <span className="sidebar-chevron">{isPlansBenefitsMenuOpen ? "⌄" : "›"}</span>
                      </button>
                      {isPlansBenefitsMenuOpen ? (
                        <div className="sidebar-submenu">
                          <button disabled type="button">
                            <span className="menu-icon">{menuIcons["Plans & Benefits"]}</span>
                            Basic plan
                          </button>
                          <button className={activeView === "Plans & Benefits" && plansBenefitsTab === "repair" ? "active" : ""} type="button" onClick={() => openPlansBenefitsTab("repair")}>
                            <span className="menu-icon">{menuIcons["Plans & Benefits"]}</span>
                            Repair service
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </Fragment>
            ))}
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
              <span>🔔</span>
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
                  <label>
                    Website
                    <input
                      required
                      value={generalSettings.website}
                      onChange={(event) => setGeneralSettings((settings) => ({ ...settings, website: event.target.value }))}
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      value={generalSettings.email}
                      onChange={(event) => setGeneralSettings((settings) => ({ ...settings, email: event.target.value }))}
                    />
                  </label>
                  <label>
                    Mobile Number
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={generalSettings.mobileNumber}
                      onChange={(event) => setGeneralSettings((settings) => ({ ...settings, mobileNumber: event.target.value.replace(/\D/g, "") }))}
                    />
                  </label>
                  <label>
                    WhatsApp Number
                    <input
                      required
                      inputMode="numeric"
                      maxLength={10}
                      value={generalSettings.whatsappNumber}
                      onChange={(event) => setGeneralSettings((settings) => ({ ...settings, whatsappNumber: event.target.value.replace(/\D/g, "") }))}
                    />
                  </label>
                  {/* <label>
                    Selected Language
                    <input
                      required
                      value={generalSettings.selectedLanguage}
                      onChange={(event) => setGeneralSettings((settings) => ({ ...settings, selectedLanguage: event.target.value }))}
                    />
                  </label> */}
                  <div className="general-actions">
                    <button disabled={isGeneralLoading || isGeneralSaving} type="submit">
                      {isGeneralSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
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
                  <div className="homepage-themes-actions">
                    <button type="button" onClick={() => openHomepageThemeModal()}>
                      <ActionIcon type="add" />
                      Add
                    </button>
                  </div>

                  {isHomepageThemesLoading ? <p className="dashboard-error">Loading homepage themes...</p> : null}

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
                                  <button type="button" onClick={() => openHomepageThemeModal(theme)}>
                                    <ActionIcon type="edit" />
                                    Update
                                  </button>
                                  <button type="button" onClick={() => openDeleteHomepageThemeModal(theme)}>
                                    <ActionIcon type="delete" />
                                    Delete
                                  </button>
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
                {isLegalContentLoading ? <p className="dashboard-error">Loading legal content...</p> : null}

                <form className="legal-editor-panel panel" onSubmit={updateLegalContent}>
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
                  <div className="general-actions">
                    <button disabled={isLegalContentLoading || isLegalContentSaving} type="submit">
                      {isLegalContentSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
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
                    onClick={() => setNotificationsTab("notifications")}
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
                    <div className="plans-toolbar">
                      <button type="button" onClick={() => openNotificationModal("all")}>
                        Send to all users
                      </button>
                    </div>

                    <CommonTable
                      columns={notificationColumns}
                      emptyText="No notifications found"
                      pagination={
                        notificationsData?.pagination
                          ? {
                            page: notificationsData.pagination.page,
                            totalPages: notificationsData.pagination.totalPages,
                            onPrevious: () => loadAdminNotifications(notificationsData.pagination.page - 1),
                            onNext: () => loadAdminNotifications(notificationsData.pagination.page + 1),
                          }
                          : undefined
                      }
                      rows={notificationRows}
                    />
                  </>
                ) : (
                  <>
                    <section className="table-toolbar feedback-toolbar">
                      <input
                        placeholder="Search users..."
                        value={notificationUserSearch}
                        onChange={(event) => setNotificationUserSearch(event.target.value)}
                      />
                      <button type="button" onClick={() => loadNotificationUsers(1)}>
                        Search
                      </button>
                      <button type="button" onClick={() => openNotificationModal("users")}>
                        Send Selected
                      </button>
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
                    <button type="button" onClick={addFaqCategory}>
                      <ActionIcon type="add" />
                      Add Category
                    </button>
                    <button disabled={isFaqsLoading || isFaqsSaving} type="submit">
                      {isFaqsSaving ? "Saving..." : "Save FAQs"}
                    </button>
                  </div>

                  {isFaqsLoading ? <p className="dashboard-error">Loading FAQs...</p> : null}

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
                        <button type="button" onClick={() => removeFaqCategory(categoryIndex)}>
                          <ActionIcon type="delete" />
                          Remove Category
                        </button>
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
                            <button type="button" onClick={() => removeFaqQuestion(categoryIndex, questionIndex)}>
                              <ActionIcon type="delete" />
                              Remove
                            </button>
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

                      <button className="faq-add-question" type="button" onClick={() => addFaqQuestion(categoryIndex)}>
                        <ActionIcon type="add" />
                        Add FAQ
                      </button>
                    </section>
                  ))}
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
                    <div className="plans-toolbar">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAdminPlanId(null);
                          setAdminPlanForm(emptyAdminPlanForm);
                          setIsAdminPlanModalOpen(true);
                        }}
                      >
                        <ActionIcon type="add" />
                        Add Plan
                      </button>
                    </div>

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
                              {plan.billingCycle ? <span>{formatLabel(plan.billingCycle)}</span> : null}
                              {plan.offerTag ? <span>{plan.offerTag}</span> : null}
                              <span>Order {plan.displayOrder ?? "-"}</span>
                            </div>
                            <p>{plan.recommendedFor || plan.description || "-"}</p>
                          </div>
                          <em className={plan.isActive === false ? "inactive" : ""}>{plan.isActive === false ? "Inactive" : "Active"}</em>
                          <div className="table-actions">
                            <button className="table-action" type="button" onClick={() => editAdminPlan(plan)}>
                              <ActionIcon type="edit" />
                              Edit
                            </button>
                            <button className="table-action" disabled={plan.isActive === false || isAdminPlanSaving} type="button" onClick={() => inactiveAdminPlan(plan)}>
                              Inactive
                            </button>
                          </div>
                        </article>
                      ))}
                    </section>
                  </>
                ) : plansBenefitsTab === "repair" ? (
                  <form className="admin-plan-form panel" onSubmit={saveCibilRepairContent}>
                    <div className="admin-plan-form-header">
                      <h3>{cibilRepairTab === "plans" ? "Repair Plans" : "Timelines"}</h3>
                      <button type="button" onClick={cibilRepairTab === "plans" ? addCibilRepairPlan : addCibilRepairTimeline}>
                        <ActionIcon type="add" />
                        {cibilRepairTab === "plans" ? "Add Plan" : "Add Timeline"}
                      </button>
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
                                <button className="table-action danger-action" disabled={isCibilRepairSaving} type="button" onClick={() => setDeletingCibilRepairTimelineIndex(index)}>
                                  <ActionIcon type="delete" />
                                  Remove
                                </button>
                              </div>
                            </section>
                          ))
                        )}
                      </>
                    )}

                    <footer className="modal-actions">
                      <button disabled={isCibilRepairSaving || isCibilRepairLoading} type="submit">
                        {isCibilRepairSaving ? "Saving..." : cibilRepairTab === "timelines" ? "Save Timelines" : "Save Repair Content"}
                      </button>
                    </footer>
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
            ) : activeView === "Users" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Users</h2>
                    <p>Manage ScoreCare users</p>
                  </div>
                  <span>{usersData?.pagination.total ?? 0} users</span>
                </section>

                <div className="mobile-toolbar-actions">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                  <button disabled={isExporting} type="button" onClick={exportUsers}>
                    {isExporting ? "Exporting..." : "Export"}
                  </button>
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
                  <button type="button" onClick={() => loadUsers(1)}>
                    Search
                  </button>
                  <button disabled={isExporting} type="button" onClick={exportUsers}>
                    {isExporting ? "Exporting..." : "Export"}
                  </button>
                </section>

                {usersError ? <p className="dashboard-error">{usersError}</p> : null}

                <CommonTable
                  columns={usersColumns}
                  emptyText={isUsersLoading ? "Loading users..." : "No users found"}
                  isLoading={isUsersLoading}
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
            ) : activeView === "Subscriptions" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Subscriptions</h2>
                    <p>Manage user subscription plans</p>
                  </div>
                  <span>{usersData?.pagination.total ?? 0} records</span>
                </section>

                <div className="mobile-toolbar-actions">
                  <button type="button" onClick={() => setIsMobileFiltersOpen((current) => !current)}>
                    Filter
                  </button>
                  <button disabled={isExporting} type="button" onClick={exportUsers}>
                    {isExporting ? "Exporting..." : "Export"}
                  </button>
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
                  <button type="button" onClick={() => loadUsers(1)}>
                    Search
                  </button>
                  <button disabled={isExporting} type="button" onClick={exportUsers}>
                    {isExporting ? "Exporting..." : "Export"}
                  </button>
                </section>

                {usersError ? <p className="dashboard-error">{usersError}</p> : null}

                <CommonTable
                  columns={subscriptionColumns}
                  emptyText={isUsersLoading ? "Loading subscriptions..." : "No subscriptions found"}
                  isLoading={isUsersLoading}
                  rows={subscriptionRows}
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
                  <button disabled={isLoansExporting} type="button" onClick={exportLoans}>
                    {isLoansExporting ? "Exporting..." : "Export"}
                  </button>
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
                  <button disabled={isLoansExporting} type="button" onClick={exportLoans}>
                    {isLoansExporting ? "Exporting..." : "Export"}
                  </button>
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
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Welcome back, {adminUser?.fullName || "Admin"}</h2>
                    <p>Here is what is happening with ScoreCare today.</p>
                  </div>
                  <span>Jun 10, 2026 14:45:59</span>
                </section>

                <section className="stats-grid">
                  {statCards.map((card) => (
                    <article className="stat-card" key={card.label}>
                      <span className={`stat-icon ${card.tone}`}>▣</span>
                      <div>
                        <strong>{card.value}</strong>
                        <p>{card.label}</p>
                      </div>
                      <em>{card.meta}</em>
                    </article>
                  ))}
                </section>
                {dashboardError ? <p className="dashboard-error">{dashboardError}</p> : null}

                <section className="dashboard-grid">
                  <article className="panel revenue-panel">
                    <div className="panel-header">
                      <h3>Monthly Records</h3>
                      <div className="tabs">
                        <button type="button">Users</button>
                        <button type="button">Messages</button>
                        <button type="button">Loans</button>
                      </div>
                    </div>
                    <div className="chart">
                      {monthlyRecords.map((record) => (
                        <div className="chart-month" key={record.label}>
                          <div>
                            <span className="revenue-bar" style={{ height: `${(record.users / maxMonthlyValue) * 100}%` }} />
                            <span className="expense-bar" style={{ height: `${(record.messages / maxMonthlyValue) * 100}%` }} />
                            <span className="loan-bar" style={{ height: `${(record.loans / maxMonthlyValue) * 100}%` }} />
                          </div>
                          <small>{record.label.slice(5)}</small>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="panel traffic-panel">
                    <h3>Users By Access Type</h3>
                    <div className="donut" style={{ background: `conic-gradient(${donutGradient || "#e5e7eb 0 100%"})` }}>
                      <span>Total<br /><strong>{dashboardCounts?.totalUsers ?? 0}</strong></span>
                    </div>
                    <ul>
                      {accessTypeGraph.map((item, index) => (
                        <li key={item.label}>
                          <span className={`dot ${["blue", "green", "yellow", "teal"][index]}`} />
                          {item.label}
                          <strong>{item.percentage}%</strong>
                        </li>
                      ))}
                    </ul>
                  </article>
                </section>

                <section className="dashboard-grid bottom-grid">
                  <article className="panel orders-panel">
                    <div className="panel-header">
                      <h3>Recent Subscriptions</h3>
                      <button type="button">View All</button>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardCounts?.graphs.subscriptionsByStatus.map((item) => (
                          <tr key={item.label}>
                            <td>{item.label}</td>
                            <td>{item.count}</td>
                            <td>Subscription</td>
                            <td>₹{dashboardCounts.amount}</td>
                            <td><span>{item.percentage}%</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </article>

                  <article className="panel activity-panel">
                    <h3>Loan Status</h3>
                    <p>Applied loans: {dashboardCounts?.loans.applied ?? 0}</p>
                    <p>Approved loans: {dashboardCounts?.loans.approved ?? 0}</p>
                    <p>Rejected loans: {dashboardCounts?.loans.rejected ?? 0}</p>
                    <p>Pending loans: {dashboardCounts?.loans.pending ?? 0}</p>
                  </article>
                </section>

                <section className="dashboard-grid feedback-dashboard-grid">
                  <article className="panel feedback-analytics-panel">
                    <div className="panel-header">
                      <h3>Feedback Analytics</h3>
                      <span>{dashboardCounts?.totalFeedback ?? 0} total</span>
                    </div>
                    <div className="feedback-rating-list">
                      {feedbackRatingGraph.length ? (
                        feedbackRatingGraph.map((item) => (
                          <div className="feedback-rating-row" key={item.label}>
                            <span>{item.label} ★</span>
                            <div>
                              <i style={{ width: `${item.percentage}%` }} />
                            </div>
                            <strong>{item.count}</strong>
                            <em>{item.percentage}%</em>
                          </div>
                        ))
                      ) : (
                        <div className="empty-state compact">
                          <img src="/no-records.svg" alt="No records found" />
                          <strong>No feedback analytics found</strong>
                        </div>
                      )}
                    </div>
                  </article>
                </section>
              </>
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
                  <button disabled={savingHomepageTheme === homepageThemeForm.imageName} type="submit">
                    {savingHomepageTheme === homepageThemeForm.imageName ? (
                      "Saving..."
                    ) : (
                      <>
                        <ActionIcon type={homepageThemeForm.originalImageName ? "edit" : "add"} />
                        {homepageThemeForm.originalImageName ? "Update" : "Add"}
                      </>
                    )}
                  </button>
                </footer>
              </form>
            </section>
          </div>
        ) : null}
        {deletingHomepageTheme ? (
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
        {deletingCibilRepairTimelineIndex !== null ? (
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
        {isNotificationModalOpen ? (
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
                </footer>
              </form>
            </section>
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
                <button disabled={isUpdatingPlan || !planAmount} type="button" onClick={updateSubscriptionPlan}>
                  {isUpdatingPlan ? "Updating..." : "Submit"}
                </button>
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
                <button disabled={isUpdatingLoan} type="button" onClick={updateLoanStatus}>
                  {isUpdatingLoan ? "Updating..." : "Submit"}
                </button>
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
      <div className="auth-logo">
        <img src="/scorecare-logo.PNG" alt="ScoreCare" />
      </div>
      {step === "mobile" ? (
        <form className="auth-box" onSubmit={submitMobile}>
          <div className="auth-brand">
            <span>↪</span>
          </div>
          <div className="auth-header">
            <h1>Admin Login</h1>
            <p>Enter your registered mobile number</p>
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
      ) : (
        <form className="auth-box" onSubmit={submitOtp}>
          <button className="auth-back" type="button" onClick={goBackToMobile} aria-label="Back to mobile number">
            ‹
          </button>
          <div className="auth-brand">
            <span>↪</span>
          </div>
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
      )}
    </main>
  );
}

function CommonTable({
  columns,
  rows,
  emptyText,
  isLoading,
  pagination,
}: {
  columns: ReactNode[];
  rows: Array<Array<ReactNode>>;
  emptyText: string;
  isLoading?: boolean;
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
          {rows.length ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td className="table-empty" colSpan={columns.length}>
                {isLoading ? (
                  <>
                    <span className="table-loader" />
                    {emptyText}
                  </>
                ) : (
                  <>
                    <img src="/no-records.svg" alt="No records found" />
                    <strong>{emptyText}</strong>
                  </>
                )}
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

function getLoanTypeLabel(value: string) {
  return loanTypeOptions.find((option) => option.value === value)?.label || formatLabel(value);
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toFileName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
