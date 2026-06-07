import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Marquee";
import { Courses } from "@/components/site/Courses";
import { Method } from "@/components/site/Method";
import { Teachers } from "@/components/site/Teachers";
import { Results } from "@/components/site/Results";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { useSiteContent } from "@/hooks/use-site-content";
const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FARIKS \u2014 Eng yuksak maqsadlar sari \xB7 O'quv markazi" },
      {
        name: "description",
        content:
          "FARIKS o'quv markazi: IELTS, SAT, matematika, ingliz tili va Prezident maktabiga tayyorlov. Andijon viloyatidagi mustaqil o'quv markazi.",
      },
      { property: "og:title", content: "FARIKS \u2014 Eng yuksak maqsadlar sari" },
      {
        property: "og:description",
        content: "Kichik guruhlar, tajribali ustozlar, izchil metodika. 2016-yildan beri.",
      },
    ],
    links: [{ rel: "canonical", href: "https://fariks.uz/" }],
  }),
  component: Index,
});
function Index() {
  const content = useSiteContent();

  return (
    <main className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Nav />
      <Hero stats={content.stats} />
      <Marquee items={content.marquee?.items} />
      <Courses courses={content.courses} intro={content.coursesIntro} />
      <Method />
      <Teachers teachers={content.teachers} />
      <Results results={content.results} />
      <Contact courses={content.courses} contact={content.contact} />
      <Footer />
    </main>
  );
}
export { Route };
