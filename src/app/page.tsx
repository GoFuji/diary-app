import { createDailyReport } from "./actions";
import { type DailyReport, getSupabaseClient } from "@/lib/supabase";

const text = {
  eyebrow: "Daily report",
  appTitle: "\u65e5\u5831\u30a2\u30d7\u30ea",
  lead:
    "\u4eca\u65e5\u3084\u3063\u305f\u3053\u3068\u3001\u6c17\u3065\u3044\u305f\u3053\u3068\u3001\u660e\u65e5\u3084\u308b\u3053\u3068\u3092\u6b8b\u3057\u307e\u3059\u3002",
  setupTitle: "Supabase\u63a5\u7d9a\u5f85\u3061",
  setupBody:
    ".env.local \u306b Supabase \u306e Project URL \u3068 Publishable key \u3092\u8a2d\u5b9a\u3059\u308b\u3068\u3001\u65e5\u5831\u306e\u767b\u9332\u3068\u8868\u793a\u304c\u52d5\u304d\u307e\u3059\u3002",
  loadError:
    "Supabase\u304b\u3089\u306e\u8aad\u307f\u8fbc\u307f\u3067\u30a8\u30e9\u30fc\u304c\u51fa\u307e\u3057\u305f:",
  newReport: "\u65b0\u3057\u3044\u65e5\u5831",
  date: "\u65e5\u4ed8",
  title: "\u30bf\u30a4\u30c8\u30eb",
  titlePlaceholder: "\u4f8b: \u521d\u56de\u30bb\u30c3\u30c8\u30a2\u30c3\u30d7",
  content: "\u5185\u5bb9",
  contentPlaceholder:
    "\u4eca\u65e5\u3084\u3063\u305f\u3053\u3068\u3001\u8a70\u307e\u3063\u305f\u3053\u3068\u3001\u660e\u65e5\u3084\u308b\u3053\u3068",
  save: "\u4fdd\u5b58",
  reportList: "\u65e5\u5831\u4e00\u89a7",
  countSuffix: "\u4ef6",
  empty: "\u307e\u3060\u65e5\u5831\u306f\u3042\u308a\u307e\u305b\u3093\u3002",
};

async function getDailyReports() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { reports: [] as DailyReport[], isConfigured: false, error: null };
  }

  const { data, error } = await supabase
    .from("daily_reports")
    .select("id, report_date, title, content, created_at")
    .order("report_date", { ascending: false })
    .order("created_at", { ascending: false });

  return {
    reports: (data ?? []) as DailyReport[],
    isConfigured: true,
    error: error?.message ?? null,
  };
}

export default async function Home() {
  const { reports, isConfigured, error } = await getDailyReports();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#222222]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8 sm:px-8">
        <header className="flex flex-col gap-3 border-b border-[#d8d2c6] pb-6">
          <p className="text-sm font-medium text-[#6d6255]">{text.eyebrow}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                {text.appTitle}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f574d]">
                {text.lead}
              </p>
            </div>
            <p className="text-sm text-[#6d6255]">{today}</p>
          </div>
        </header>

        {!isConfigured ? (
          <section className="rounded-lg border border-[#d8d2c6] bg-white p-5">
            <h2 className="text-lg font-semibold">{text.setupTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f574d]">
              {text.setupBody}
            </p>
          </section>
        ) : null}

        {error ? (
          <section className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            {text.loadError} {error}
          </section>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          <form
            action={createDailyReport}
            className="flex flex-col gap-4 rounded-lg border border-[#d8d2c6] bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{text.newReport}</h2>
            <label className="flex flex-col gap-2 text-sm font-medium">
              {text.date}
              <input
                className="h-11 rounded-md border border-[#c9c0b2] px-3 text-base outline-none focus:border-[#2f6f63]"
                defaultValue={today}
                name="report_date"
                type="date"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              {text.title}
              <input
                className="h-11 rounded-md border border-[#c9c0b2] px-3 text-base outline-none focus:border-[#2f6f63]"
                name="title"
                placeholder={text.titlePlaceholder}
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              {text.content}
              <textarea
                className="min-h-36 rounded-md border border-[#c9c0b2] px-3 py-3 text-base outline-none focus:border-[#2f6f63]"
                name="content"
                placeholder={text.contentPlaceholder}
                required
              />
            </label>
            <button
              className="h-11 rounded-md bg-[#2f6f63] px-4 font-semibold text-white transition hover:bg-[#26584f] disabled:cursor-not-allowed disabled:bg-[#9aa8a4]"
              disabled={!isConfigured}
              type="submit"
            >
              {text.save}
            </button>
          </form>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{text.reportList}</h2>
              <p className="text-sm text-[#6d6255]">
                {reports.length}
                {text.countSuffix}
              </p>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#c9c0b2] bg-white p-8 text-center text-sm text-[#6d6255]">
                {text.empty}
              </div>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <article
                    className="rounded-lg border border-[#d8d2c6] bg-white p-5 shadow-sm"
                    key={report.id}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-xl font-semibold">{report.title}</h3>
                      <time className="text-sm text-[#6d6255]">
                        {report.report_date}
                      </time>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#4f463d]">
                      {report.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
