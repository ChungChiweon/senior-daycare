export type Resident = {
  id: string;
  name: string;
  initial: string;
  gender: "남" | "여";
  age: number;
  birthDate: string;
  grade: "1등급" | "2등급" | "3등급" | "4등급" | "5등급" | "인지지원등급";
  gradeLabel: string;
  careNumber: string; // 장기요양인정번호 L1234567890
  group: "A" | "B" | "C";
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  attendance: "입실" | "미입실" | "퇴실" | "결석";
  attendanceTime: string;
  shuttleRoute: string; // 예: "송영 1호차 (08:30)"
  healthStatus: "양호" | "건강이상" | "주의요망";
  bloodPressure: string;
  temperature: string;
  mealLunch: "전량" | "2/3" | "1/2" | "거부";
  mealSnack: "완료" | "미섭취";
  medication: "완료" | "해당없음" | "미투약";
  recordStatus: "작성완료" | "기록미작성" | "작성중";
  cautionNotes?: string;
  photoUrl?: string;
};

export type ProgramItem = {
  id: string;
  title: string;
  category: "신체활동" | "인지자극" | "정서지원" | "기능회복" | "여가/행사";
  instructor: string;
  time: string;
  targetCount: number;
  attendedCount: number;
  status: "예정" | "진행중" | "완료";
  description: string;
};

export type ApprovalItem = {
  id: string;
  title: string;
  category: "급여제공기록지" | "사례관리" | "프로그램계획" | "안전점검";
  author: string;
  role: string;
  date: string;
  status: "승인대기" | "승인완료" | "반려" | "수정요청";
  summary: string;
};

export const mockResidents: Resident[] = [
  {
    id: "res-01",
    name: "김순자",
    initial: "순자",
    gender: "여",
    age: 82,
    birthDate: "1944.03.15",
    grade: "3등급",
    gradeLabel: "3등급",
    careNumber: "L8230192301",
    group: "A",
    guardianName: "이철수",
    guardianRelation: "장남",
    guardianPhone: "010-2345-6789",
    attendance: "입실",
    attendanceTime: "08:45",
    shuttleRoute: "송영 1호차 (08:30)",
    healthStatus: "양호",
    bloodPressure: "120/80",
    temperature: "36.5℃",
    mealLunch: "전량",
    mealSnack: "완료",
    medication: "완료",
    recordStatus: "작성완료",
    cautionNotes: "고혈압 약 식후 즉시 복용, 좌측 무릎 관절염 주의"
  },
  {
    id: "res-02",
    name: "박용식",
    initial: "용식",
    gender: "남",
    age: 85,
    birthDate: "1941.07.22",
    grade: "2등급",
    gradeLabel: "2등급",
    careNumber: "L8123901239",
    group: "A",
    guardianName: "박미경",
    guardianRelation: "장녀",
    guardianPhone: "010-3456-7890",
    attendance: "입실",
    attendanceTime: "08:50",
    shuttleRoute: "송영 2호차 (08:40)",
    healthStatus: "건강이상",
    bloodPressure: "145/95",
    temperature: "37.2℃",
    mealLunch: "2/3",
    mealSnack: "완료",
    medication: "완료",
    recordStatus: "기록미작성",
    cautionNotes: "미열 관찰 필요, 보행 시 미끄럼 주의"
  },
  {
    id: "res-03",
    name: "이옥순",
    initial: "옥순",
    gender: "여",
    age: 79,
    birthDate: "1947.11.02",
    grade: "4등급",
    gradeLabel: "4등급",
    careNumber: "L8721309123",
    group: "B",
    guardianName: "김경태",
    guardianRelation: "사위",
    guardianPhone: "010-4567-8901",
    attendance: "입실",
    attendanceTime: "09:05",
    shuttleRoute: "송영 1호차 (08:50)",
    healthStatus: "양호",
    bloodPressure: "118/75",
    temperature: "36.4℃",
    mealLunch: "전량",
    mealSnack: "완료",
    medication: "해당없음",
    recordStatus: "작성완료"
  },
  {
    id: "res-04",
    name: "정동진",
    initial: "동진",
    gender: "남",
    age: 88,
    birthDate: "1938.05.19",
    grade: "1등급",
    gradeLabel: "1등급",
    careNumber: "L8012390182",
    group: "C",
    guardianName: "정수진",
    guardianRelation: "차녀",
    guardianPhone: "010-5678-9012",
    attendance: "입실",
    attendanceTime: "08:30",
    shuttleRoute: "송영 3호차 (08:15)",
    healthStatus: "주의요망",
    bloodPressure: "130/85",
    temperature: "36.6℃",
    mealLunch: "1/2",
    mealSnack: "미섭취",
    medication: "완료",
    recordStatus: "기록미작성",
    cautionNotes: "휠체어 이동 케어, 삼킴 곤란 증상 유의"
  },
  {
    id: "res-05",
    name: "최말자",
    initial: "말자",
    gender: "여",
    age: 84,
    birthDate: "1942.09.30",
    grade: "3등급",
    gradeLabel: "3등급",
    careNumber: "L8412390123",
    group: "B",
    guardianName: "최동수",
    guardianRelation: "아들",
    guardianPhone: "010-6789-0123",
    attendance: "입실",
    attendanceTime: "09:10",
    shuttleRoute: "송영 2호차 (08:55)",
    healthStatus: "양호",
    bloodPressure: "122/82",
    temperature: "36.5℃",
    mealLunch: "전량",
    mealSnack: "완료",
    medication: "완료",
    recordStatus: "작성중"
  },
  {
    id: "res-06",
    name: "강성호",
    initial: "성호",
    gender: "남",
    age: 81,
    birthDate: "1945.01.12",
    grade: "인지지원등급",
    gradeLabel: "인지지원",
    careNumber: "L8912301923",
    group: "A",
    guardianName: "강유진",
    guardianRelation: "딸",
    guardianPhone: "010-7890-1234",
    attendance: "미입실",
    attendanceTime: "-",
    shuttleRoute: "자진 등원",
    healthStatus: "양호",
    bloodPressure: "-",
    temperature: "-",
    mealLunch: "거부",
    mealSnack: "미섭취",
    medication: "미투약",
    recordStatus: "기록미작성",
    cautionNotes: "배회 가능성 높음, 센터 밖 이탈 감지 스티커 확인"
  }
];

export const mockPrograms: ProgramItem[] = [
  {
    id: "prog-01",
    title: "실버 건강체조 & 신체유연성 훈련",
    category: "신체활동",
    instructor: "김민지 강사",
    time: "10:30 ~ 11:30",
    targetCount: 12,
    attendedCount: 11,
    status: "완료",
    description: "어르신 소근육 유연성과 균형 감각 유지를 위한 의자 체조 및 스트레칭"
  },
  {
    id: "prog-02",
    title: "뇌자극 칠교놀이 & 추억 이야기 회상요법",
    category: "인지자극",
    instructor: "박지영 사회복지사",
    time: "14:00 ~ 15:00",
    targetCount: 10,
    attendedCount: 9,
    status: "진행중",
    description: "도형 맞추기를 통한 인지기능 자극 및 옛 시절 회상을 통한 정서 안정"
  },
  {
    id: "prog-03",
    title: "원예치료: 다육식물 화분 꾸미기",
    category: "정서지원",
    instructor: "이지은 원예치료사",
    time: "15:30 ~ 16:30",
    targetCount: 12,
    attendedCount: 0,
    status: "예정",
    description: "흙촉감과 식물 관찰을 통한 심리 정서적 치유 프로그램"
  }
];

export const mockApprovals: ApprovalItem[] = [
  {
    id: "appr-01",
    title: "2026년 7월 30일 급여제공기록지 일괄 결재",
    category: "급여제공기록지",
    author: "박지영",
    role: "사회복지사",
    date: "2026-07-30 17:30",
    status: "승인대기",
    summary: "김순자, 박용식 외 10명 어르신 당일 신체·인지·간호 케어 일지"
  },
  {
    id: "appr-02",
    title: "김순자 어르신 3분기 욕구평가 및 케어플랜 수립",
    category: "사례관리",
    author: "김민석",
    role: "사회복지사",
    date: "2026-07-29 16:15",
    status: "승인완료",
    summary: "신체 기능 변화에 따른 맞춤 운동 및 인지 프로그램 상향 변경건"
  },
  {
    id: "appr-03",
    title: "8월 어르신 월간 인지·신체 프로그램 계획서",
    category: "프로그램계획",
    author: "박지영",
    role: "사회복지사",
    date: "2026-07-28 14:00",
    status: "수정요청",
    summary: "야외 외부 강사 초빙 건 안전 관리 수칙 보완 요청"
  }
];
