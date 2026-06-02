const courses = [
  {
    slug: "ingliz-tili-foundation",
    no: "01",
    title: "Ingliz tili \u2014 Foundation",
    tagline: "Noldan suhbatga: A1 dan B1 darajaga.",
    blurb:
      "Grammatika asoslari, kundalik nutq va o'qish ko'nikmasi. Har bir darsda yozma va og'zaki amaliyot.",
    level: "A1 \u2192 B1",
    duration: "8 oy",
    schedule: "Haftada 3 dars \xB7 90 daqiqadan",
    groupSize: "8\u201310 o'quvchi",
    price: "590 000 so'm / oy",
    priceNote: "Birinchi dars bepul. Aka-uka chegirmasi 10%.",
    program: [
      {
        week: "1\u20134 hafta",
        title: "Tovushlar va asosiy grammatika",
        body: "Alfavit, fonetika, Present Simple/Continuous, shaxs olmoshlari.",
      },
      {
        week: "5\u201310 hafta",
        title: "Kundalik suhbat",
        body: "Tanishuv, oila, ish, sayohat mavzusida 200+ ibora va dialoglar.",
      },
      {
        week: "11\u201318 hafta",
        title: "O'tgan va kelasi zamonlar",
        body: "Past Simple, Present Perfect, Future formalari \u2014 yozma topshiriqlar bilan.",
      },
      {
        week: "19\u201328 hafta",
        title: "Mustaqil o'qish va yozish",
        body: "Qisqa esselar, gazeta materiallari, audio tushunish (B1).",
      },
      {
        week: "29\u201332 hafta",
        title: "Speaking marafon",
        body: "Haftalik ochiq suhbat klublari, mock-intervyu.",
      },
    ],
    outcomes: [
      "Kundalik mavzularda erkin suhbat",
      "B1 darajadagi yozma va og'zaki nutq",
      "IELTS / kelgusi kurslarga to'liq tayyorlik",
    ],
    faqs: [
      {
        q: "Noldan boshlasam bo'ladimi?",
        a: "Ha. Foundation kursi A1 dan boshlanadi, oldindan bilim talab qilmaymiz.",
      },
      {
        q: "Dars qoldirsam nima bo'ladi?",
        a: "Har bir darsning audio yozuvi va daftari sizga yuboriladi, keyingi darsdan oldin mentor bilan 15 daqiqalik qisqa takror tashkil etiladi.",
      },
      {
        q: "Sertifikat beriladimi?",
        a: "Kurs yakunida ichki imtihon natijasi bo'yicha FARIKS sertifikati beriladi.",
      },
    ],
  },
  {
    slug: "ielts-academic",
    no: "02",
    title: "IELTS Academic",
    tagline: "7.5+ \u2014 band-by-band tayyorlov.",
    blurb:
      "Real test sharoitidagi haftalik mock-imtihonlar. Yozma va og'zaki bo'limga shaxsiy mentor.",
    level: "B1 \u2192 7.5+",
    duration: "6 oy",
    schedule: "Haftada 4 dars \xB7 120 daqiqadan",
    groupSize: "6\u20138 o'quvchi",
    price: "1 200 000 so'm / oy",
    priceNote: "Mock imtihonlar narxga kiritilgan. Kitoblar alohida.",
    program: [
      {
        week: "1-oy",
        title: "Diagnostika va strategiya",
        body: "Boshlang'ich mock, har bir bo'lim bo'yicha shaxsiy zaif nuqtalar xaritasi.",
      },
      {
        week: "2-oy",
        title: "Reading & Listening texnikalari",
        body: "Skimming, scanning, paraphrasing, distractor tanish.",
      },
      {
        week: "3-oy",
        title: "Writing Task 1 & 2",
        body: "Grafik tahlili, argumentli esse strukturasi, har hafta yozma feedback.",
      },
      {
        week: "4-oy",
        title: "Speaking \u2014 Part 1, 2, 3",
        body: "Fluency, lexical resource, pronunciation. Haftada 2 ta yakka-yakka session.",
      },
      {
        week: "5-oy",
        title: "Haftalik to'liq mock",
        body: "Real timing bilan. Har biridan keyin batafsil tahlil.",
      },
      {
        week: "6-oy",
        title: "Final tayyorgarlik",
        body: "Imtihonga ro'yxatdan o'tish, oxirgi yumshatish va kayfiyat darslari.",
      },
    ],
    outcomes: [
      "Band 7.5+ ga mo'ljallangan strategiya",
      "Yozma ishlarga professional feedback",
      "Speaking bo'yicha o'ziga ishonch",
    ],
    faqs: [
      {
        q: "Boshlang'ich darajam B1 dan past, qabul qilasizmi?",
        a: "Pre-IELTS yo'nalishimiz mavjud \u2014 diagnostika so'ng eng to'g'ri guruh tavsiya qilinadi.",
      },
      {
        q: "Yozma ishlar qachon va qanday baholanadi?",
        a: "Har hafta 1 ta Task 1 va 1 ta Task 2. 48 soat ichida batafsil rubrik bo'yicha feedback.",
      },
      {
        q: "Ro'yxatdan o'tishda yordam berasizmi?",
        a: "Ha. British Council va IDP orqali ro'yxatdan o'tishda mentor yordam beradi.",
      },
    ],
  },
  {
    slug: "sat-oliygohga-tayyorlov",
    no: "03",
    title: "SAT & oliygohga tayyorlov",
    tagline: "1450+ va kuchli application paketi.",
    blurb:
      "Matematika va Reading bo'yicha alohida mashg'ulotlar. Application essay konsultatsiyasi.",
    level: "1100 \u2192 1450+",
    duration: "10 oy",
    schedule: "Haftada 5 dars \xB7 SAT Math + Reading + Essay",
    groupSize: "6 o'quvchi",
    price: "1 800 000 so'm / oy",
    priceNote: "Application essay konsultatsiyasi alohida paket sifatida ham mavjud.",
    program: [
      {
        week: "1\u20132 oy",
        title: "Diagnostika va asoslar",
        body: "Reading & Writing va Math diagnostika, zaif mavzular xaritasi.",
      },
      {
        week: "3\u20135 oy",
        title: "Math \u2014 Algebra, Geometry, Data",
        body: "Bluebook texnikalari, kalkulyator va qog'oz strategiyalari.",
      },
      {
        week: "6\u20137 oy",
        title: "Reading & Writing",
        body: "Passage strategiyalari, grammatika, rhetoric.",
      },
      { week: "8\u20139 oy", title: "Haftalik full mock", body: "Real timing, statistik tahlil." },
      {
        week: "10-oy",
        title: "Application",
        body: "Common App, Personal Statement, supplemental esselar.",
      },
    ],
    outcomes: [
      "1450+ ga mo'ljallangan strategiya",
      "3 ta tayyor application essay",
      "Top universitetlarga hujjat topshirishda mentor",
    ],
    faqs: [
      {
        q: "Qaysi oliygohlarga tayyorlaysizlar?",
        a: "AQSh, Buyuk Britaniya, Janubiy Koreya va Markaziy Osiyo top universitetlari uchun.",
      },
      {
        q: "Stipendiya bo'yicha yordam beriladimi?",
        a: "Ha \u2014 financial aid hujjatlari to'ldirishda alohida mashg'ulot mavjud.",
      },
      {
        q: "Mock SAT qanchadan o'tkaziladi?",
        a: "9\u201310 oy davomida jami 8 ta to'liq mock, har biri tahlili bilan.",
      },
    ],
  },
  {
    slug: "matematika-chuqurlashtirilgan",
    no: "04",
    title: "Matematika \u2014 chuqurlashtirilgan",
    tagline: "Olimpiadalar uchun zamonaviy matematika.",
    blurb:
      "Maktab dasturidan oldin yuradigan, olimpiadaga yo'naltirilgan algebra va geometriya kursi.",
    level: "5\u201311-sinf",
    duration: "Yil davomida",
    schedule: "Haftada 3 dars \xB7 100 daqiqa",
    groupSize: "10 o'quvchi",
    price: "700 000 so'm / oy",
    priceNote: "Olimpiadachilar uchun individual mashg'ulotlar alohida narxda.",
    program: [
      {
        week: "Sentabr\u2013oktabr",
        title: "Algebra asoslari",
        body: "Tenglamalar, sistemalar, ko'rinishlar, ratsional ifoda.",
      },
      {
        week: "Noyabr\u2013dekabr",
        title: "Sonli nazariya",
        body: "Bo'linish, qoldiqlar, Diofant tenglamalar \u2014 olimpiada uslubida.",
      },
      {
        week: "Yanvar\u2013fevral",
        title: "Planimetriya",
        body: "Aylana, uchburchak, vektorlar; tartibli isbotlash madaniyati.",
      },
      { week: "Mart\u2013aprel", title: "Kombinatorika", body: "Sanash, ehtimollik, induksiya." },
      {
        week: "May",
        title: "Olimpiadalar haftasi",
        body: "Respublika va xalqaro olimpiadalarga mashg'ulot va tahlil.",
      },
    ],
    outcomes: [
      "Maktab dasturidan kamida 1 yil oldinda",
      "Olimpiadalarda mukofotli o'rinlar uchun baza",
      "Isbotlash madaniyati va aniq fikrlash",
    ],
    faqs: [
      {
        q: "Sinfdan ortda qolyapman, qabul qilasizmi?",
        a: 'Diagnostika asosida "yetishuv" guruhi tavsiya etiladi.',
      },
      {
        q: "Olimpiadaga tayyorlanmoqchiman, alohida yordam bormi?",
        a: "Ha \u2014 haftada 1 marta yakka-yakka mentor mashg'uloti tashkil etiladi.",
      },
      {
        q: "Vazifalar qancha bo'ladi?",
        a: "Haftada 8\u201312 ta masala, har biri tekshiriladi va xato daftariga yoziladi.",
      },
    ],
  },
  {
    slug: "prezident-maktabi-tayyorlov",
    no: "05",
    title: "Prezident maktabi \xB7 tayyorlov",
    tagline: "5 va 8-sinf imtihonlariga tizimli tayyorgarlik.",
    blurb: "Kirish imtihonining barcha bosqichlariga moslashgan, sinov asosidagi tizimli kurs.",
    level: "5, 8-sinf",
    duration: "9 oy",
    schedule: "Haftada 4 dars \xB7 Math + Logic + Language",
    groupSize: "8 o'quvchi",
    price: "900 000 so'm / oy",
    priceNote: "Sinov imtihonlari va materiallar narxga kirgan.",
    program: [
      {
        week: "1-oy",
        title: "Diagnostika",
        body: "Har uch yo'nalish bo'yicha boshlang'ich test va xato xaritasi.",
      },
      {
        week: "2\u20134 oy",
        title: "Math & Logic asoslari",
        body: "Mantiqiy masalalar, sonli ketma-ketliklar, kombinatorika asoslari.",
      },
      {
        week: "5\u20136 oy",
        title: "Til va o'qish",
        body: "Matn tushunish, ona tili va ingliz tili bo'yicha format.",
      },
      {
        week: "7\u20138 oy",
        title: "Mock imtihonlar",
        body: "Real format va vaqt bo'yicha 6 ta to'liq sinov.",
      },
      {
        week: "9-oy",
        title: "Yakuniy tayyorgarlik",
        body: "Stress menejment, hujjat topshirish, interview.",
      },
    ],
    outcomes: [
      "Imtihon formatiga to'liq moslashish",
      "Mantiqiy masalalarni tez yechish ko'nikmasi",
      "Interview bosqichiga psixologik tayyorgarlik",
    ],
    faqs: [
      {
        q: "Imtihondan o'tmasam, pul qaytariladimi?",
        a: "To'g'ridan-to'g'ri kafolat bermaymiz, lekin diagnostika natijasiga ko'ra real ehtimol baholanadi.",
      },
      {
        q: "Onlayn formatda bormi?",
        a: "Asosiy darslar oflayn. Onlayn \u2014 qo'shimcha mentor mashg'ulotlari uchun.",
      },
    ],
  },
  {
    slug: "informatika-algoritmlar",
    no: "06",
    title: "Informatika va algoritmlar",
    tagline: "Python, algoritmlar, kichik loyihalar.",
    blurb: "Python, mantiqiy masalalar, kichik loyihalar. Olimpiada va Code-jam mashg'ulotlari.",
    level: "Boshlovchi \u2192 o'rta",
    duration: "7 oy",
    schedule: "Haftada 2 dars \xB7 120 daqiqa",
    groupSize: "10 o'quvchi",
    price: "650 000 so'm / oy",
    priceNote: "Kompyuter olib kelish shart emas \u2014 sinfda 1:1 jihoz mavjud.",
    program: [
      {
        week: "1-oy",
        title: "Python asoslari",
        body: "O'zgaruvchilar, sharti, sikllar, funksiyalar.",
      },
      {
        week: "2-oy",
        title: "Ma'lumotlar tuzilmalari",
        body: "Ro'yxat, lug'at, set, stack & queue asoslari.",
      },
      {
        week: "3\u20134 oy",
        title: "Algoritmlar",
        body: "Saralash, qidiruv, rekursiya, dinamik dasturlash kirish.",
      },
      {
        week: "5-oy",
        title: "Kichik loyihalar",
        body: "Telegram bot, oddiy o'yin, mini-veb sahifa.",
      },
      {
        week: "6\u20137 oy",
        title: "Olimpiada va contest",
        body: "Codeforces, e-olymp masalalari, jamoa-jang contest.",
      },
    ],
    outcomes: [
      "Python tilida erkin yozish",
      "Asosiy algoritmlarni mustaqil qo'llash",
      "1\u20132 ta tugallangan portfolio loyiha",
    ],
    faqs: [
      {
        q: "Oldin dasturlash bilan tanish bo'lmasam?",
        a: "Boshlovchi \u2014 eng kichik darajadan boshlanadi. Tajriba talab qilinmaydi.",
      },
      {
        q: "Sertifikat va portfolio bormi?",
        a: "Ha. Yakuniy loyiha GitHub'da publish qilinib, sertifikat beriladi.",
      },
    ],
  },
];
const coursesBySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));
export { courses, coursesBySlug };
