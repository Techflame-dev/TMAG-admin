import { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Shield,
  UserCog,
  HeadphonesIcon,
  LucideLoader2,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { cn } from "../../lib/utils";
import { useSystemSettings, useUpdateSystemSettings, useToggleMaintenanceMode } from "../../api/hooks";
import { useAdminAuthStore } from "../../stores/adminAuthStore";

interface SystemSettingsData {
  maintenanceMode: boolean;
  defaultIndividualCredits: number;
  defaultCorporateCredits: number;
  aiModelVersion: string;
  emailNotifications: boolean;
  maxEmployeesPerCompany: number;
  planGenerationLimit: number;
  globalDisclaimer: string;
  revenueBaseCurrency: string;
  exchangeRateNGN: number;
  exchangeRateEUR: number;
  exchangeRateGBP: number;
}

const defaultSettings: SystemSettingsData = {
  maintenanceMode: false,
  defaultIndividualCredits: 20,
  defaultCorporateCredits: 100,
  aiModelVersion: "gpt-4o-mini",
  emailNotifications: true,
  maxEmployeesPerCompany: 50,
  planGenerationLimit: 10,
  globalDisclaimer: "",
  revenueBaseCurrency: "USD",
  exchangeRateNGN: 0.00065,
  exchangeRateEUR: 1.08,
  exchangeRateGBP: 1.27,
};

export default function SystemSettingsPage() {
  const { data: settingsData, isLoading } = useSystemSettings();
  const updateSettingsMutation = useUpdateSystemSettings();
  const toggleMaintenanceMutation = useToggleMaintenanceMode();

  const admin = useAdminAuthStore((s) => s.admin);
  const [form, setForm] = useState<SystemSettingsData>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setForm({
        maintenanceMode: (settingsData as any).maintenanceMode ?? false,
        defaultIndividualCredits: (settingsData as any).defaultIndividualCredits ?? 20,
        defaultCorporateCredits: (settingsData as any).defaultCorporateCredits ?? 100,
        aiModelVersion: (settingsData as any).aiModelVersion ?? "gpt-4o-mini",
        emailNotifications: (settingsData as any).emailNotifications ?? true,
        maxEmployeesPerCompany: (settingsData as any).maxEmployeesPerCompany ?? 50,
        planGenerationLimit: (settingsData as any).planGenerationLimit ?? 10,
        globalDisclaimer: (settingsData as any).globalDisclaimer ?? "",
        revenueBaseCurrency: (settingsData as any).revenueBaseCurrency ?? "USD",
        exchangeRateNGN: (settingsData as any).exchangeRateNGN ?? 0.00065,
        exchangeRateEUR: (settingsData as any).exchangeRateEUR ?? 1.08,
        exchangeRateGBP: (settingsData as any).exchangeRateGBP ?? 1.27,
      });
    }
  }, [settingsData]);

  const handleSave = () => {
    updateSettingsMutation.mutate(form as any, {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const handleReset = () => {
    if (settingsData) {
      setForm({
        maintenanceMode: (settingsData as any).maintenanceMode ?? false,
        defaultIndividualCredits: (settingsData as any).defaultIndividualCredits ?? 20,
        defaultCorporateCredits: (settingsData as any).defaultCorporateCredits ?? 100,
        aiModelVersion: (settingsData as any).aiModelVersion ?? "gpt-4o-mini",
        emailNotifications: (settingsData as any).emailNotifications ?? true,
        maxEmployeesPerCompany: (settingsData as any).maxEmployeesPerCompany ?? 50,
        planGenerationLimit: (settingsData as any).planGenerationLimit ?? 10,
        globalDisclaimer: (settingsData as any).globalDisclaimer ?? "",
        revenueBaseCurrency: (settingsData as any).revenueBaseCurrency ?? "USD",
        exchangeRateNGN: (settingsData as any).exchangeRateNGN ?? 0.00065,
        exchangeRateEUR: (settingsData as any).exchangeRateEUR ?? 1.08,
        exchangeRateGBP: (settingsData as any).exchangeRateGBP ?? 1.27,
      });
    }
  };

  const handleToggleMaintenance = () => {
    toggleMaintenanceMutation.mutate(undefined, {
      onSuccess: () => {
        setForm((prev) => ({ ...prev, maintenanceMode: !prev.maintenanceMode }));
      },
    });
  };

  const roleConfig = [
    {
      role: "super_admin",
      label: "Super Admin",
      icon: Shield,
      desc: "Full system access. Can manage everything.",
      color: "text-danger",
    },
    {
      role: "client_admin",
      label: "Client Admin",
      icon: UserCog,
      desc: "Can manage companies and users assigned to them.",
      color: "text-info",
    },
    {
      role: "support_admin",
      label: "Support Admin",
      icon: HeadphonesIcon,
      desc: "Read-only access to user data and AI logs. Can reset credits.",
      color: "text-accent",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LucideLoader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="System settings"
        description="Configure platform defaults and system behavior."
      />

      <div className="bg-white rounded-2xl border border-border-light/50 p-6 lg:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-heading">Credit Defaults</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted block mb-1">Default Individual Credits</label>
            <input
              type="number"
              value={form.defaultIndividualCredits}
              onChange={(e) =>
                setForm({ ...form, defaultIndividualCredits: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Default Corporate Credits</label>
            <input
              type="number"
              value={form.defaultCorporateCredits}
              onChange={(e) =>
                setForm({ ...form, defaultCorporateCredits: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light/50 p-6 lg:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-heading">AI Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted block mb-1">AI Model Version</label>
            <select
              value={form.aiModelVersion}
              onChange={(e) => setForm({ ...form, aiModelVersion: e.target.value })}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">Plan Generation Limit (per day)</label>
            <input
              type="number"
              value={form.planGenerationLimit}
              onChange={(e) =>
                setForm({ ...form, planGenerationLimit: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light/50 p-6 lg:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-heading">Platform Settings</h3>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-heading font-medium">Maintenance Mode</p>
            <p className="text-xs text-muted">Take the platform offline for maintenance</p>
          </div>
          <button
            onClick={handleToggleMaintenance}
            disabled={toggleMaintenanceMutation.isPending}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 disabled:opacity-50",
              form.maintenanceMode ? "bg-warning" : "bg-accent"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200",
                form.maintenanceMode ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-border-light">
          <div>
            <p className="text-sm text-heading font-medium">Email Notifications</p>
            <p className="text-xs text-muted">Send email alerts for critical events</p>
          </div>
          <button
            onClick={() =>
              setForm({ ...form, emailNotifications: !form.emailNotifications })
            }
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
              form.emailNotifications ? "bg-accent" : "bg-body/30"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200",
                form.emailNotifications ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        <div className="pt-2 border-t border-border-light">
          <label className="text-xs text-muted block mb-1">Max Employees Per Company</label>
          <input
            type="number"
            value={form.maxEmployeesPerCompany}
            onChange={(e) =>
              setForm({ ...form, maxEmployeesPerCompany: Number(e.target.value) })
            }
            className="w-full max-w-xs px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light/50 p-6 lg:p-8 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-heading">Currency Configuration</h3>
          <p className="text-xs text-muted mt-0.5">
            Set the base currency for revenue reporting. Exchange rates convert foreign currency invoices into the base currency.
            Rates are expressed as: 1 unit of that currency = X {form.revenueBaseCurrency || "USD"}.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted block mb-1">Base Currency</label>
            <select
              value={form.revenueBaseCurrency}
              onChange={(e) => setForm({ ...form, revenueBaseCurrency: e.target.value })}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="USD">USD — US Dollar ($)</option>
              <option value="NGN">NGN — Nigerian Naira (₦)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border-light">
          <div>
            <label className="text-xs text-muted block mb-1">NGN → {form.revenueBaseCurrency || "USD"} rate</label>
            <input
              type="number"
              step="0.000001"
              min="0"
              value={form.exchangeRateNGN}
              onChange={(e) => setForm({ ...form, exchangeRateNGN: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. 0.00065"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">EUR → {form.revenueBaseCurrency || "USD"} rate</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={form.exchangeRateEUR}
              onChange={(e) => setForm({ ...form, exchangeRateEUR: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. 1.08"
            />
          </div>
          <div>
            <label className="text-xs text-muted block mb-1">GBP → {form.revenueBaseCurrency || "USD"} rate</label>
            <input
              type="number"
              step="0.0001"
              min="0"
              value={form.exchangeRateGBP}
              onChange={(e) => setForm({ ...form, exchangeRateGBP: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. 1.27"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light/50 p-6 lg:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-heading">Global Disclaimer</h3>
        <textarea
          value={form.globalDisclaimer}
          onChange={(e) => setForm({ ...form, globalDisclaimer: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 bg-background-secondary border border-border rounded-lg text-sm text-heading focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors duration-150 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-button-secondary border border-border text-body rounded-xl text-sm font-medium hover:bg-background-primary transition-colors duration-150"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        {saved && <span className="text-sm text-success font-medium">Settings saved!</span>}
      </div>

      <div className="bg-white rounded-2xl border border-border-light/50 p-6 lg:p-8 space-y-4">
        <h3 className="text-sm font-semibold text-heading">Admin Roles</h3>
        <p className="text-xs text-muted">
          Current role:{" "}
          <span className="font-semibold text-heading capitalize">
            {admin?.role?.replace(/_/g, " ") ?? "unknown"}
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleConfig.map((r) => (
            <div
              key={r.role}
              className={cn(
                "rounded-xl border p-4",
                admin?.role === r.role ? "border-accent bg-accent/5" : "border-border-light"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <r.icon className={cn("w-5 h-5", r.color)} />
                <h4 className="font-semibold text-heading text-sm">{r.label}</h4>
              </div>
              <p className="text-xs text-muted">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}