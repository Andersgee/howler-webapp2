import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1>Nothing here</h1>
      <Link href="/">Go home</Link>
    </div>
  );
}
