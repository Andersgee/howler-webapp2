import { Shell } from "#src/components/Shell";
import { seo } from "#src/utils/seo";
import { FormCreatePack } from "./form-create-pack";
import { MyPacksList } from "./my-packs-list";

export const metadata = seo({
  title: "Packs | Howler",
  description: "Quickly find/plan stuff to do with friends, or with anyone really.",
  url: "/pack",
  image: "/howler.png",
});

export default function Page() {
  return (
    <Shell>
      <div className="py-4"></div>
      <FormCreatePack />
      <MyPacksList />
    </Shell>
  );
}
