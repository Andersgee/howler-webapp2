import { cookies, headers } from "next/headers";

export default function Page() {
  const cookieStore = cookies().getAll();
  const headerStore = Object.fromEntries(headers().entries());
  return (
    <div>
      <h2>Cookies</h2>
      {cookieStore.map((cookie) => (
        <div key={cookie.name} className="flex gap-2">
          <p>Name: {cookie.name}</p>
          <p>Value: {cookie.value}</p>
        </div>
      ))}
      <h2>Headers</h2>
      {Object.entries(headerStore).map(([k, v]) => (
        <div key={k} className="flex gap-2">
          <p>Key: {k}</p>
          <p>Value: {v}</p>
        </div>
      ))}
    </div>
  );
}
