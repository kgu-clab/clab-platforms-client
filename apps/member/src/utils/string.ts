const SOURCE_MAP: Record<string, string> = {
  "yozm.wishket.com": "요즘IT",
  "techcrunch.com": "TechCrunch",
  "itworld.co.kr": "ITWorld",
  "velog.io": "velog",
  "toss.tech": "토스 기술블로그",
  "engineering.linecorp.com": "LINE Engineering",
  "d2.naver.com": "Naver D2",
  "tech.kakao.com": "카카오 기술블로그",
  "woowahan.com": "우아한형제들",
  "medium.com": "Medium",
  "dev.to": "DEV",
};

const CAREER_LEVEL_LABEL: Record<string, string> = {
  FRESHMAN: "신입",
  EXPERIENCED: "경력",
  NOT_SPECIFIED: "무관",
};

const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  FULL_TIME: "정규직",
  CONTRACT: "계약직",
  INTERN: "인턴",
  ASSISTANT: "어시스턴트",
  PART_TIME: "파트타임",
};

export function getCareerLevelLabel(value: string): string {
  return CAREER_LEVEL_LABEL[value] ?? value;
}

export function getEmploymentTypeLabel(value: string): string {
  return EMPLOYMENT_TYPE_LABEL[value] ?? value;
}

export function getSourceFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return SOURCE_MAP[hostname] ?? hostname;
  } catch {
    return url;
  }
}
