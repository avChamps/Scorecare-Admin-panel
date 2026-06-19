"use client";

import { ClipboardEvent, FormEvent, Fragment, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API_BASE_URL } from "./api/api";

const menuItems = ["Dashboard", "Plans & Benefits", "Users", "Subscriptions", "Loans", "Chat", "Feedback"];
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
  Chat: (
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
  Feedback: (
    <svg viewBox="0 0 24 24">
      <path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.8z" />
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

type AppView = "Dashboard" | "General" | "Plans & Benefits" | "Users" | "Subscriptions" | "Loans" | "Chat" | "FAQs" | "Feedback";

const viewRoutes: Record<AppView, string> = {
  Dashboard: "/dashboard",
  General: "/general",
  "Plans & Benefits": "/plans-benefits",
  Users: "/users",
  Subscriptions: "/subscriptions",
  Loans: "/loans",
  Chat: "/chat",
  FAQs: "/faqs",
  Feedback: "/feedback",
};

const routeViews: Record<string, AppView> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/general": "General",
  "/faqs": "FAQs",
  "/plans-benefits": "Plans & Benefits",
  "/feedback": "Feedback",
  "/users": "Users",
  "/subscriptions": "Subscriptions",
  "/loans": "Loans",
  "/chat": "Chat",
};

type UserRow = {
  id: string;
  publicId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
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

type GeneralSettings = {
  website: string;
  email: string;
  mobileNumber: string;
  whatsappNumber: string;
  selectedLanguage: string;
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
  const [isGeneralMenuOpen, setIsGeneralMenuOpen] = useState(true);
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
  const [plansBenefitsTab, setPlansBenefitsTab] = useState<"plans" | "benefits">("plans");
  const [isAdminPlanModalOpen, setIsAdminPlanModalOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  const [feedbackSearch, setFeedbackSearch] = useState("");
  const [feedbackFromDate, setFeedbackFromDate] = useState("");
  const [feedbackToDate, setFeedbackToDate] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  function loadAdminViewData(view: AppView) {
    if (view === "General" && !hasLoadedGeneral) {
      loadGeneralSettings();
    }

    if (view === "FAQs" && !hasLoadedFaqs) {
      loadFaqs();
    }

    if (view === "Plans & Benefits" && !hasLoadedAdminPlans) {
      loadAdminPlans();
    }

    if (view === "Feedback" && !feedbackData) {
      loadFeedback();
    }

    if ((view === "Users" || view === "Subscriptions") && !usersData) {
      loadUsers();
    }

    if (view === "Loans" && !loansData) {
      loadLoans();
    }

    if (view === "Chat" && !chatsData) {
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
        limit: "20",
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
        limit: "20",
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
    if (activeView === "Plans & Benefits" && adminUser?.token && !hasLoadedAdminPlans && !isAdminPlansLoading) {
      loadAdminPlans();
    }
  }, [activeView, adminUser?.token, hasLoadedAdminPlans, isAdminPlansLoading]);

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
      isFaqsLoading ||
      isAdminPlansLoading ||
      isFeedbackLoading ||
      isChatsLoading;
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
      <button className="table-action" type="button" onClick={() => loadSubscriptionPlans(user)}>
        Update Plan
      </button>,
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
                  <div className={`sidebar-group ${activeView === "General" || activeView === "FAQs" ? "active" : ""}`}>
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
                        <button className={activeView === "FAQs" ? "active" : ""} type="button" onClick={() => openAdminView("FAQs")}>
                          <span className="menu-icon">{menuIcons.FAQ}</span>
                          FAQ
                        </button>
                      </div>
                    ) : null}
                  </div>
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
                    <button disabled={isGeneralLoading} type="button" onClick={loadGeneralSettings}>
                      Refresh
                    </button>
                    <button disabled={isGeneralLoading || isGeneralSaving} type="submit">
                      {isGeneralSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
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
                    <button disabled={isFaqsLoading} type="button" onClick={loadFaqs}>
                      Refresh
                    </button>
                    <button type="button" onClick={addFaqCategory}>
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
                  <span>{adminPlans.length} plans</span>
                </section>

                <div className="section-tabs">
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
                </div>

                {adminPlansError ? <p className="dashboard-error">{adminPlansError}</p> : null}

                {!isAdminPlansLoading && !adminPlans.length ? (
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
                        Add Plan
                      </button>
                      <button disabled={isAdminPlansLoading} type="button" onClick={loadAdminPlans}>
                        Refresh
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
                  <input
                    type="date"
                    value={feedbackFromDate}
                    onChange={(event) => setFeedbackFromDate(event.target.value)}
                  />
                  <input
                    type="date"
                    value={feedbackToDate}
                    onChange={(event) => setFeedbackToDate(event.target.value)}
                  />
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
                  <input
                    type="date"
                    value={usersFromDate}
                    onChange={(event) => setUsersFromDate(event.target.value)}
                  />
                  <input
                    type="date"
                    value={usersToDate}
                    onChange={(event) => setUsersToDate(event.target.value)}
                  />
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
                  <input
                    type="date"
                    value={usersFromDate}
                    onChange={(event) => setUsersFromDate(event.target.value)}
                  />
                  <input
                    type="date"
                    value={usersToDate}
                    onChange={(event) => setUsersToDate(event.target.value)}
                  />
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
            ) : activeView === "Chat" ? (
              <>
                <section className="welcome-panel">
                  <div>
                    <h2>Chat</h2>
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
                    {isAdminPlanSaving ? "Saving..." : editingAdminPlanId ? "Update Plan" : "Add Plan"}
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
  columns: string[];
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
            {columns.map((column) => (
              <th key={column}>{column}</th>
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
