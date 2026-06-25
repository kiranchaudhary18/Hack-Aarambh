import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Check, X, Loader2, ShieldAlert } from "lucide-react";
import { FadeIn } from "@/shared/components/Animated";

interface PendingReport {
  id: string;
  companyName: string;
  domain?: string;
  scamType: string;
  severity: string;
  description: string;
  sources: any[];
  reportCount: number;
  createdAt: string;
}

export function PendingReports() {
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const fetchPendingReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data);
      } else {
        toast.error("Failed to fetch pending reports");
      }
    } catch (error) {
      toast.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search/${id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminId: "current-admin" }), // You may want to get actual admin ID from auth
      });

      if (response.ok) {
        toast.success("Report approved successfully");
        setReports(reports.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to approve report");
      }
    } catch (error) {
      toast.error("Error approving report");
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/search/${rejectingId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminId: "current-admin",
          reason: rejectionReason,
        }),
      });

      if (response.ok) {
        toast.success("Report rejected successfully");
        setReports(reports.filter((r) => r.id !== rejectingId));
        setShowRejectModal(false);
        setRejectionReason("");
        setRejectingId(null);
      } else {
        toast.error("Failed to reject report");
      }
    } catch (error) {
      toast.error("Error rejecting report");
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
    setRejectingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin Reports</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Pending Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Review and approve or reject user-submitted scam reports
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="clay p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{reports.length} pending</span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No pending reports to review</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="clay-sm p-6 space-y-4 transition hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-xl font-bold">{report.companyName}</h3>
                        {report.domain && (
                          <span className="text-sm text-muted-foreground">({report.domain})</span>
                        )}
                        <span
                          className={`clay-pill text-[10px] uppercase ${
                            report.severity === "high"
                              ? "bg-[color:var(--destructive)] text-destructive-foreground"
                              : report.severity === "medium"
                              ? "bg-[color:var(--warning)]"
                              : "bg-[color:var(--success)]"
                          }`}
                        >
                          {report.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Type: {report.scamType}</span>
                        <span>Reports: {report.reportCount}</span>
                        <span>
                          Submitted: {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(report.id)}
                        className="clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                        style={{ color: "var(--success)" }}
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(report.id)}
                        className="clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold"
                        style={{ color: "var(--destructive)" }}
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="clay-inset pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Description:</p>
                    <p className="text-sm">{report.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeIn>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="clay p-6 max-w-md w-full space-y-4">
            <h3 className="font-display text-xl font-bold">Reject Report</h3>
            <p className="text-sm text-muted-foreground">
              Please provide a reason for rejecting this report (optional).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="clay-inset w-full p-3 text-sm resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={closeRejectModal}
                className="clay-btn px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="clay-btn px-4 py-2 text-sm font-semibold"
                style={{ color: "var(--destructive)" }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
