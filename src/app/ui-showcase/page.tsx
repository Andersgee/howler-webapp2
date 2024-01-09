import Link from "next/link";
import { ButtonsDemo } from "./ButtonsDemo";
import { CardDemo } from "./CardDemo";
import { ComboboxDemo } from "./ComboBoxDemo";
import { ComboboxDropdownMenu } from "./ComboboxDropdownMenu";
import { DialogDemo } from "./DialogDemo";
import { InputDemo } from "./InputDemo";
import AccordionDemo from "./AccordionDemo";
import { HovercardDemo } from "./HovercardDemo";
import { AlertDialogDemo } from "./AlertDialogDemo";
import { ToastDemo } from "./ToastDemo";

export default function Page() {
  return (
    <main className="flex justify-center">
      <div className="container flex flex-wrap justify-center gap-12">
        <div className="">
          <h2 className="mx-auto">1. CardDemo</h2>
          <CardDemo />
        </div>
        <div>
          <h2>2. ComboboxDemo</h2>
          <ComboboxDemo />
        </div>
        <div>
          <h2>3. ComboboxDropdownMenu</h2>
          <ComboboxDropdownMenu />
        </div>
        <div>
          <h2>4. ButtonsDemo</h2>
          <ButtonsDemo />
        </div>
        <div>
          <h2>5. DialogDemo</h2>
          <DialogDemo />

          <h2>9. AlertDialogDemo</h2>
          <AlertDialogDemo />

          <h2>6. InputDemo</h2>
          <InputDemo />
        </div>
        <div>
          <h2>7. AccordionDemo</h2>
          <AccordionDemo />
        </div>
        <div>
          <h2>8. HovercardDemo</h2>
          <HovercardDemo />
        </div>
        <div>
          <h2>9. ToastDemo</h2>
          <ToastDemo />
        </div>

        <div>
          <h2>Some heading</h2>
          <p>
            Some paragraph Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi sunt obcaecati, doloremque
            ipsam officiis est nihil dolorum ut, aliquam <Link href="/">go home</Link> qui non aliquid rerum vel
            laudantium similique vitae alias. Unde laboriosam, dolores dolor tenetur voluptatem velit quas blanditiis
            veniam labore, ad mollitia repellendus esse nemo a? Sint, aut. Officiis, velit quis.
          </p>
        </div>
      </div>
    </main>
  );
}
