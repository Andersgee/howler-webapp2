import Link from "next/link";

export default function NotFound() {
  return (
    <div className={"flex justify-center"}>
      <div className="px-2">
        <section className="flex flex-col items-center">
          <h1 className="mt-2">Nothing here</h1>
          <Link href="/">Go home</Link>
        </section>
      </div>
    </div>
  );
}
