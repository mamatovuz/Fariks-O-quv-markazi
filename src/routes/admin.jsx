import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { defaultContent } from "@/data/site-content";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const tabs = [
  { id: "stats", label: "Statistika" },
  { id: "courses", label: "Kurslar" },
  { id: "teachers", label: "Ustozlar" },
  { id: "settings", label: "Sozlamalar" },
];

function blankCourse(index) {
  return {
    slug: `yangi-kurs-${Date.now()}`,
    no: String(index + 1).padStart(2, "0"),
    title: "Yangi kurs",
    tagline: "",
    blurb: "",
    level: "",
    duration: "",
    schedule: "",
    groupSize: "",
    price: "",
    priceNote: "",
    program: [{ week: "", title: "", body: "" }],
    outcomes: [""],
    faqs: [{ q: "", a: "" }],
  };
}

function blankTeacher() {
  return {
    img: "",
    name: "Yangi ustoz",
    role: "",
    note: "",
  };
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok === false) {
    throw new Error(result.error || "Amal bajarilmadi.");
  }
  return result;
}

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "fariks", password: "" });
  const [content, setContent] = useState(defaultContent);
  const [tab, setTab] = useState("stats");
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState(0);
  const [status, setStatus] = useState("");
  const [credentials, setCredentials] = useState({
    username: "",
    currentPassword: "",
    password: "",
  });

  useEffect(() => {
    api("/api/admin/session")
      .then((result) => {
        setAuthenticated(result.authenticated);
        setUsername(result.username || "");
        setCredentials((current) => ({ ...current, username: result.username || "" }));
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    api("/api/admin/content").then((result) => setContent(result.content));
  }, [authenticated]);

  const currentCourse = useMemo(
    () => content.courses[selectedCourse] || content.courses[0],
    [content.courses, selectedCourse],
  );
  const currentTeacher = useMemo(
    () => content.teachers[selectedTeacher] || content.teachers[0],
    [content.teachers, selectedTeacher],
  );

  async function handleLogin(event) {
    event.preventDefault();
    setStatus("Kirilmoqda...");
    try {
      await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      const session = await api("/api/admin/session");
      const data = await api("/api/admin/content");
      setAuthenticated(true);
      setUsername(session.username || loginForm.username);
      setCredentials((current) => ({
        ...current,
        username: session.username || loginForm.username,
      }));
      setContent(data.content);
      setStatus("");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function saveContent(nextContent = content) {
    setStatus("Saqlanmoqda...");
    try {
      const result = await api("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ content: nextContent }),
      });
      setContent(result.content);
      setStatus("Saqlandi.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function saveCredentials(event) {
    event.preventDefault();
    setStatus("Sozlamalar saqlanmoqda...");
    try {
      const result = await api("/api/admin/credentials", {
        method: "PUT",
        body: JSON.stringify(credentials),
      });
      setUsername(result.username);
      setCredentials({ username: result.username, currentPassword: "", password: "" });
      setStatus("Login va parol sozlamalari saqlandi.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
  }

  function updateContent(updater) {
    setContent((current) => updater(structuredClone(current)));
  }

  if (checking) {
    return <AdminShell status="Tekshirilmoqda..." />;
  }

  if (!authenticated) {
    return (
      <AdminShell status={status}>
        <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-md bg-paper p-8 text-ink">
          <div className="eyebrow">Admin panel</div>
          <h1 className="mt-4 font-display text-4xl" style={{ fontWeight: 500 }}>
            FARIKS boshqaruv
          </h1>
          <div className="mt-8 space-y-5">
            <Field
              label="Login"
              value={loginForm.username}
              onChange={(value) => setLoginForm((current) => ({ ...current, username: value }))}
            />
            <Field
              label="Parol"
              type="password"
              value={loginForm.password}
              onChange={(value) => setLoginForm((current) => ({ ...current, password: value }))}
            />
          </div>
          <button className="mt-8 w-full rounded-full bg-ink px-6 py-4 text-sm text-paper hover:bg-ember">
            Kirish
          </button>
        </form>
      </AdminShell>
    );
  }

  return (
    <AdminShell status={status}>
      <div className="mx-auto max-w-[1500px] px-5 py-8 text-ink md:px-8">
        <header className="flex flex-col gap-4 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Admin panel</div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
              Sayt ma'lumotlari
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-full border border-rule px-5 py-3 text-sm hover:border-ember"
            >
              Saytga o'tish
            </a>
            <button
              onClick={logout}
              className="rounded-full bg-ink px-5 py-3 text-sm text-paper hover:bg-ember"
            >
              Chiqish
            </button>
          </div>
        </header>

        <div className="grid gap-6 py-8 md:grid-cols-[240px_1fr]">
          <aside className="space-y-3">
            <div className="rounded-md border border-rule bg-card p-4 text-sm">
              Login: <span className="font-medium">{username}</span>
            </div>
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`block w-full rounded-md border px-4 py-3 text-left text-sm transition ${
                  tab === item.id
                    ? "border-ember bg-ember text-ink"
                    : "border-rule bg-paper hover:border-ember"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => saveContent()}
              className="mt-4 w-full rounded-full bg-ink px-5 py-3 text-sm text-paper hover:bg-ember"
            >
              Hammasini saqlash
            </button>
          </aside>

          <section className="rounded-md border border-rule bg-paper p-5 md:p-7">
            {tab === "stats" ? (
              <StatsEditor content={content} updateContent={updateContent} />
            ) : null}
            {tab === "courses" ? (
              <CoursesEditor
                content={content}
                updateContent={updateContent}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                currentCourse={currentCourse}
              />
            ) : null}
            {tab === "teachers" ? (
              <TeachersEditor
                content={content}
                updateContent={updateContent}
                selectedTeacher={selectedTeacher}
                setSelectedTeacher={setSelectedTeacher}
                currentTeacher={currentTeacher}
              />
            ) : null}
            {tab === "settings" ? (
              <SettingsEditor
                credentials={credentials}
                setCredentials={setCredentials}
                saveCredentials={saveCredentials}
              />
            ) : null}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function AdminShell({ children, status }) {
  return (
    <main className="min-h-screen bg-ink/95 py-8 text-paper">
      {children}
      {status ? (
        <div className="fixed bottom-5 left-1/2 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-paper px-5 py-3 text-center text-sm text-ink shadow-xl">
          {status}
        </div>
      ) : null}
    </main>
  );
}

function StatsEditor({ content, updateContent }) {
  return (
    <div>
      <SectionTitle title="Statistika" body="Hero qismidagi sonlar va yorliqlar." />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {content.stats.map((stat, index) => (
          <div key={index} className="rounded-md border border-rule p-4">
            <Field
              label="Son"
              value={stat.number}
              onChange={(value) =>
                updateContent((draft) => {
                  draft.stats[index].number = value;
                  return draft;
                })
              }
            />
            <Field
              label="Yorliq"
              value={stat.label}
              onChange={(value) =>
                updateContent((draft) => {
                  draft.stats[index].label = value;
                  return draft;
                })
              }
            />
            <DeleteButton
              onClick={() =>
                updateContent((draft) => {
                  draft.stats.splice(index, 1);
                  return draft;
                })
              }
            />
          </div>
        ))}
      </div>
      <AddButton
        label="Statistika qo'shish"
        onClick={() =>
          updateContent((draft) => {
            draft.stats.push({ number: "0", label: "Yangi ko'rsatkich" });
            return draft;
          })
        }
      />
    </div>
  );
}

function CoursesEditor({
  content,
  updateContent,
  selectedCourse,
  setSelectedCourse,
  currentCourse,
}) {
  return (
    <div>
      <SectionTitle title="Kurslar" body="Ro'yxat, kurs ichki sahifasi, dastur, natija va FAQ." />
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          {content.courses.map((course, index) => (
            <button
              key={course.slug}
              onClick={() => setSelectedCourse(index)}
              className={`block w-full rounded-md border px-4 py-3 text-left text-sm ${
                selectedCourse === index ? "border-ember bg-ember/20" : "border-rule"
              }`}
            >
              {course.no} · {course.title}
            </button>
          ))}
          <AddButton
            label="Kurs qo'shish"
            onClick={() =>
              updateContent((draft) => {
                draft.courses.push(blankCourse(draft.courses.length));
                setSelectedCourse(draft.courses.length - 1);
                return draft;
              })
            }
          />
        </aside>

        {currentCourse ? (
          <div className="space-y-8">
            <div className="rounded-md border border-rule p-4">
              <h3 className="font-display text-2xl">Kurs intro matni</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {["eyebrow", "title", "emphasis"].map((field) => (
                  <Field
                    key={field}
                    label={field}
                    value={content.coursesIntro[field]}
                    onChange={(value) =>
                      updateContent((draft) => {
                        draft.coursesIntro[field] = value;
                        return draft;
                      })
                    }
                  />
                ))}
              </div>
              <Textarea
                label="Izoh"
                value={content.coursesIntro.body}
                onChange={(value) =>
                  updateContent((draft) => {
                    draft.coursesIntro.body = value;
                    return draft;
                  })
                }
              />
            </div>

            <CourseForm
              course={currentCourse}
              update={(field, value) =>
                updateContent((draft) => {
                  draft.courses[selectedCourse][field] = value;
                  return draft;
                })
              }
              updateCourse={(updater) =>
                updateContent((draft) => {
                  updater(draft.courses[selectedCourse]);
                  return draft;
                })
              }
              deleteCourse={() =>
                updateContent((draft) => {
                  draft.courses.splice(selectedCourse, 1);
                  setSelectedCourse(Math.max(0, selectedCourse - 1));
                  return draft;
                })
              }
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CourseForm({ course, update, updateCourse, deleteCourse }) {
  const fields = [
    ["no", "Raqam"],
    ["slug", "Slug"],
    ["title", "Nomi"],
    ["tagline", "Tagline"],
    ["level", "Daraja"],
    ["duration", "Davomiyligi"],
    ["schedule", "Jadval"],
    ["groupSize", "Guruh"],
    ["price", "Narxi"],
    ["priceNote", "Narx izohi"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map(([key, label]) => (
          <Field
            key={key}
            label={label}
            value={course[key]}
            onChange={(value) => update(key, value)}
          />
        ))}
      </div>
      <Textarea
        label="Ro'yxatdagi va ichki sahifadagi tavsif"
        value={course.blurb}
        onChange={(value) => update("blurb", value)}
      />
      <ProgramEditor course={course} updateCourse={updateCourse} />
      <TextListEditor
        title="Natijalar"
        items={course.outcomes}
        onChange={(items) => updateCourse((draft) => (draft.outcomes = items))}
      />
      <FaqEditor course={course} updateCourse={updateCourse} />
      <button
        onClick={deleteCourse}
        className="rounded-full bg-red-700 px-5 py-3 text-sm text-white"
      >
        Kursni o'chirish
      </button>
    </div>
  );
}

function ProgramEditor({ course, updateCourse }) {
  return (
    <ArrayBlock title="Dastur">
      {course.program.map((item, index) => (
        <div key={index} className="rounded-md border border-rule p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Muddat"
              value={item.week}
              onChange={(value) => updateCourse((draft) => (draft.program[index].week = value))}
            />
            <Field
              label="Sarlavha"
              value={item.title}
              onChange={(value) => updateCourse((draft) => (draft.program[index].title = value))}
            />
          </div>
          <Textarea
            label="Tavsif"
            value={item.body}
            onChange={(value) => updateCourse((draft) => (draft.program[index].body = value))}
          />
          <DeleteButton onClick={() => updateCourse((draft) => draft.program.splice(index, 1))} />
        </div>
      ))}
      <AddButton
        label="Dastur qatori qo'shish"
        onClick={() =>
          updateCourse((draft) => draft.program.push({ week: "", title: "", body: "" }))
        }
      />
    </ArrayBlock>
  );
}

function FaqEditor({ course, updateCourse }) {
  return (
    <ArrayBlock title="Savol-javob">
      {course.faqs.map((item, index) => (
        <div key={index} className="rounded-md border border-rule p-4">
          <Field
            label="Savol"
            value={item.q}
            onChange={(value) => updateCourse((draft) => (draft.faqs[index].q = value))}
          />
          <Textarea
            label="Javob"
            value={item.a}
            onChange={(value) => updateCourse((draft) => (draft.faqs[index].a = value))}
          />
          <DeleteButton onClick={() => updateCourse((draft) => draft.faqs.splice(index, 1))} />
        </div>
      ))}
      <AddButton
        label="Savol qo'shish"
        onClick={() => updateCourse((draft) => draft.faqs.push({ q: "", a: "" }))}
      />
    </ArrayBlock>
  );
}

function TextListEditor({ title, items, onChange }) {
  return (
    <ArrayBlock title={title}>
      {items.map((item, index) => (
        <div key={index} className="flex gap-3">
          <input
            value={item}
            onChange={(event) => {
              const next = [...items];
              next[index] = event.target.value;
              onChange(next);
            }}
            className="min-w-0 flex-1 border-b border-rule bg-transparent py-3 text-sm outline-none focus:border-ember"
          />
          <button
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="rounded-full border border-rule px-4 text-sm hover:border-red-700 hover:text-red-700"
          >
            O'chirish
          </button>
        </div>
      ))}
      <AddButton label="Qator qo'shish" onClick={() => onChange([...items, ""])} />
    </ArrayBlock>
  );
}

function TeachersEditor({
  content,
  updateContent,
  selectedTeacher,
  setSelectedTeacher,
  currentTeacher,
}) {
  return (
    <div>
      <SectionTitle title="Ustozlar" body="Ism, lavozim, izoh va rasm URL." />
      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-2">
          {content.teachers.map((teacher, index) => (
            <button
              key={`${teacher.name}-${index}`}
              onClick={() => setSelectedTeacher(index)}
              className={`block w-full rounded-md border px-4 py-3 text-left text-sm ${
                selectedTeacher === index ? "border-ember bg-ember/20" : "border-rule"
              }`}
            >
              {teacher.name}
            </button>
          ))}
          <AddButton
            label="Ustoz qo'shish"
            onClick={() =>
              updateContent((draft) => {
                draft.teachers.push(blankTeacher());
                setSelectedTeacher(draft.teachers.length - 1);
                return draft;
              })
            }
          />
        </aside>
        {currentTeacher ? (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-md bg-muted">
              {currentTeacher.img ? (
                <img
                  src={currentTeacher.img}
                  alt=""
                  className="h-72 w-full object-cover grayscale"
                />
              ) : null}
            </div>
            {["img", "name", "role", "note"].map((field) =>
              field === "note" ? (
                <Textarea
                  key={field}
                  label="Izoh"
                  value={currentTeacher[field]}
                  onChange={(value) =>
                    updateContent((draft) => {
                      draft.teachers[selectedTeacher][field] = value;
                      return draft;
                    })
                  }
                />
              ) : (
                <Field
                  key={field}
                  label={field === "img" ? "Rasm URL" : field}
                  value={currentTeacher[field]}
                  onChange={(value) =>
                    updateContent((draft) => {
                      draft.teachers[selectedTeacher][field] = value;
                      return draft;
                    })
                  }
                />
              ),
            )}
            <button
              onClick={() =>
                updateContent((draft) => {
                  draft.teachers.splice(selectedTeacher, 1);
                  setSelectedTeacher(Math.max(0, selectedTeacher - 1));
                  return draft;
                })
              }
              className="rounded-full bg-red-700 px-5 py-3 text-sm text-white"
            >
              Ustozni o'chirish
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SettingsEditor({ credentials, setCredentials, saveCredentials }) {
  return (
    <form onSubmit={saveCredentials}>
      <SectionTitle title="Login va parol" body="Default login: fariks, default parol: 12345678." />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="Yangi login"
          value={credentials.username}
          onChange={(value) => setCredentials((current) => ({ ...current, username: value }))}
        />
        <Field
          label="Hozirgi parol"
          type="password"
          value={credentials.currentPassword}
          onChange={(value) =>
            setCredentials((current) => ({ ...current, currentPassword: value }))
          }
        />
        <Field
          label="Yangi parol"
          type="password"
          value={credentials.password}
          onChange={(value) => setCredentials((current) => ({ ...current, password: value }))}
        />
      </div>
      <button className="mt-8 rounded-full bg-ink px-6 py-3 text-sm text-paper hover:bg-ember">
        Sozlamani saqlash
      </button>
    </form>
  );
}

function SectionTitle({ title, body }) {
  return (
    <div>
      <h2 className="font-display text-3xl" style={{ fontWeight: 500 }}>
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border-b border-rule bg-transparent py-3 text-sm outline-none focus:border-ember"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <label className="mt-4 block">
      <span className="eyebrow">{label}</span>
      <textarea
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-y border border-rule bg-transparent p-3 text-sm outline-none focus:border-ember"
      />
    </label>
  );
}

function ArrayBlock({ title, children }) {
  return (
    <div className="space-y-4 rounded-md border border-rule p-4">
      <h3 className="font-display text-2xl">{title}</h3>
      {children}
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 rounded-full border border-ember px-5 py-3 text-sm text-ink hover:bg-ember"
    >
      {label}
    </button>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 rounded-full border border-rule px-4 py-2 text-sm hover:border-red-700 hover:text-red-700"
    >
      O'chirish
    </button>
  );
}
