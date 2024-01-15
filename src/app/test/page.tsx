"use client";

import { InputWithAutocomplete3 } from "#src/ui/input-with-autocomplete3";
import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");

  const suggestions = [
    { key: BigInt(4), value: "hello world 1", label: "hello world" },
    { key: BigInt(3), value: "hello world 4", label: "hello world" },
    { key: BigInt(2), value: "hello mamm 3", label: "hello mamm" },
    { key: BigInt(1), value: "hello mamma 2", label: "hello mamma" },
    { key: BigInt(5), value: "x factor 5", label: "x factor" },
    { key: BigInt(7), value: "lorem ips 6", label: "lorem ips" },
    { key: BigInt(6), value: "lorem apa 7", label: "lorem apa" },
  ];

  return <InputWithAutocomplete3 suggestions={suggestions} value={search} onChange={(s, k) => setSearch(s)} />;
}
