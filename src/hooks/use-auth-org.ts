"use client";

import { useEffect, useState } from "react";
import { BETA_STAFF_ACCOUNTS, type BetaStaffAccount } from "@/lib/data/beta-institution-seed";
import type { ErpRole } from "@/types/erp-task";

export type CurrentOrg = {
  id: string;
  name: string;
  businessNumber: string;
  address: string;
};

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<BetaStaffAccount>(BETA_STAFF_ACCOUNTS[0]);

  useEffect(() => {
    const savedId = localStorage.getItem("silvercare.activeStaffId");
    if (savedId) {
      const found = BETA_STAFF_ACCOUNTS.find((s) => s.id === savedId);
      if (found) setCurrentUser(found);
    }
  }, []);

  return currentUser;
}

export function useOrganization(): CurrentOrg {
  return {
    id: "org-daycare-a",
    name: "행복주간보호센터 A",
    businessNumber: "124-82-94812",
    address: "서울특별시 강남구 테헤란로 124"
  };
}

export function usePermission(requiredRole?: ErpRole) {
  const currentUser = useCurrentUser();

  if (!requiredRole) return true;
  if (currentUser.roleCode === "manager") return true;
  return currentUser.roleCode === requiredRole;
}
