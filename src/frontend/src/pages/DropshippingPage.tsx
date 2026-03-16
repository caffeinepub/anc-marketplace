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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Package,
  ShieldCheck,
  Truck,
  Upload,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrderStatus = "Forwarded" | "Pending" | "Shipped" | "Delivered";
type ProofStatus =
  | "Pending Proof"
  | "Proof Submitted"
  | "Verified"
  | "Disputed";
type PaymentStatus = "Pending" | "Released" | "Disputed";
type EscrowStatus =
  | "Held"
  | "Customer Confirmed"
  | "Seller Proof Submitted"
  | "Auto-Release Due"
  | "Released"
  | "Disputed";

interface Supplier {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DropOrder {
  id: string;
  product: string;
  supplier: string;
  status: OrderStatus;
  customer?: string;
  proofStatus?: ProofStatus;
}

interface SupplierPayment {
  id: string;
  supplier: string;
  orderId: string;
  total: number;
  platformFee: number;
  supplierAmount: number;
  commissionRate: number;
  sellerCommission: number;
  status: PaymentStatus;
}

interface EscrowOrder {
  id: string;
  customer: string;
  amount: number;
  holdDate: string;
  releaseDate: string;
  status: EscrowStatus;
}

interface Agreement {
  id: string;
  supplierName: string;
  companyName: string;
  email: string;
  title: string;
  signature: string;
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SUPPLIERS: Supplier[] = [
  { id: "printful", name: "Printful", icon: <Package className="h-5 w-5" /> },
  { id: "spocket", name: "Spocket", icon: <Truck className="h-5 w-5" /> },
  { id: "oberlo", name: "Oberlo", icon: <Globe className="h-5 w-5" /> },
  {
    id: "aliexpress",
    name: "AliExpress",
    icon: <Package className="h-5 w-5" />,
  },
  { id: "cj", name: "CJ Dropshipping", icon: <Truck className="h-5 w-5" /> },
  {
    id: "custom",
    name: "Custom Supplier API",
    icon: <Globe className="h-5 w-5" />,
  },
];

const MOCK_ORDERS: DropOrder[] = [
  {
    id: "DS-001",
    product: "Wireless Earbuds Pro",
    supplier: "Printful",
    status: "Forwarded",
    customer: "J. Smith",
    proofStatus: "Pending Proof",
  },
  {
    id: "DS-002",
    product: "USB-C Hub 7-Port",
    supplier: "CJ Dropshipping",
    status: "Shipped",
    customer: "M. Johnson",
    proofStatus: "Proof Submitted",
  },
  {
    id: "DS-003",
    product: "LED Desk Lamp RGB",
    supplier: "AliExpress",
    status: "Pending",
    customer: "R. Davis",
    proofStatus: "Pending Proof",
  },
];

const MOCK_PAYMENTS: SupplierPayment[] = [
  {
    id: "SP-001",
    supplier: "Printful",
    orderId: "DS-001",
    total: 8500,
    platformFee: 500,
    supplierAmount: 8000,
    commissionRate: 15,
    sellerCommission: 1200,
    status: "Pending",
  },
  {
    id: "SP-002",
    supplier: "CJ Dropshipping",
    orderId: "DS-002",
    total: 3200,
    platformFee: 500,
    supplierAmount: 2700,
    commissionRate: 12,
    sellerCommission: 384,
    status: "Released",
  },
  {
    id: "SP-003",
    supplier: "AliExpress",
    orderId: "DS-003",
    total: 5600,
    platformFee: 500,
    supplierAmount: 5100,
    commissionRate: 10,
    sellerCommission: 510,
    status: "Pending",
  },
];

const MOCK_ESCROW: EscrowOrder[] = [
  {
    id: "DS-001",
    customer: "J. Smith",
    amount: 8500,
    holdDate: "2026-02-20",
    releaseDate: "2026-03-12",
    status: "Held",
  },
  {
    id: "DS-002",
    customer: "M. Johnson",
    amount: 3200,
    holdDate: "2026-02-25",
    releaseDate: "2026-03-17",
    status: "Customer Confirmed",
  },
  {
    id: "DS-003",
    customer: "R. Davis",
    amount: 5600,
    holdDate: "2026-01-15",
    releaseDate: "2026-02-04",
    status: "Auto-Release Due",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function ProofStatusBadge({ status }: { status: ProofStatus }) {
  const map: Record<ProofStatus, { class: string; icon: React.ReactNode }> = {
    "Pending Proof": {
      class: "bg-amber-100 text-amber-800",
      icon: <Clock className="w-3 h-3 mr-1" />,
    },
    "Proof Submitted": {
      class: "bg-blue-100 text-blue-800",
      icon: <Upload className="w-3 h-3 mr-1" />,
    },
    Verified: {
      class: "bg-emerald-100 text-emerald-800",
      icon: <CheckCircle className="w-3 h-3 mr-1" />,
    },
    Disputed: {
      class: "bg-red-100 text-red-800",
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
    },
  };
  const { class: cls, icon } = map[status];
  return (
    <Badge className={`${cls} flex items-center`}>
      {icon}
      {status}
    </Badge>
  );
}

function EscrowStatusBadge({ status }: { status: EscrowStatus }) {
  const map: Record<EscrowStatus, string> = {
    Held: "bg-amber-100 text-amber-800",
    "Customer Confirmed": "bg-blue-100 text-blue-800",
    "Seller Proof Submitted": "bg-purple-100 text-purple-800",
    "Auto-Release Due": "bg-orange-100 text-orange-800",
    Released: "bg-emerald-100 text-emerald-800",
    Disputed: "bg-red-100 text-red-800",
  };
  return <Badge className={map[status]}>{status}</Badge>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DropshippingPage() {
  const [connectedSuppliers, setConnectedSuppliers] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("dropship_connected_suppliers");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<DropOrder[]>(MOCK_ORDERS);
  const [payments, setPayments] = useState<SupplierPayment[]>(MOCK_PAYMENTS);
  const [escrowOrders] = useState<EscrowOrder[]>(MOCK_ESCROW);
  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    try {
      const stored = localStorage.getItem("dropship_agreements");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [agreementForm, setAgreementForm] = useState({
    supplierName: "",
    companyName: "",
    email: "",
    title: "",
    signature: "",
  });

  const toggleSupplier = (id: string) => {
    const updated = connectedSuppliers.includes(id)
      ? connectedSuppliers.filter((s) => s !== id)
      : [...connectedSuppliers, id];
    setConnectedSuppliers(updated);
    localStorage.setItem(
      "dropship_connected_suppliers",
      JSON.stringify(updated),
    );
    toast.success(
      connectedSuppliers.includes(id)
        ? `${id} disconnected`
        : `${id} connected successfully`,
    );
  };

  const forwardOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "Forwarded" as OrderStatus } : o,
      ),
    );
    toast.success(`Order ${orderId} forwarded to supplier`);
  };

  const submitProof = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, proofStatus: "Proof Submitted" as ProofStatus }
          : o,
      ),
    );
    toast.success(`Shipping proof submitted for order ${orderId}`);
  };

  const verifyProof = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, proofStatus: "Verified" as ProofStatus } : o,
      ),
    );
    toast.success(
      `Proof verified for order ${orderId}. Escrow will be released.`,
    );
  };

  const releasePayment = (paymentId: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, status: "Released" as PaymentStatus } : p,
      ),
    );
    toast.success("Payment released to supplier");
  };

  const signAgreement = () => {
    if (!agreementForm.supplierName || !agreementForm.signature) {
      toast.error("Supplier name and digital signature are required.");
      return;
    }
    const newAgreement: Agreement = {
      id: `agr_${Date.now()}`,
      ...agreementForm,
      date: new Date().toLocaleDateString(),
    };
    const updated = [...agreements, newAgreement];
    setAgreements(updated);
    localStorage.setItem("dropship_agreements", JSON.stringify(updated));
    setAgreementForm({
      supplierName: "",
      companyName: "",
      email: "",
      title: "",
      signature: "",
    });
    toast.success("Platform agreement signed successfully!");
  };

  const totalHeld = escrowOrders
    .filter((o) => o.status === "Held" || o.status === "Seller Proof Submitted")
    .reduce((sum, o) => sum + o.amount, 0);
  const totalReleased = escrowOrders
    .filter((o) => o.status === "Released" || o.status === "Customer Confirmed")
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingRelease = escrowOrders.filter(
    (o) => o.status === "Auto-Release Due",
  ).length;
  const disputed = escrowOrders.filter((o) => o.status === "Disputed").length;

  return (
    <RequireAuthenticatedRegisteredUser>
      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Dropshipping Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage suppliers, automated order forwarding, payments, and escrow
            </p>
          </div>

          <Tabs defaultValue="forwarding">
            <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
              <TabsTrigger
                value="forwarding"
                data-ocid="dropshipping.forwarding.tab"
              >
                Order Forwarding
              </TabsTrigger>
              <TabsTrigger value="proof" data-ocid="dropshipping.proof.tab">
                Shipping Proof
              </TabsTrigger>
              <TabsTrigger
                value="payments"
                data-ocid="dropshipping.payments.tab"
              >
                Supplier Payments
              </TabsTrigger>
              <TabsTrigger
                value="agreement"
                data-ocid="dropshipping.agreement.tab"
              >
                Platform Agreement
              </TabsTrigger>
              <TabsTrigger value="escrow" data-ocid="dropshipping.escrow.tab">
                Escrow Status
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Order Forwarding ─────────────────────────────────── */}
            <TabsContent value="forwarding" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Automated Order Forwarding
                  </CardTitle>
                  <CardDescription>
                    Orders are automatically forwarded to your connected
                    supplier when a customer purchases a dropshipped item.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SUPPLIERS.map((sup) => {
                      const isConnected = connectedSuppliers.includes(sup.id);
                      return (
                        <div
                          key={sup.id}
                          className={`p-4 border rounded-lg flex items-start gap-3 ${
                            isConnected
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-slate-200 bg-white"
                          }`}
                          data-ocid="dropshipping.supplier.card"
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              isConnected
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {sup.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800">
                              {sup.name}
                            </p>
                            <Badge
                              className={`text-xs mt-1 ${
                                isConnected
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {isConnected ? "Connected" : "Not Connected"}
                            </Badge>
                            <Button
                              size="sm"
                              variant={isConnected ? "outline" : "default"}
                              className="mt-2 w-full text-xs"
                              onClick={() => toggleSupplier(sup.id)}
                              data-ocid="dropshipping.supplier.button"
                            >
                              {isConnected ? "Disconnect" : "Configure"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Active Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div
                      className="text-center py-8 text-muted-foreground"
                      data-ocid="dropshipping.orders.empty_state"
                    >
                      <Package className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p>No active orders yet</p>
                    </div>
                  ) : (
                    <Table data-ocid="dropshipping.orders.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Supplier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order, idx) => (
                          <TableRow
                            key={order.id}
                            data-ocid={`dropshipping.orders.row.${idx + 1}`}
                          >
                            <TableCell className="font-mono text-sm">
                              {order.id}
                            </TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.supplier}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  order.status === "Shipped" ||
                                  order.status === "Delivered"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : order.status === "Forwarded"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-amber-100 text-amber-800"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.status === "Pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => forwardOrder(order.id)}
                                  data-ocid="dropshipping.forward.button"
                                >
                                  <ArrowRight className="w-3.5 h-3.5 mr-1" />
                                  Forward
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 2: Shipping Proof ───────────────────────────────────── */}
            <TabsContent value="proof" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-purple-600" />
                    Supplier Shipping Proof
                  </CardTitle>
                  <CardDescription>
                    Suppliers submit proof of shipment here. Once verified,
                    escrow funds are released.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table data-ocid="dropshipping.proof.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order, idx) => (
                        <TableRow
                          key={order.id}
                          data-ocid={`dropshipping.proof.row.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-sm">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.product}</TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <ProofStatusBadge
                              status={order.proofStatus || "Pending Proof"}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1.5">
                              {order.proofStatus === "Pending Proof" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => submitProof(order.id)}
                                  data-ocid="dropshipping.proof.upload_button"
                                >
                                  <Upload className="w-3.5 h-3.5 mr-1" />
                                  Upload Proof
                                </Button>
                              )}
                              {order.proofStatus === "Proof Submitted" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => verifyProof(order.id)}
                                    data-ocid="dropshipping.proof.confirm_button"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                    Verify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      setOrders((prev) =>
                                        prev.map((o) =>
                                          o.id === order.id
                                            ? {
                                                ...o,
                                                proofStatus:
                                                  "Disputed" as ProofStatus,
                                              }
                                            : o,
                                        ),
                                      )
                                    }
                                    data-ocid="dropshipping.proof.delete_button"
                                  >
                                    <XCircle className="w-3.5 h-3.5 mr-1" />
                                    Dispute
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 3: Supplier Payments ────────────────────────────────── */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    Supplier Payment Management
                  </CardTitle>
                  <CardDescription>
                    Platform pays the supplier. Supplier pays the seller their
                    agreed commission.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Flow Diagram */}
                  <div className="flex items-center gap-2 flex-wrap p-4 bg-slate-50 border rounded-lg text-sm">
                    {[
                      {
                        label: "Customer Payment",
                        color: "bg-blue-100 text-blue-800 border-blue-200",
                      },
                      {
                        label: "Platform Escrow",
                        color: "bg-amber-100 text-amber-800 border-amber-200",
                      },
                      {
                        label: "Supplier Payment",
                        color:
                          "bg-purple-100 text-purple-800 border-purple-200",
                      },
                      {
                        label: "Seller Commission",
                        color:
                          "bg-emerald-100 text-emerald-800 border-emerald-200",
                      },
                    ].map((step, i, arr) => (
                      <React.Fragment key={step.label}>
                        <div
                          className={`px-3 py-1.5 rounded-md border font-medium text-xs ${step.color}`}
                        >
                          {step.label}
                        </div>
                        {i < arr.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <Table data-ocid="dropshipping.payments.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Supplier Amt</TableHead>
                        <TableHead>Seller Commission</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((p, idx) => (
                        <TableRow
                          key={p.id}
                          data-ocid={`dropshipping.payments.row.${idx + 1}`}
                        >
                          <TableCell className="font-medium">
                            {p.supplier}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {p.orderId}
                          </TableCell>
                          <TableCell>{formatCents(p.total)}</TableCell>
                          <TableCell className="text-amber-700">
                            {formatCents(p.platformFee)}
                          </TableCell>
                          <TableCell>{formatCents(p.supplierAmount)}</TableCell>
                          <TableCell>
                            {p.commissionRate}% ={" "}
                            {formatCents(p.sellerCommission)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                p.status === "Released"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : p.status === "Disputed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                              }
                            >
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {p.status === "Pending" && (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => releasePayment(p.id)}
                                data-ocid="dropshipping.payment.primary_button"
                              >
                                Release
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab 4: Platform Agreement ───────────────────────────────── */}
            <TabsContent value="agreement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Supplier Platform Agreement
                  </CardTitle>
                  <CardDescription>
                    All suppliers must sign this agreement before they can
                    receive payments.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-50 border rounded-lg space-y-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-800 text-base">
                      Agreement Terms
                    </p>
                    {[
                      "Supplier agrees to ship orders within the agreed timeframe after receiving order confirmation.",
                      "Supplier agrees to handle all returns and issue refunds as required per ANC Marketplace policy.",
                      "Supplier agrees to submit shipping proof (tracking number + carrier confirmation) for all orders.",
                      "Supplier agrees to pay seller commission within 3 business days of payment receipt from platform.",
                      "Platform fee of $5 per transaction is non-refundable under any circumstances.",
                      "Disputes will be resolved by ANC Marketplace administration; all parties must provide evidence.",
                    ].map((term) => (
                      <div key={term} className="flex gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p>{term}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <p className="font-semibold text-slate-800">Sign Agreement</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Supplier Name *</Label>
                      <Input
                        value={agreementForm.supplierName}
                        onChange={(e) =>
                          setAgreementForm((p) => ({
                            ...p,
                            supplierName: e.target.value,
                          }))
                        }
                        placeholder="Full name"
                        data-ocid="dropshipping.agreement.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Company Name</Label>
                      <Input
                        value={agreementForm.companyName}
                        onChange={(e) =>
                          setAgreementForm((p) => ({
                            ...p,
                            companyName: e.target.value,
                          }))
                        }
                        placeholder="Company or DBA"
                        data-ocid="dropshipping.agreement.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={agreementForm.email}
                        onChange={(e) =>
                          setAgreementForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        placeholder="email@example.com"
                        data-ocid="dropshipping.agreement.input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Title / Position</Label>
                      <Input
                        value={agreementForm.title}
                        onChange={(e) =>
                          setAgreementForm((p) => ({
                            ...p,
                            title: e.target.value,
                          }))
                        }
                        placeholder="e.g. Owner, Manager"
                        data-ocid="dropshipping.agreement.input"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Digital Signature *</Label>
                    <Input
                      value={agreementForm.signature}
                      onChange={(e) =>
                        setAgreementForm((p) => ({
                          ...p,
                          signature: e.target.value,
                        }))
                      }
                      placeholder="Type your full legal name as signature"
                      data-ocid="dropshipping.agreement.input"
                    />
                  </div>
                  <Button
                    onClick={signAgreement}
                    className="bg-blue-700 hover:bg-blue-800"
                    data-ocid="dropshipping.agreement.submit_button"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Sign Agreement
                  </Button>
                </CardContent>
              </Card>

              {/* Signed Agreements */}
              {agreements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Signed Agreements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {agreements.map((a, idx) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                          data-ocid={`dropshipping.agreement.item.${idx + 1}`}
                        >
                          <div>
                            <p className="font-semibold text-sm">
                              {a.supplierName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {a.companyName} · {a.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-emerald-100 text-emerald-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Signed
                            </Badge>
                            <p className="text-xs text-slate-400 mt-1">
                              {a.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ── Tab 5: Escrow Status ────────────────────────────────────── */}
            <TabsContent value="escrow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                    Dropshipping Escrow & Hold
                  </CardTitle>
                  <CardDescription>
                    All dropshipped orders go through escrow. Funds are held
                    until customer confirms receipt.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Escrow Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                      <p className="text-xs font-semibold text-amber-700">
                        Held in Escrow
                      </p>
                      <p className="text-lg font-bold text-amber-800">
                        {formatCents(totalHeld)}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                      <p className="text-xs font-semibold text-emerald-700">
                        Released
                      </p>
                      <p className="text-lg font-bold text-emerald-800">
                        {formatCents(totalReleased)}
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                      <p className="text-xs font-semibold text-orange-700">
                        Pending Release
                      </p>
                      <p className="text-lg font-bold text-orange-800">
                        {pendingRelease}
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p className="text-xs font-semibold text-red-700">
                        Disputed
                      </p>
                      <p className="text-lg font-bold text-red-800">
                        {disputed}
                      </p>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      Funds are held for up to <strong>20 days</strong>. If the
                      customer doesn't confirm, the seller can submit proof of
                      delivery to trigger release. The{" "}
                      <strong>$5 platform fee</strong> is non-refundable on all
                      transactions.
                    </p>
                  </div>

                  <Table data-ocid="dropshipping.escrow.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Hold Date</TableHead>
                        <TableHead>Release Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {escrowOrders.map((order, idx) => (
                        <TableRow
                          key={order.id}
                          data-ocid={`dropshipping.escrow.row.${idx + 1}`}
                        >
                          <TableCell className="font-mono text-sm">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{formatCents(order.amount)}</TableCell>
                          <TableCell>{order.holdDate}</TableCell>
                          <TableCell>{order.releaseDate}</TableCell>
                          <TableCell>
                            <EscrowStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1.5">
                              {(order.status === "Customer Confirmed" ||
                                order.status === "Auto-Release Due") && (
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  data-ocid="dropshipping.escrow.primary_button"
                                >
                                  Release Funds
                                </Button>
                              )}
                              {order.status === "Disputed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-ocid="dropshipping.escrow.secondary_button"
                                >
                                  View Dispute
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RequireAuthenticatedRegisteredUser>
  );
}
