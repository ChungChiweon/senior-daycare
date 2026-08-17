"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrganizationProfile, OrgRole } from "@/types/organization";

let cache: OrganizationProfile | null = null;
let membershipRoleCache: OrgRole | null = null;
let listeners: Array<(org: OrganizationProfile | null, role: OrgRole | null) => void> = [];

function notifyListeners(org: OrganizationProfile | null, role: OrgRole | null) {
  cache = org;
  membershipRoleCache = role;
  listeners.forEach((fn) => fn(org, role));
}

export function mutateOrganizationCache(updated: OrganizationProfile, role: OrgRole | null = membershipRoleCache) {
  notifyListeners(updated, role);
}

export type OrgProfileState =
  | { status: "loading"; org: null; role: null }
  | { status: "ready"; org: OrganizationProfile; role: OrgRole | null }
  | { status: "missing"; org: null; role: null }
  | { status: "error"; org: null; role: null; message: string };

type MembershipRow = {
  organization_id: string;
  role: OrgRole | null;
  organizations: OrganizationProfile | OrganizationProfile[] | null;
};

function normalizeOrganization(row: MembershipRow): OrganizationProfile | null {
  if (Array.isArray(row.organizations)) return row.organizations[0] ?? null;
  return row.organizations ?? null;
}

export function useOrganizationProfile(): OrgProfileState {
  const [state, setState] = useState<OrgProfileState>({ status: "loading", org: null, role: null });

  const load = useCallback(async () => {
    if (cache) {
      setState({ status: "ready", org: cache, role: membershipRoleCache });
    }

    const supabase = createClient();
    if (!supabase) {
      notifyListeners(null, null);
      setState({ status: "missing", org: null, role: null });
      return;
    }

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setState({ status: "error", org: null, role: null, message: authError.message });
        return;
      }

      if (!user?.id) {
        notifyListeners(null, null);
        setState({ status: "missing", org: null, role: null });
        return;
      }

      const { data, error } = await supabase
        .from("organization_memberships")
        .select(
          "organization_id, role, is_active, last_selected_at, organizations(id, name, business_number, facility_code, representative_name, phone, fax, email, address, logo_url, facility_type, capacity, operating_hours, website, created_at, updated_at)",
        )
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("is_active", { ascending: false })
        .order("last_selected_at", { ascending: false })
        .limit(1)
        .maybeSingle<MembershipRow>();

      if (error) {
        setState({ status: "error", org: null, role: null, message: error.message });
        return;
      }

      const org = data ? normalizeOrganization(data) : null;
      if (!org) {
        notifyListeners(null, null);
        setState({ status: "missing", org: null, role: null });
        return;
      }

      const role = data?.role ?? null;
      notifyListeners(org, role);
      setState({ status: "ready", org, role });
    } catch (error) {
      setState({
        status: "error",
        org: null,
        role: null,
        message: error instanceof Error ? error.message : "기관 정보를 불러오지 못했습니다.",
      });
    }
  }, []);

  useEffect(() => {
    void load();

    const listener = (org: OrganizationProfile | null, role: OrgRole | null) => {
      if (org) setState({ status: "ready", org, role });
      else setState({ status: "missing", org: null, role: null });
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  }, [load]);

  return state;
}
