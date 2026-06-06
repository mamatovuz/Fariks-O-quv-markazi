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
  marquee: {
    items: ["Matematika", "Ingliz tili", "Rus tili", "Fizika"],
  },
  results: {
    eyebrow: "Natijalar",
    title: "O'quvchilar",
    emphasis: "o'z so'zlari",
    suffix: "bilan.",
    stories: [
      {
        quote:
          "Birinchi yarim yilda IELTS 6.0 dan 7.5 ga ko'tarildim. Mock-imtihonlar haqiqiy testdan ham qiyinroq edi — shuning uchun test kuni xotirjam o'tirdim.",
        name: "Nodira A.",
        where: "Westminster International University",
      },
      {
        quote:
          "Matematika menga doim qiyin tuyulardi. Ustoz xato qilishdan qo'rqishni olib tashladi. Olimpiyadada birinchi joyni oldim.",
        name: "Sardor T.",
        where: "Prezident maktabi, 9-sinf",
      },
      {
        quote:
          "Bir yil ichida SAT'da 1190 dan 1480 ga keldim. Application essayni FARIKS jamoasi bilan birga yozdim.",
        name: "Diyora M.",
        where: "NYU Abu Dhabi · 2024",
      },
    ],
  },
  contact: {
    eyebrow: "Aloqa",
    title: "Bir suhbat -",
    emphasis: "hammasining",
    suffix: "boshlanishi.",
    leadLabel: "Aloqa",
    leadText: "Ariza yuboring, adminlar tez orada qo'ng'iroq qiladi",
    addressLabel: "Manzil",
    address: "Andijon viloyati, Qo'rg'ontepa tumani Hokimyat roparasida.",
    mapLabel: "Xaritada ko'rish",
    mapUrl: "https://maps.app.goo.gl/yYW1uQNSPN1BweEc8",
    hoursLabel: "Ish vaqti",
    hours: "Du - Sha, 09:00 - 20:00",
    formEyebrow: "Bepul sinov darsi uchun",
    formTitle: "Ariza qoldiring",
    nameLabel: "Ism",
    namePlaceholder: "Ism Familiya",
    phoneLabel: "Telefon",
    phonePlaceholder: "+998 __ ___ __ __",
    courseLabel: "Yo'nalish",
    detailsLabel: "Batafsil so'rov",
    detailsPlaceholder: "Qaysi kurs, darajangiz, qulay vaqt va qo'shimcha savollaringizni yozing",
    submitText: "Yuborish",
    sendingText: "Yuborilmoqda...",
    sentText: "Arizangiz yuborildi. Tez orada adminlar aloqaga chiqadi.",
  },
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
