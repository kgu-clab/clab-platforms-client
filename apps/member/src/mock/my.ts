import type { BookData } from "@/types/library";

export const MOCK_MY_BOOKS: BookData[] = [
  {
    id: 7,
    borrowerId: 1,
    borrowerName: "한유진",
    category: "교양",
    title: "서양음악의 이해 CLASSICS A toZ",
    author: "민은기,신혜승",
    publisher: "음악세계",
    imageUrl:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788966851287.jpg",
    dueDate: null,
    createdAt: "2024-05-13T10:41:09.176582",
    updatedAt: "2024-05-13T10:41:09.176582",
  },
  {
    id: 9,
    borrowerId: 1,
    borrowerName: "한유진",
    category: "프로그래밍",
    title: "1~100을 이용한 알고리즘의 이해(2)",
    author: "김득수",
    publisher: "21세기사",
    imageUrl:
      "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788984683822.jpg",
    dueDate: null,
    createdAt: "2024-05-13T10:41:09.176582",
    updatedAt: "2024-05-13T10:41:09.176582",
  },
];
