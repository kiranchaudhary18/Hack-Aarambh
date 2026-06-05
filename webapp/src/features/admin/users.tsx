import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import {
  Search,
  User,
  Mail,
  Shield,
  Ban,
  MoreVertical,
  ChevronDown,
  Filter,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  status: "active" | "suspended" | "banned";
  joinedDate: string;
  lastActive: string;
}

export function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "banned">("all");
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "User Management — ScamSniff";
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        // Mock data for now
        const mockUsers: UserData[] = [
          {
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
            plan: "pro",
            scansUsed: 145,
            scansLimit: 500,
            status: "active",
            joinedDate: "Jan 15, 2024",
            lastActive: "2 hours ago",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            plan: "free",
            scansUsed: 23,
            scansLimit: 50,
            status: "active",
            joinedDate: "Feb 3, 2024",
            lastActive: "1 day ago",
          },
          {
            id: "3",
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
            plan: "pro",
            scansUsed: 489,
            scansLimit: 500,
            status: "active",
            joinedDate: "Dec 10, 2023",
            lastActive: "5 minutes ago",
          },
          {
            id: "4",
            name: "Alice Williams",
            email: "alice.williams@example.com",
            plan: "free",
            scansUsed: 50,
            scansLimit: 50,
            status: "suspended",
            joinedDate: "Mar 22, 2024",
            lastActive: "3 days ago",
          },
          {
            id: "5",
            name: "Charlie Brown",
            email: "charlie.brown@example.com",
            plan: "pro",
            scansUsed: 320,
            scansLimit: 500,
            status: "banned",
            joinedDate: "Jan 5, 2024",
            lastActive: "1 week ago",
          },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    if (action === "delete") {
      if (confirm(`Delete ${selectedUsers.size} users?`)) {
        setUsers(users.filter((u) => !selectedUsers.has(u.id)));
        setSelectedUsers(new Set());
      }
    } else if (action === "suspend") {
      setUsers(
        users.map((u) =>
          selectedUsers.has(u.id) ? { ...u, status: "suspended" as const } : u
        )
      );
      setSelectedUsers(new Set());
    } else if (action === "ban") {
      setUsers(
        users.map((u) =>
          selectedUsers.has(u.id) ? { ...u, status: "banned" as const } : u
        )
      );
      setSelectedUsers(new Set());
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">Admin</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">User Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage user accounts, permissions, and subscriptions.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="clay p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="clay-inset w-full pl-10 pr-4 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`clay-btn flex items-center gap-2 px-4 py-2 text-sm font-semibold ${
                  showFilters ? "is-on" : ""
                }`}
              >
                <Filter className="h-4 w-4" /> Filters
                <ChevronDown
                  className={`h-4 w-4 transition ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border-2 border-dashed p-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "all" | "active" | "suspended" | "banned")
                  }
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
                  Plan
                </label>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as "all" | "free" | "pro")}
                  className="clay-inset px-3 py-2 text-sm"
                >
                  <option value="all">All plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
            </div>
          )}

          {selectedUsers.size > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[color:var(--accent)] p-4">
              <span className="text-sm font-semibold">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold"
                >
                  Clear selection
                </button>
                <button
                  onClick={() => handleBulkAction("suspend")}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleBulkAction("ban")}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold text-[color:var(--destructive)]"
                >
                  Ban
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  className="clay-btn px-3 py-1.5 text-xs font-semibold text-[color:var(--destructive)]"
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-[color:var(--primary)]" />
                      ) : (
                        <div className="h-4 w-4 rounded border-2 border-border" />
                      )}
                      Select all
                    </button>
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Plan
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Usage
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Joined
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Active
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border">
                    <td className="py-4">
                      <button
                        onClick={() => toggleUserSelection(user.id)}
                        className="shrink-0"
                      >
                        {selectedUsers.has(user.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-[color:var(--primary)]" />
                        ) : (
                          <div className="h-5 w-5 rounded border-2 border-border" />
                        )}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-full clay-inset">
                          <User className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`clay-pill inline-block text-[10px] uppercase ${
                          user.plan === "pro" ? "bg-[color:var(--primary)]" : ""
                        }`}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="clay-inset h-2 w-24 overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(user.scansUsed / user.scansLimit) * 100}%`,
                              background: "var(--primary)",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {user.scansUsed}/{user.scansLimit}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`clay-pill inline-flex items-center gap-1.5 text-[10px] uppercase ${
                          user.status === "active"
                            ? "bg-[color:var(--success)]"
                            : user.status === "suspended"
                            ? "bg-[color:var(--warning)]"
                            : "bg-[color:var(--destructive)]"
                        }`}
                      >
                        {user.status === "active" && <CheckCircle2 className="h-3 w-3" />}
                        {user.status === "suspended" && <XCircle className="h-3 w-3" />}
                        {user.status === "banned" && <Ban className="h-3 w-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{user.joinedDate}</td>
                    <td className="py-4 text-sm text-muted-foreground">{user.lastActive}</td>
                    <td className="py-4 text-right">
                      <button className="clay-btn p-2">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-sm font-semibold">No users found</p>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
