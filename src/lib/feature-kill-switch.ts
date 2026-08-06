import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";

export type AiFeatureKey =
  | "today_brief"
  | "consultation_summary"
  | "record_reuse"
  | "case_conference_preparation"
  | "document_draft"
  | "end_of_day_summary";

export type AiFeatureControlRecord = {
  id: string;
  organization_id: string | null;
  feature_key: AiFeatureKey;
  enabled: boolean;
  disabled_reason?: string;
  disabled_by?: string;
  disabled_at?: string;
  created_at: string;
  updated_at: string;
};

// In-memory fallback state if offline / DB query fails
const DEFAULT_FEATURE_STATE: Record<AiFeatureKey, boolean> = {
  today_brief: true,
  consultation_summary: true,
  record_reuse: true,
  case_conference_preparation: true,
  document_draft: true,
  end_of_day_summary: true
};

class FeatureKillSwitchManager {
  private localOverrides: Record<string, Record<AiFeatureKey, boolean>> = {};

  /**
   * Check if an AI feature is enabled for an organization.
   * Priority: Global Disabled -> Org Disabled -> Default Enabled
   * Safety Guard: Fail-Closed on Database Query Exceptions!
   */
  async isFeatureEnabledAsync(orgId: string, featureKey: AiFeatureKey): Promise<boolean> {
    if (!hasSupabaseEnv()) {
      return this.resolveLocalPriority(orgId, featureKey);
    }

    try {
      const supabase = createClient();
      if (!supabase) return false; // Fail-Closed

      // Query DB for global or org-specific feature controls
      const { data, error } = await supabase
        .from("ai_feature_controls")
        .select("*")
        .or(`organization_id.is.null,organization_id.eq.${orgId}`)
        .eq("feature_key", featureKey);

      if (error) {
        console.error(`[KillSwitch Fail-Closed] DB query error for feature '${featureKey}':`, error);
        return false; // Fail-Closed: Query failure disables AI feature safely
      }

      if (!data || data.length === 0) {
        return DEFAULT_FEATURE_STATE[featureKey] ?? true;
      }

      // Priority 1: Check Global Disable (organization_id === null)
      const globalControl = data.find((r: AiFeatureControlRecord) => r.organization_id === null);
      if (globalControl && !globalControl.enabled) {
        return false;
      }

      // Priority 2: Check Org-specific Disable
      const orgControl = data.find((r: AiFeatureControlRecord) => r.organization_id === orgId);
      if (orgControl && !orgControl.enabled) {
        return false;
      }

      return true;
    } catch (err) {
      console.error(`[KillSwitch Fail-Closed] Unexpected exception checking '${featureKey}':`, err);
      return false; // Fail-Closed
    }
  }

  /**
   * Sync check using local override state (for instantaneous UI checks)
   */
  isFeatureEnabled(orgId: string, featureKey: AiFeatureKey): boolean {
    return this.resolveLocalPriority(orgId, featureKey);
  }

  private resolveLocalPriority(orgId: string, featureKey: AiFeatureKey): boolean {
    const orgState = this.localOverrides[orgId];
    if (!orgState) return DEFAULT_FEATURE_STATE[featureKey] ?? true;
    return orgState[featureKey] ?? DEFAULT_FEATURE_STATE[featureKey] ?? true;
  }

  /**
   * Toggle Kill Switch for an organization
   */
  setFeatureEnabled(orgId: string, featureKey: AiFeatureKey, enabled: boolean): void {
    if (!this.localOverrides[orgId]) {
      this.localOverrides[orgId] = { ...DEFAULT_FEATURE_STATE };
    }
    this.localOverrides[orgId][featureKey] = enabled;
    console.warn(`[Kill Switch Triggered] Org '${orgId}' feature '${featureKey}' set to: ${enabled}`);
  }
}

export const FeatureKillSwitchStore = new FeatureKillSwitchManager();
