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
import { CheckCircle2, DollarSign, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";

const FEE_KEY = "admin_fee_config";

function loadSavedFee(): string {
  try {
    const stored = localStorage.getItem(FEE_KEY);
    if (!stored) return "5.00";
    const parsed = JSON.parse(stored);
    return parsed.saleFee ?? "5.00";
  } catch {
    return "5.00";
  }
}

export default function FeeConfigurationPanel() {
  const [saleFee, setSaleFee] = React.useState("5.00");
  const [isSaving, setIsSaving] = React.useState(false);

  // Load saved fee on mount
  useEffect(() => {
    setSaleFee(loadSavedFee());
  }, []);

  const handleSave = async () => {
    const numFee = Number.parseFloat(saleFee);
    if (Number.isNaN(numFee) || numFee < 0) {
      toast.error("Please enter a valid fee amount.");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      localStorage.setItem(
        FEE_KEY,
        JSON.stringify({ saleFee: numFee.toFixed(2) }),
      );
      toast.success(`Per-sale fee updated to $${numFee.toFixed(2)}`);
    } catch {
      toast.error("Failed to save fee configuration.");
    }

    setIsSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-600" />
          Fee Configuration
        </CardTitle>
        <CardDescription>
          Manage marketplace service fees and pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sale-fee">Per-Sale Service Fee (USD)</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="sale-fee"
                type="number"
                step="0.01"
                min="0"
                value={saleFee}
                onChange={(e) => setSaleFee(e.target.value)}
                className="pl-7"
                data-ocid="fees.sale_fee.input"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              data-ocid="fees.save.primary_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Non-refundable fee charged per marketplace sale. Currently: $
            {saleFee} per sale.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
