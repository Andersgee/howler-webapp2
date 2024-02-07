import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#src/ui/accordion";

export default function AccordionDemo() {
  return (
    <Accordion type="multiple" className="w-56">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it accessible2?</AccordionTrigger>
        <AccordionContent>Yes2. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
