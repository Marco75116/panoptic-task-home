import { api } from "@/lib/eden";

export default async function Home() {
  const { data } = await api.hello.get();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-5xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {data}
        </h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Fetched server-side via Eden Treaty from <code>/api/hello</code>
        </p>
      </main>
    </div>
  );
}
