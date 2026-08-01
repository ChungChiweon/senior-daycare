import type { RecordBlock } from "@/types/record-block";
import type { ErpTask } from "@/types/erp-task";

export type ErpOrganization = {
  id: string;
  name: string;
  businessNumber: string;
  address?: string;
  createdAt: string;
};

export type ErpUser = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: "manager" | "social_worker" | "clerk" | "nurse" | "field_staff" | "driver";
  status: "active" | "invited" | "suspended";
};

export type ErpResidentModel = {
  id: string;
  organizationId: string;
  name: string;
  birthDate: string;
  grade: string;
  guardianData: Record<string, unknown>;
  transportData: Record<string, unknown>;
};

export interface IErpRepository {
  getOrganization(orgId: string): Promise<ErpOrganization | null>;
  getUsers(orgId: string): Promise<ErpUser[]>;
  getResidents(orgId: string): Promise<ErpResidentModel[]>;
  getRecordBlocks(orgId: string, residentId?: string): Promise<RecordBlock[]>;
  saveRecordBlock(orgId: string, block: RecordBlock): Promise<RecordBlock>;
  getTasks(orgId: string): Promise<ErpTask[]>;
  saveTask(orgId: string, task: ErpTask): Promise<ErpTask>;
}
