import { useState, useEffect } from "react";
import { FadeIn } from "@/shared/components/Animated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Users, Shield, Key, Search, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";

export function UserManagement() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    document.title = "User Management — ScamSniff Admin";
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <p className="clay-pill inline-block">User Management</p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">User Accounts</h1>
        <p className="mt-2 text-muted-foreground">
          Manage user accounts, roles, and permissions
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </FadeIn>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="clay grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <div className="clay p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">User Accounts</h2>
              <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="clay-inset w-full rounded-xl pl-10 pr-4 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { id: "USR-001", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastActive: "2 minutes ago" },
                { id: "USR-002", name: "Jane Smith", email: "jane@example.com", role: "Analyst", status: "Active", lastActive: "5 minutes ago" },
                { id: "USR-003", name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "Inactive", lastActive: "2 days ago" },
                { id: "USR-004", name: "Alice Williams", email: "alice@example.com", role: "Analyst", status: "Active", lastActive: "1 hour ago" },
                { id: "USR-005", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Active", lastActive: "30 minutes ago" },
              ].map((user) => (
                <div key={user.id} className="clay-inset flex items-center justify-between rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-500/20 text-purple-500 font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="font-semibold">{user.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last Active</p>
                      <p className="text-sm">{user.lastActive}</p>
                    </div>
                    <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="clay p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Roles</h2>
              <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Role
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { name: "Admin", description: "Full system access", users: 2, permissions: 12 },
                { name: "Analyst", description: "View and analyze data", users: 5, permissions: 8 },
                { name: "Viewer", description: "Read-only access", users: 15, permissions: 4 },
              ].map((role) => (
                <div key={role.name} className="clay-inset flex items-center justify-between rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/20">
                      <Shield className="h-6 w-6 text-blue-500" />
                    </span>
                    <div>
                      <p className="font-semibold">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Users</p>
                      <p className="font-semibold">{role.users}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Permissions</p>
                      <p className="font-semibold">{role.permissions}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="clay p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Permissions</h2>
              <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Permission
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { name: "view_dashboard", description: "View admin dashboard", category: "General" },
                { name: "manage_users", description: "Create, edit, delete users", category: "User Management" },
                { name: "view_analytics", description: "View analytics and reports", category: "Analytics" },
                { name: "manage_settings", description: "Modify system settings", category: "Settings" },
                { name: "view_monitoring", description: "View monitoring data", category: "Monitoring" },
                { name: "manage_alerts", description: "Configure and manage alerts", category: "Alerts" },
              ].map((permission) => (
                <div key={permission.name} className="clay-inset flex items-center justify-between rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-green-500/20">
                      <Key className="h-6 w-6 text-green-500" />
                    </span>
                    <div>
                      <p className="font-semibold">{permission.name}</p>
                      <p className="text-xs text-muted-foreground">{permission.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="font-semibold">{permission.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
