import teacher1 from "@/assets/teacher-1-color.jpg";
import teacher2 from "@/assets/teacher-2-color.jpg";
import teacher3 from "@/assets/teacher-3-color.jpg";
import { courses } from "./courses";

const defaultContent = {
  stats: [
    { number: "1,240", label: "Bitiruvchilar" },
    { number: "94%", label: "Oliygohga kirish" },
    { number: "9", label: "Yo'nalish" },
    { number: "12", label: "Ustoz" },
  ],
  coursesIntro: {
    eyebrow: "Yo'nalishlar",
    title: "Bir nechta kurs.",
    emphasis: "Bitta talab — sifat.",
    body: "Har bir guruhda 10 dan ortiq o'quvchi bo'lmaydi. Har bir o'quvchining individual o'sish jadvali yuritiladi.",
  },
  courses,
  teachers: [
    {
      img: teacher1,
      name: "Sherzod Karimov",
      role: "Bosh ustoz · Matematika",
      note: "20 yillik tajriba. Olimpiada g'oliblari ustozi.",
    },
    {
      img: teacher2,
      name: "Madina Rashidova",
      role: "IELTS · Speaking & Writing",
      note: "British Council sertifikati. Cambridge bitiruvchisi.",
    },
    {
      img: teacher3,
      name: "Bekzod Yusupov",
      role: "SAT · Math & Informatika",
      note: "MIT mock-kurs muallifi. 12 yillik mentorlik.",
    },
  ],
};

export { defaultContent };
