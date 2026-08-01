import type { ErpRole } from "@/types/erp-task";

export type BetaResident = {
  id: string;
  name: string;
  age: number;
  gender: "남" | "여";
  careGrade: string;
  careNumber: string;
  shuttleRoute: "1호차 (강남/역삼)" | "2호차 (서초/방배)";
  attendanceStatus: "등원완료" | "미등원" | "하원완료" | "병원외출";
  healthCondition: "안정" | "관찰필요" | "주의";
  cautionNote: string;
  assignedGroup: "1그룹 (인지재활)" | "2그룹 (신체기능)" | "3그룹 (집중케어)";
};

export type BetaStaffAccount = {
  id: string;
  name: string;
  roleCode: ErpRole | "driver";
  roleLabel: string;
  title: string;
  permissions: string[];
  assignedTaskCount: number;
  mobileOnly?: boolean;
};

// 35 Registered Senior Residents for Daycare Center A
export const BETA_RESIDENTS: BetaResident[] = Array.from({ length: 35 }).map((_, idx) => {
  const num = idx + 1;
  const grades = ["1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"];
  const names = [
    "김순자", "박영수", "이정자", "최상철", "정경숙",
    "강옥순", "조성호", "윤명자", "장길동", "임복순",
    "한재석", "오인숙", "서동현", "신갑순", "권오성",
    "황선자", "안병철", "송영희", "전종수", "홍순옥",
    "고재필", "문정애", "양동근", "손옥자", "배성태",
    "백순이", "허만복", "유경희", "남궁옥", "심재관",
    "노옥남", "하상호", "곽정순", "성동일", "차순애"
  ];

  return {
    id: `res-${num.toString().padStart(2, "0")}`,
    name: names[idx % names.length],
    age: 78 + (idx % 12),
    gender: idx % 2 === 0 ? "여" : "남",
    careGrade: `${grades[idx % grades.length]} (장기요양)`,
    careNumber: `L00${(9384710 + idx * 173).toString()}`,
    shuttleRoute: idx % 2 === 0 ? "1호차 (강남/역삼)" : "2호차 (서초/방배)",
    attendanceStatus: idx === 3 ? "미등원" : idx === 7 ? "병원외출" : "등원완료",
    healthCondition: idx % 5 === 0 ? "관찰필요" : idx % 11 === 0 ? "주의" : "안정",
    cautionNote: idx % 5 === 0 ? "우측 무릎 관절통 관찰 및 이동시 부축" : idx % 11 === 0 ? "식사 시 씹기 어려움, 식사 조력 필요" : "특이사항 없이 자발적 참여 우수",
    assignedGroup: idx % 3 === 0 ? "1그룹 (인지재활)" : idx % 3 === 1 ? "2그룹 (신체기능)" : "3그룹 (집중케어)"
  };
});

// 15 Staff Accounts for Daycare Center A
export const BETA_STAFF_ACCOUNTS: BetaStaffAccount[] = [
  {
    id: "staff-01",
    name: "김철수",
    roleCode: "manager",
    roleLabel: "시설장",
    title: "센터장 / 원장",
    permissions: ["전체현황", "전자결재", "리스크센터", "직원근태", "평가감사"],
    assignedTaskCount: 3
  },
  {
    id: "staff-02",
    name: "박지영",
    roleCode: "social_worker",
    roleLabel: "사회복지사 (선임)",
    title: "팀장 / 사례관리",
    permissions: ["이용자관리", "사례관리", "AI문서생성", "보호자소통", "프로그램"],
    assignedTaskCount: 5
  },
  {
    id: "staff-03",
    name: "이복지",
    roleCode: "social_worker",
    roleLabel: "사회복지사 (주임)",
    title: "프로그램 담당",
    permissions: ["이용자관리", "프로그램", "AI문서생성", "알림장발송"],
    assignedTaskCount: 2
  },
  {
    id: "staff-04",
    name: "최사무",
    roleCode: "clerk",
    roleLabel: "사무원",
    title: "행정주임 / 수납",
    permissions: ["수납청구", "본인부담금", "계약서관리", "시설비품"],
    assignedTaskCount: 1
  },
  {
    id: "staff-05",
    name: "이간호",
    roleCode: "nurse",
    roleLabel: "간호조무사",
    title: "간호주임 / 건강",
    permissions: ["바이탈측정", "투약관리", "물리치료", "간호일지"],
    assignedTaskCount: 4
  },
  {
    id: "staff-06",
    name: "김송영",
    roleCode: "field_staff",
    roleLabel: "요양보호사 (조장)",
    title: "1그룹 수성담당",
    permissions: ["모바일케어입력", "현장인수인계", "특이사항작성"],
    assignedTaskCount: 2,
    mobileOnly: true
  },
  {
    id: "staff-07",
    name: "정요양",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "1그룹 생활지원",
    permissions: ["모바일케어입력", "현장인수인계"],
    assignedTaskCount: 1,
    mobileOnly: true
  },
  {
    id: "staff-08",
    name: "박돌봄",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "2그룹 수성담당",
    permissions: ["모바일케어입력", "현장인수인계"],
    assignedTaskCount: 1,
    mobileOnly: true
  },
  {
    id: "staff-09",
    name: "한케어",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "2그룹 생활지원",
    permissions: ["모바일케어입력", "현장인수인계"],
    assignedTaskCount: 0,
    mobileOnly: true
  },
  {
    id: "staff-10",
    name: "조수성",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "3그룹 수성담당",
    permissions: ["모바일케어입력", "현장인수인계"],
    assignedTaskCount: 1,
    mobileOnly: true
  },
  {
    id: "staff-11",
    name: "오생활",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "3그룹 생활지원",
    permissions: ["모바일케어입력", "현장인수인계"],
    assignedTaskCount: 0,
    mobileOnly: true
  },
  {
    id: "staff-12",
    name: "윤위생",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "위생/급식지원",
    permissions: ["모바일케어입력", "식사기록"],
    assignedTaskCount: 0,
    mobileOnly: true
  },
  {
    id: "staff-13",
    name: "강안전",
    roleCode: "field_staff",
    roleLabel: "요양보호사",
    title: "송영보조원",
    permissions: ["송영승하차", "모바일케어입력"],
    assignedTaskCount: 0,
    mobileOnly: true
  },
  {
    id: "staff-14",
    name: "김운전",
    roleCode: "driver",
    roleLabel: "운전원 (1호차)",
    title: "1호차 기사님",
    permissions: ["송영운행", "차량안전점검"],
    assignedTaskCount: 1
  },
  {
    id: "staff-15",
    name: "박차량",
    roleCode: "driver",
    roleLabel: "운전원 (2호차)",
    title: "2호차 기사님",
    permissions: ["송영운행", "차량안전점검"],
    assignedTaskCount: 1
  }
];
