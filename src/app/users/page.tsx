"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Save } from "lucide-react";

import { RequireAdmin } from "@/components/auth/RequireAdmin";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/components/language/language-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  disableAdminUser,
  enableAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/api/admin";
import type { AdminUser, NonAdminUserRole } from "@/lib/types/user";

const nonAdminRoles: NonAdminUserRole[] = [
  "user",
  "vip-plus",
  "vip-pro",
  "vip-pro-max",
];
const allRoleFilterValue = "all";
const ADMIN_REFRESH_INTERVAL_MS = 30_000;

function formatDateTime(
  value: string | null | undefined,
  locale: string,
  notRecordedLabel: string
) {
  if (!value) {
    return notRecordedLabel;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserRow({
  user,
  onUpdated,
}: {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}) {
  const [role, setRole] = useState<NonAdminUserRole>(user.role);
  const [displayName, setDisplayName] = useState(user.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { locale, t } = useLanguage();

  const hasChanges = role !== user.role || displayName !== (user.display_name ?? "");

  const handleSave = async () => {
    if (!hasChanges || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedUser = await updateAdminUser(user.id, {
        role,
        display_name: displayName.trim() || null,
      });
      onUpdated(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.adminUsers.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (toggling) {
      return;
    }

    setToggling(true);
    setError(null);

    try {
      const updatedUser = user.is_active
        ? await disableAdminUser(user.id)
        : await enableAdminUser(user.id);
      onUpdated(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.adminUsers.statusUpdateFailed);
    } finally {
      setToggling(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{user.username}</div>
        {error ? <div className="mt-1 text-xs text-destructive">{error}</div> : null}
      </TableCell>
      <TableCell className="min-w-60 text-muted-foreground">{user.email}</TableCell>
      <TableCell className="min-w-52">
        <Input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder={t.adminUsers.displayNamePlaceholder}
          disabled={saving || toggling}
        />
      </TableCell>
      <TableCell>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as NonAdminUserRole)}
          disabled={saving || toggling}
        >
          <SelectTrigger className="min-w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {nonAdminRoles.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Badge variant={user.is_active ? "secondary" : "destructive"}>
          {user.is_active ? t.adminUsers.active : t.adminUsers.disabled}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.is_email_verified ? "secondary" : "outline"}>
          {user.is_email_verified ? t.adminUsers.verified : t.adminUsers.unverified}
        </Badge>
      </TableCell>
      <TableCell className="min-w-44 text-muted-foreground">
        {formatDateTime(user.created_at, locale, t.adminUsers.notRecorded)}
      </TableCell>
      <TableCell className="min-w-44 text-muted-foreground">
        {formatDateTime(user.last_login_at, locale, t.adminUsers.notRecorded)}
      </TableCell>
      <TableCell>
        <div className="flex min-w-48 gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!hasChanges || saving || toggling}
            onClick={handleSave}
          >
            <Save className="size-4" />
            {t.adminUsers.save}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={user.is_active ? "destructive" : "outline"}
          disabled={saving || toggling}
          onClick={handleToggleActive}
        >
            {user.is_active ? t.adminUsers.disable : t.adminUsers.enable}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function AdminUsersContent() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<NonAdminUserRole | "">("");
  const [isActive, setIsActive] = useState<"all" | "active" | "disabled">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [pageSize, total]
  );

  const loadUsers = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await listAdminUsers({
        page,
        page_size: pageSize,
      });
      const normalizedSearch = search.trim().toLowerCase();
      const filteredUsers = response.filter((user) => {
        const matchesSearch =
          !normalizedSearch ||
          user.username.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch);
        const matchesRole = !role || user.role === role;
        const matchesStatus =
          isActive === "all" ||
          (isActive === "active" ? user.is_active : !user.is_active);

        return matchesSearch && matchesRole && matchesStatus;
      });
      const startIndex = (page - 1) * pageSize;
      setUsers(filteredUsers.slice(startIndex, startIndex + pageSize));
      setTotal(filteredUsers.length);
      setError(null);
    } catch (err) {
      if (!options?.silent) {
        setError(err instanceof Error ? err.message : t.adminUsers.loadFailed);
      }
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [isActive, page, pageSize, role, search, t.adminUsers.loadFailed]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadUsers({ silent: true });
      }
    }, ADMIN_REFRESH_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadUsers({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadUsers]);

  const handleUpdated = (updatedUser: AdminUser) => {
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <div className="space-y-6 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{t.adminUsers.kicker}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t.adminUsers.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              {t.adminUsers.description}
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadUsers()} disabled={loading}>
            <RefreshCw className="size-4" />
            {t.adminUsers.refresh}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.adminUsers.filterTitle}</CardTitle>
            <CardDescription>{t.adminUsers.filterDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
              <div className="space-y-2">
                <Label htmlFor="admin-user-search">{t.adminUsers.search}</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-user-search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                    placeholder={t.adminUsers.searchPlaceholder}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-user-role">{t.adminUsers.role}</Label>
                <Select
                  value={role || allRoleFilterValue}
                  onValueChange={(value) => {
                    setRole(value === allRoleFilterValue ? "" : (value as NonAdminUserRole));
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="admin-user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={allRoleFilterValue}>{t.adminUsers.allRoles}</SelectItem>
                    {nonAdminRoles.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-user-status">{t.adminUsers.status}</Label>
                <Select
                  value={isActive}
                  onValueChange={(value) => {
                    setIsActive(value as "all" | "active" | "disabled");
                    setPage(1);
                  }}
                >
                  <SelectTrigger id="admin-user-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.adminUsers.allStatuses}</SelectItem>
                    <SelectItem value="active">{t.adminUsers.active}</SelectItem>
                    <SelectItem value="disabled">{t.adminUsers.disabled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>{t.adminUsers.userList}</CardTitle>
            <CardDescription>{t.adminUsers.userSummary(total, page, totalPages)}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                {t.adminUsers.loadingUsers}
              </div>
            ) : users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.adminUsers.username}</TableHead>
                    <TableHead>{t.adminUsers.email}</TableHead>
                    <TableHead>{t.adminUsers.displayName}</TableHead>
                    <TableHead>{t.adminUsers.role}</TableHead>
                    <TableHead>{t.adminUsers.status}</TableHead>
                    <TableHead>{t.adminUsers.emailVerification}</TableHead>
                    <TableHead>{t.adminUsers.createdAt}</TableHead>
                    <TableHead>{t.adminUsers.lastLoginAt}</TableHead>
                    <TableHead>{t.adminUsers.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} onUpdated={handleUpdated} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                {t.adminUsers.noMatchedUsers}
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                {t.adminUsers.pageSize(pageSize)}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  {t.common.previousPage}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  {t.common.nextPage}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <RequireAuth>
      <AppShell>
        <RequireAdmin>
          <AdminUsersContent />
        </RequireAdmin>
      </AppShell>
    </RequireAuth>
  );
}
