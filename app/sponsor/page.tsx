import Link from 'next/link';

export default function SponsorPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              Sponsor
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">赞助</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-100"
          >
            返回首页
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <img
            src="/sponsor-support.jpg"
            alt="赞助二维码"
            className="max-h-[80vh] w-auto max-w-full rounded-2xl bg-white object-contain shadow-lg"
          />
        </div>
      </div>
    </main>
  );
}
