import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Loader2,
  MessageSquare,
  Plus,
  Reply as ReplyIcon,
  Send,
  User,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────

type RecipientType = "seller" | "customer" | "business" | "all";

interface Reply {
  id: string;
  from: "admin" | string;
  body: string;
  timestamp: string;
}

interface Message {
  id: string;
  from: "admin";
  to: string;
  toType: RecipientType;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  replies: Reply[];
}

// ── Persistence helpers ────────────────────────────────────────────────────

function loadMessages(): Message[] {
  try {
    return JSON.parse(localStorage.getItem("admin_messages") || "[]");
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem("admin_messages", JSON.stringify(messages));
  } catch {
    // ignore
  }
}

// ── Format helpers ─────────────────────────────────────────────────────────

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

const TYPE_COLORS: Record<RecipientType, string> = {
  seller: "bg-blue-100 text-blue-700 border-blue-200",
  customer: "bg-green-100 text-green-700 border-green-200",
  business: "bg-purple-100 text-purple-700 border-purple-200",
  all: "bg-amber-100 text-amber-700 border-amber-200",
};

const TYPE_LABELS: Record<RecipientType, string> = {
  seller: "Seller",
  customer: "Customer",
  business: "Business",
  all: "All Users",
};

// ── Compose Modal ─────────────────────────────────────────────────────────

interface ComposeModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (msg: Message) => void;
}

function ComposeModal({ open, onClose, onSend }: ComposeModalProps) {
  const [toType, setToType] = useState<RecipientType>("seller");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!toName.trim() || !subject.trim() || !body.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 400));

    const msg: Message = {
      id: `msg_${Date.now()}`,
      from: "admin",
      to: toName.trim(),
      toType,
      subject: subject.trim(),
      body: body.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      replies: [],
    };

    onSend(msg);
    setToType("seller");
    setToName("");
    setSubject("");
    setBody("");
    setIsSending(false);
    toast.success("Message sent successfully.");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-lg"
        data-ocid="messaging.compose.dialog"
      >
        <DialogHeader>
          <DialogTitle>Compose Message</DialogTitle>
          <DialogDescription>
            Send a message to a seller, customer, business, or all users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Recipient Type *</Label>
            <Select
              value={toType}
              onValueChange={(v) => setToType(v as RecipientType)}
            >
              <SelectTrigger data-ocid="messaging.compose_type.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(TYPE_LABELS) as [RecipientType, string][]).map(
                  ([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compose-to">Recipient Name *</Label>
            <Input
              id="compose-to"
              placeholder={
                toType === "all" ? "All Users" : "Enter recipient name"
              }
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              data-ocid="messaging.compose_to.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compose-subject">Subject *</Label>
            <Input
              id="compose-subject"
              placeholder="Message subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              data-ocid="messaging.compose_subject.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compose-body">Message *</Label>
            <Textarea
              id="compose-body"
              placeholder="Type your message here..."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              data-ocid="messaging.compose_body.textarea"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="messaging.compose.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={
              isSending || !toName.trim() || !subject.trim() || !body.trim()
            }
            className="bg-blue-700 hover:bg-blue-800 text-white"
            data-ocid="messaging.compose.submit_button"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Thread View ───────────────────────────────────────────────────────────

interface ThreadViewProps {
  message: Message;
  onReply: (id: string, replyBody: string) => void;
}

function ThreadView({ message, onReply }: ThreadViewProps) {
  const [replyBody, setReplyBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!replyBody.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 300));
    onReply(message.id, replyBody.trim());
    setReplyBody("");
    setIsSending(false);
    toast.success("Reply sent.");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">
              {message.subject}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-slate-500">To: {message.to}</span>
              <Badge className={cn("text-xs", TYPE_COLORS[message.toType])}>
                {TYPE_LABELS[message.toType]}
              </Badge>
            </div>
          </div>
          <span className="text-xs text-slate-400 shrink-0">
            {relativeTime(message.timestamp)}
          </span>
        </div>
      </div>

      {/* Thread messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {/* Original message */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                Admin (You)
              </span>
              <span className="text-xs text-slate-400 ml-auto">
                {relativeTime(message.timestamp)}
              </span>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">
              {message.body}
            </p>
          </div>

          {/* Replies */}
          {message.replies.map((r) => (
            <div
              key={r.id}
              className={cn(
                "rounded-lg p-3 border",
                r.from === "admin"
                  ? "bg-blue-50 border-blue-100"
                  : "bg-slate-50 border-slate-200",
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <ReplyIcon className="w-3.5 h-3.5 text-slate-500" />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    r.from === "admin" ? "text-blue-700" : "text-slate-600",
                  )}
                >
                  {r.from === "admin" ? "Admin (You)" : r.from}
                </span>
                <span className="text-xs text-slate-400 ml-auto">
                  {relativeTime(r.timestamp)}
                </span>
              </div>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Reply box */}
      <div className="p-4 border-t space-y-2">
        <Textarea
          placeholder="Write a reply..."
          rows={3}
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          data-ocid="messaging.reply.textarea"
        />
        <Button
          onClick={handleSend}
          disabled={!replyBody.trim() || isSending}
          size="sm"
          className="bg-blue-700 hover:bg-blue-800 text-white"
          data-ocid="messaging.reply.submit_button"
        >
          {isSending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Send className="h-3.5 w-3.5 mr-1" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

type FilterTab = "all" | RecipientType;

export default function AdminMessagingPanel() {
  const [messages, setMessages] = useState<Message[]>(() => loadMessages());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [composeOpen, setComposeOpen] = useState(false);

  const persistMessages = (updated: Message[]) => {
    saveMessages(updated);
    setMessages(updated);
  };

  const handleSend = (msg: Message) => {
    const updated = [msg, ...messages];
    persistMessages(updated);
    setSelectedId(msg.id);
  };

  const handleSelectMessage = (id: string) => {
    setSelectedId(id);
    // Mark as read
    const updated = messages.map((m) =>
      m.id === id ? { ...m, read: true } : m,
    );
    persistMessages(updated);
  };

  const handleReply = (msgId: string, replyBody: string) => {
    const updated = messages.map((m) => {
      if (m.id !== msgId) return m;
      const reply: Reply = {
        id: `reply_${Date.now()}`,
        from: "admin",
        body: replyBody,
        timestamp: new Date().toISOString(),
      };
      return { ...m, replies: [...m.replies, reply] };
    });
    persistMessages(updated);
  };

  const filteredMessages =
    filter === "all" ? messages : messages.filter((m) => m.toType === filter);

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.read).length;

  const FILTER_TABS: { value: FilterTab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "seller", label: "Sellers" },
    { value: "customer", label: "Customers" },
    { value: "business", label: "Businesses" },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-blue-700" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Admin Messaging
                  {unreadCount > 0 && (
                    <Badge className="bg-blue-700 text-white text-xs ml-1">
                      {unreadCount} unread
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Communicate with sellers, customers, and businesses
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={() => setComposeOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white"
              data-ocid="messaging.compose.open_modal_button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
        </CardHeader>

        <Separator />

        {messages.length === 0 ? (
          <CardContent className="py-16">
            <div
              className="text-center space-y-4"
              data-ocid="messaging.empty_state"
            >
              <MessageSquare className="h-12 w-12 mx-auto text-slate-300" />
              <div>
                <h3 className="font-semibold text-lg text-slate-700">
                  No Messages Yet
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Start communicating with your marketplace participants.
                </p>
              </div>
              <Button
                onClick={() => setComposeOpen(true)}
                className="bg-blue-700 hover:bg-blue-800 text-white"
                data-ocid="messaging.empty_state.primary_button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Compose your first message
              </Button>
            </div>
          </CardContent>
        ) : (
          <div className="flex h-[600px]">
            {/* ── Left: Message List ── */}
            <div className="w-72 shrink-0 border-r flex flex-col">
              {/* Filter tabs */}
              <div className="flex gap-1 p-2 border-b overflow-x-auto">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setFilter(tab.value)}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md shrink-0 transition-colors",
                      filter === tab.value
                        ? "bg-blue-700 text-white"
                        : "text-slate-600 hover:bg-slate-100",
                    )}
                    data-ocid={`messaging.filter_${tab.value}.tab`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Message rows */}
              <ScrollArea className="flex-1">
                {filteredMessages.length === 0 ? (
                  <div
                    className="text-center py-8 text-slate-400 text-xs px-4"
                    data-ocid="messaging.filtered.empty_state"
                  >
                    No messages in this category.
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredMessages.map((m, i) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectMessage(m.id)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 hover:bg-slate-50 transition-colors",
                          selectedId === m.id && "bg-blue-50",
                        )}
                        data-ocid={`messaging.message.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {!m.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                            <span
                              className={cn(
                                "text-xs font-medium truncate",
                                !m.read ? "text-slate-800" : "text-slate-600",
                              )}
                            >
                              {m.to}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 shrink-0">
                            {relativeTime(m.timestamp)}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-xs mt-0.5 truncate",
                            !m.read
                              ? "text-slate-700 font-medium"
                              : "text-slate-500",
                          )}
                        >
                          {m.subject}
                        </p>
                        <Badge
                          className={cn("text-xs mt-1", TYPE_COLORS[m.toType])}
                        >
                          {TYPE_LABELS[m.toType]}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* ── Right: Thread View ── */}
            <div className="flex-1 min-w-0">
              {selectedMessage ? (
                <ThreadView message={selectedMessage} onReply={handleReply} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center space-y-2">
                    <MessageSquare className="h-10 w-10 mx-auto text-slate-300" />
                    <p className="text-sm">
                      Select a message to view the thread
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      <ComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        onSend={handleSend}
      />
    </>
  );
}
