import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AVAILABLE_BALANCE_CENTS,
  PAYROLL_SAVINGS_CENTS,
} from "@/hooks/useAdminBalance";
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Loader2,
  RefreshCw,
  Settings,
  ShieldAlert,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────

interface AppConfig {
  appName: string;
  supportEmail: string;
  contactPhone: string;
}

interface PlatformPolicy {
  escrowHoldDays: number;
  autoReleaseDays: number;
  perSaleFee: number;
}

// ── Persistence helpers ────────────────────────────────────────────────────

const DEFAULTS: AppConfig = {
  appName: "ANC Marketplace",
  supportEmail: "support@anc-electronics-n-services.net",
  contactPhone: "903-993-7369",
};

const POLICY_DEFAULTS: PlatformPolicy = {
  escrowHoldDays: 20,
  autoReleaseDays: 20,
  perSaleFee: 5.0,
};

function loadAppConfig(): AppConfig {
  try {
    const stored = localStorage.getItem("admin_app_config");
    if (!stored) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(stored) };
  } catch {
    return DEFAULTS;
  }
}

function loadPlatformPolicy(): PlatformPolicy {
  try {
    const stored = localStorage.getItem("admin_platform_policy");
    const feeStored = localStorage.getItem("admin_fee_config");
    const policy = stored
      ? { ...POLICY_DEFAULTS, ...JSON.parse(stored) }
      : POLICY_DEFAULTS;
    if (feeStored) {
      const fee = JSON.parse(feeStored);
      if (fee.saleFee) policy.perSaleFee = Number(fee.saleFee);
    }
    return policy;
  } catch {
    return POLICY_DEFAULTS;
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function AdminSettingsPanel() {
  // App Config state
  const [appConfig, setAppConfig] = useState<AppConfig>(() => loadAppConfig());
  const [isSavingApp, setIsSavingApp] = useState(false);

  // Platform Policy state
  const [policy, setPolicy] = useState<PlatformPolicy>(() =>
    loadPlatformPolicy(),
  );
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);

  // Danger zone
  const [isResetting, setIsResetting] = useState(false);

  // ── App Config handlers ──

  const handleSaveAppConfig = async () => {
    setIsSavingApp(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      localStorage.setItem("admin_app_config", JSON.stringify(appConfig));
      toast.success("App configuration saved.");
    } catch {
      toast.error("Failed to save configuration.");
    }
    setIsSavingApp(false);
  };

  // ── Platform Policy handlers ──

  const handleSavePlatformPolicy = async () => {
    setIsSavingPolicy(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      localStorage.setItem("admin_platform_policy", JSON.stringify(policy));
      // Sync per-sale fee to admin_fee_config
      localStorage.setItem(
        "admin_fee_config",
        JSON.stringify({ saleFee: policy.perSaleFee.toFixed(2) }),
      );
      window.dispatchEvent(new CustomEvent("admin-balance-updated"));
      toast.success("Platform policy saved.");
    } catch {
      toast.error("Failed to save policy.");
    }
    setIsSavingPolicy(false);
  };

  // ── Danger zone: reset balances ──

  const handleResetBalances = async () => {
    setIsResetting(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      localStorage.setItem(
        "admin_balance_available",
        String(AVAILABLE_BALANCE_CENTS),
      );
      localStorage.setItem(
        "admin_balance_payroll",
        String(PAYROLL_SAVINGS_CENTS),
      );
      window.dispatchEvent(new CustomEvent("admin-balance-updated"));
      toast.success(
        "Balance overrides reset to canonical values. Reload the page to see updated balances.",
      );
    } catch {
      toast.error("Failed to reset balances.");
    }
    setIsResetting(false);
  };

  return (
    <div className="space-y-6">
      {/* ── App Configuration ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-700" />
            App Configuration
          </CardTitle>
          <CardDescription>
            Core application settings for ANC Marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="app-name">App Name</Label>
            <Input
              id="app-name"
              value={appConfig.appName}
              onChange={(e) =>
                setAppConfig((p) => ({ ...p, appName: e.target.value }))
              }
              placeholder="ANC Marketplace"
              data-ocid="settings.app_name.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="support-email">Support Email</Label>
            <Input
              id="support-email"
              type="email"
              value={appConfig.supportEmail}
              onChange={(e) =>
                setAppConfig((p) => ({ ...p, supportEmail: e.target.value }))
              }
              placeholder="support@..."
              data-ocid="settings.support_email.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-phone">Contact Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={appConfig.contactPhone}
              onChange={(e) =>
                setAppConfig((p) => ({ ...p, contactPhone: e.target.value }))
              }
              placeholder="000-000-0000"
              data-ocid="settings.contact_phone.input"
            />
          </div>
          <Button
            onClick={handleSaveAppConfig}
            disabled={isSavingApp}
            className="bg-blue-700 hover:bg-blue-800 text-white"
            data-ocid="settings.app_config.save_button"
          >
            {isSavingApp ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save App Config
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── Platform Policy ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Platform Policy
          </CardTitle>
          <CardDescription>
            Escrow periods, auto-release, and per-sale fees
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="escrow-hold">Escrow Hold Period (days)</Label>
              <Input
                id="escrow-hold"
                type="number"
                min={1}
                max={90}
                value={policy.escrowHoldDays}
                onChange={(e) =>
                  setPolicy((p) => ({
                    ...p,
                    escrowHoldDays: Number(e.target.value),
                  }))
                }
                data-ocid="settings.escrow_hold.input"
              />
              <p className="text-xs text-slate-500">
                How long funds are held in escrow after sale
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="auto-release">Auto-Release Days</Label>
              <Input
                id="auto-release"
                type="number"
                min={1}
                max={90}
                value={policy.autoReleaseDays}
                onChange={(e) =>
                  setPolicy((p) => ({
                    ...p,
                    autoReleaseDays: Number(e.target.value),
                  }))
                }
                data-ocid="settings.auto_release.input"
              />
              <p className="text-xs text-slate-500">
                Auto-release if no dispute raised
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="per-sale-fee">Per-Sale Platform Fee (USD)</Label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                $
              </span>
              <Input
                id="per-sale-fee"
                type="number"
                step={0.01}
                min={0}
                value={policy.perSaleFee}
                onChange={(e) =>
                  setPolicy((p) => ({
                    ...p,
                    perSaleFee: Number(e.target.value),
                  }))
                }
                className="pl-7"
                data-ocid="settings.per_sale_fee.input"
              />
            </div>
            <p className="text-xs text-slate-500">
              Non-refundable fee charged per marketplace sale
            </p>
          </div>

          <Button
            onClick={handleSavePlatformPolicy}
            disabled={isSavingPolicy}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            data-ocid="settings.platform_policy.save_button"
          >
            {isSavingPolicy ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Platform Policy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── Danger Zone ── */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <ShieldAlert className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600">
            Irreversible actions — use with caution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 text-xs">
              Resetting balances will overwrite any custom balance values stored
              in this browser back to the canonical defaults:
              <br />
              <strong>Available: $73,681.16</strong> &mdash;{" "}
              <strong>Payroll Savings: $4,276.22</strong>
            </AlertDescription>
          </Alert>

          <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50/50">
            <div>
              <p className="text-sm font-semibold text-red-800">
                Reset All Balance Overrides
              </p>
              <p className="text-xs text-red-600 mt-0.5">
                Resets available balance and payroll savings to their canonical
                starting values
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleResetBalances}
              disabled={isResetting}
              className="shrink-0 ml-4"
              data-ocid="settings.reset_balances.delete_button"
            >
              {isResetting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Reset Balances
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
