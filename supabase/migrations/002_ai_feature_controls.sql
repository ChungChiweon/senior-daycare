-- ========================================================
-- Migration: 002_ai_feature_controls.sql
-- Description: Table schema and RLS policies for AI Feature Kill Switches
-- ========================================================

CREATE TABLE IF NOT EXISTS public.ai_feature_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE, -- NULL means Global default
    feature_key VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    disabled_reason TEXT,
    disabled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    disabled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(organization_id, feature_key)
);

-- Enable RLS
ALTER TABLE public.ai_feature_controls ENABLE ROW LEVEL SECURITY;

-- Read policy: Staff can read global or their organization's feature controls
CREATE POLICY ai_feature_controls_read ON public.ai_feature_controls
    FOR SELECT
    USING (
        organization_id IS NULL 
        OR organization_id = public.current_organization_id()
    );

-- Modify policy: Only Managers / Super-Admins can update feature kill switches
CREATE POLICY ai_feature_controls_modify ON public.ai_feature_controls
    FOR ALL
    USING (
        organization_id = public.current_organization_id()
        AND EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('manager', 'super_admin')
        )
    );
