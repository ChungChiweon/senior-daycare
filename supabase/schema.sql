-- ========================================================
-- 주간보호센터 통합 ERP 멀티테넌트(Multi-Tenant) SaaS 데이터베이스 스키마
-- Engine: PostgreSQL / Supabase
-- Security: Row Level Security (RLS) enabled on all tables
-- ========================================================

-- 1. Organizations (기관 테이블)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    business_number VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    facility_code VARCHAR(50),
    representative_name VARCHAR(100),
    phone VARCHAR(30),
    fax VARCHAR(30),
    email VARCHAR(255),
    logo_url TEXT,
    facility_type VARCHAR(100) DEFAULT 'daycare_senior',
    capacity INTEGER,
    operating_hours VARCHAR(255),
    website VARCHAR(255),
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Users (직원 테이블)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    auth_id UUID UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'social_worker', 'clerk', 'nurse', 'field_staff', 'driver')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('facility_manager', 'organization_admin', 'manager', 'social_worker', 'care_worker', 'field_staff', 'nurse', 'clerk', 'driver', 'superadmin')),
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

-- 3. Residents (수급자 이용자 테이블)
CREATE TABLE IF NOT EXISTS public.residents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    grade VARCHAR(50) NOT NULL,
    guardian_data JSONB DEFAULT '{}'::jsonb,
    transport_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. RecordBlocks (원천 케어/관찰 기록)
CREATE TABLE IF NOT EXISTS public.record_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    visibility_scope VARCHAR(50) DEFAULT 'public' CHECK (visibility_scope IN ('public', 'internal_only', 'guardian_allowed')),
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Tasks (협업 업무 요청)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    resident_id UUID REFERENCES public.residents(id) ON DELETE SET NULL,
    requester_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unconfirmed' CHECK (status IN ('unconfirmed', 'confirmed', 'in_progress', 'support_needed', 'completion_requested', 'completed', 'deferred', 're_requested')),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Documents (20종 AI 생성 및 제출 문서)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    resident_id UUID REFERENCES public.residents(id) ON DELETE SET NULL,
    document_type VARCHAR(100) NOT NULL,
    source_block_ids UUID[] DEFAULT '{}',
    generated_text TEXT NOT NULL,
    edited_text TEXT,
    organization_snapshot JSONB DEFAULT NULL,
    approval_status VARCHAR(50) DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. AuditLogs (감사 기록 추적)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id UUID,
    before_data JSONB,
    after_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. RecordConflicts (AI 관찰 기록 충돌 감지)
CREATE TABLE IF NOT EXISTS public.record_conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    resident_id UUID NOT NULL REFERENCES public.residents(id) ON DELETE CASCADE,
    source_block_ids UUID[] NOT NULL,
    conflict_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'detected' CHECK (status IN ('detected', 'reviewing', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ========================================================
-- Row Level Security (RLS) Multi-Tenant Policies
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.record_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.record_conflicts ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organization_id
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

CREATE POLICY organization_memberships_self_read ON public.organization_memberships
    FOR SELECT
    USING (user_id = auth.uid() OR organization_id = public.current_organization_id());

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

-- RLS Policy for Residents
CREATE POLICY residents_tenant_isolation ON public.residents
    FOR ALL
    USING (organization_id = public.current_organization_id())
    WITH CHECK (organization_id = public.current_organization_id());

-- RLS Policy for RecordBlocks
CREATE POLICY record_blocks_tenant_isolation ON public.record_blocks
    FOR ALL
    USING (organization_id = public.current_organization_id())
    WITH CHECK (organization_id = public.current_organization_id());

-- RLS Policy for Tasks
CREATE POLICY tasks_tenant_isolation ON public.tasks
    FOR ALL
    USING (organization_id = public.current_organization_id())
    WITH CHECK (organization_id = public.current_organization_id());

-- RLS Policy for Documents
CREATE POLICY documents_tenant_isolation ON public.documents
    FOR ALL
    USING (organization_id = public.current_organization_id())
    WITH CHECK (organization_id = public.current_organization_id());

-- RLS Policy for RecordConflicts
CREATE POLICY record_conflicts_tenant_isolation ON public.record_conflicts
    FOR ALL
    USING (organization_id = public.current_organization_id())
    WITH CHECK (organization_id = public.current_organization_id());
