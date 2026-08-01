import { createClient } from "@/lib/supabase/client";
import type {
  ErpOrganization,
  ErpResidentModel,
  ErpUser,
  IErpRepository
} from "./interfaces";
import type { BlockType, RecordBlock, VisibilityScope } from "@/types/record-block";
import type { ErpTask, ErpTaskStatus } from "@/types/erp-task";

export class SupabaseRepository implements IErpRepository {
  private client = createClient();

  async getOrganization(orgId: string): Promise<ErpOrganization | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      businessNumber: data.business_number,
      address: data.address,
      createdAt: data.created_at
    };
  }

  async getUsers(orgId: string): Promise<ErpUser[]> {
    if (!this.client) return [];
    const { data, error } = await this.client
      .from("users")
      .select("*")
      .eq("organization_id", orgId);

    if (error || !data) return [];
    return data.map((u) => ({
      id: u.id,
      organizationId: u.organization_id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status
    }));
  }

  async getResidents(orgId: string): Promise<ErpResidentModel[]> {
    if (!this.client) return [];
    const { data, error } = await this.client
      .from("residents")
      .select("*")
      .eq("organization_id", orgId);

    if (error || !data) return [];
    return data.map((r) => ({
      id: r.id,
      organizationId: r.organization_id,
      name: r.name,
      birthDate: r.birth_date,
      grade: r.grade,
      guardianData: r.guardian_data || {},
      transportData: r.transport_data || {}
    }));
  }

  async getRecordBlocks(orgId: string, residentId?: string): Promise<RecordBlock[]> {
    if (!this.client) return [];
    let query = this.client.from("record_blocks").select("*").eq("organization_id", orgId);
    if (residentId) {
      query = query.eq("resident_id", residentId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((b) => ({
      id: b.id,
      residentId: b.resident_id,
      blockType: b.block_type as BlockType,
      sourceType: "individual" as const,
      sourceData: {},
      author: "요양보호사",
      title: b.block_type,
      editedText: b.content,
      aiDraft: b.content,
      reviewStatus: "approved" as const,
      visibilityScope: b.visibility_scope as VisibilityScope,
      version: 1,
      createdAt: b.created_at,
      updatedAt: b.created_at
    }));
  }

  async saveRecordBlock(orgId: string, block: RecordBlock): Promise<RecordBlock> {
    if (!this.client) return block;
    const { data, error } = await this.client
      .from("record_blocks")
      .insert({
        organization_id: orgId,
        resident_id: block.residentId,
        block_type: block.blockType,
        content: block.editedText || block.aiDraft,
        visibility_scope: block.visibilityScope
      })
      .select()
      .single();

    if (error || !data) throw error;
    return block;
  }

  async getTasks(orgId: string): Promise<ErpTask[]> {
    if (!this.client) return [];
    const { data, error } = await this.client
      .from("tasks")
      .select("*")
      .eq("organization_id", orgId);

    if (error || !data) return [];
    return data.map((t) => ({
      requestId: t.id,
      title: t.title,
      content: t.content,
      requesterName: "요양보호사",
      requesterRole: "field_staff",
      assigneeName: "사회복지사",
      assigneeRole: "social_worker",
      taskCategory: "general",
      priority: "normal",
      requestedAt: t.created_at,
      dueDate: t.due_date || "",
      status: t.status as ErpTaskStatus,
      history: [],
      comments: []
    }));
  }

  async saveTask(orgId: string, task: ErpTask): Promise<ErpTask> {
    if (!this.client) return task;
    const { error } = await this.client.from("tasks").insert({
      organization_id: orgId,
      title: task.title,
      content: task.content,
      status: task.status,
      due_date: task.dueDate || null
    });

    if (error) throw error;
    return task;
  }
}
