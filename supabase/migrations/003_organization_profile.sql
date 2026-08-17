-- ============================================================
-- 003: Multi-tenant organization profile and memberships
-- ============================================================
-- Authoritative organization display flow:
--   auth.uid()
--   -> public.organization_memberships
--   -> active organization_id
--   -> public.organizations
-- ============================================================

ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS facility_code        VARCHAR(50),
  ADD COLUMN IF NOT EXISTS representative_name  VARCHAR(100),
  ADD COLUMN IF NOT EXISTS phone                VARCHAR(30),
  ADD COLUMN IF NOT EXISTS fax                  VARCHAR(30),
  ADD COLUMN IF NOT EXISTS email                VARCHAR(255),
  ADD COLUMN IF NOT EXISTS logo_url             TEXT,
  ADD COLUMN IF NOT EXISTS facility_type        VARCHAR(100) DEFAULT 'daycare_senior',
  ADD COLUMN IF NOT EXISTS capacity             INTEGER,
  ADD COLUMN IF NOT EXISTS operating_hours      VARCHAR(255),
  ADD COLUMN IF NOT EXISTS website              VARCHAR(255),
  ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT now();

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

CREATE TABLE IF NOT EXISTS public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (
    role IN (
      'facility_manager',
      'organization_admin',
      'manager',
      'social_worker',
      'care_worker',
      'field_staff',
      'nurse',
      'clerk',
      'driver',
      'superadmin'
    )
  ),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
  is_active BOOLEAN NOT NULL DEFAULT false,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  last_selected_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_org_memberships_user_active
  ON public.organization_memberships (user_id, status, is_active DESC, last_selected_at DESC);

CREATE INDEX IF NOT EXISTS idx_org_memberships_org_role
  ON public.organization_memberships (organization_id, role, status);

ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_organization_id()
RETURNS UUID AS $$
  SELECT organization_id
  FROM public.organization_memberships
  WHERE user_id = auth.uid()
    AND status = 'active'
  ORDER BY is_active DESC, last_selected_at DESC, created_at ASC
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_organization_role()
RETURNS TEXT AS $$
  SELECT role
  FROM public.organization_memberships
  WHERE user_id = auth.uid()
    AND organization_id = public.current_organization_id()
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

DROP POLICY IF EXISTS organization_memberships_self_read ON public.organization_memberships;
CREATE POLICY organization_memberships_self_read ON public.organization_memberships
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR organization_id = public.current_organization_id()
  );

DROP POLICY IF EXISTS organization_memberships_admin_write ON public.organization_memberships;
CREATE POLICY organization_memberships_admin_write ON public.organization_memberships
  FOR ALL
  USING (
    organization_id = public.current_organization_id()
    AND public.current_organization_role() IN ('facility_manager', 'organization_admin', 'manager', 'superadmin')
  )
  WITH CHECK (
    organization_id = public.current_organization_id()
    AND public.current_organization_role() IN ('facility_manager', 'organization_admin', 'manager', 'superadmin')
  );

DROP POLICY IF EXISTS organizations_tenant_read ON public.organizations;
CREATE POLICY organizations_tenant_read ON public.organizations
  FOR SELECT
  USING (
    id IN (
      SELECT organization_id
      FROM public.organization_memberships
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

DROP POLICY IF EXISTS organizations_tenant_write ON public.organizations;
CREATE POLICY organizations_tenant_write ON public.organizations
  FOR UPDATE
  USING (
    id = public.current_organization_id()
    AND public.current_organization_role() IN ('facility_manager', 'organization_admin', 'manager', 'superadmin')
  )
  WITH CHECK (
    id = public.current_organization_id()
    AND public.current_organization_role() IN ('facility_manager', 'organization_admin', 'manager', 'superadmin')
  );

ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS organization_snapshot JSONB DEFAULT NULL;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS organizations_updated_at ON public.organizations;
CREATE TRIGGER organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS organization_memberships_updated_at ON public.organization_memberships;
CREATE TRIGGER organization_memberships_updated_at
  BEFORE UPDATE ON public.organization_memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.organizations (id, name, business_number, facility_type, address, phone)
  VALUES
    ('00000000-0000-0000-0000-000000000001', '늘봄주간보호센터', '124-82-00001', 'daycare_senior', '서울특별시 강남구 테헤란로 123', '02-0000-0001'),
    ('00000000-0000-0000-0000-000000000002', '사랑채데이케어센터', '124-82-00002', 'daycare_senior', '서울특별시 서초구 서초대로 456', '02-0000-0002')
  ON CONFLICT (id) DO NOTHING;
