import { Check, Edit, Trash } from "#src/icons";
import { Button } from "#src/ui/button";

export function ButtonsDemo() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Button variant="primary">Primary</Button>
      </div>
      <div>
        <Button variant="warning">Warning</Button>
      </div>
      <div>
        <Button variant="warning" disabled>
          Disabled
        </Button>
      </div>
      <div>
        <Button variant="danger">
          <Trash /> Danger
        </Button>
      </div>
      <div>
        <Button variant="positive">
          <Check /> Positive
        </Button>
        <div>hello after button</div>
      </div>
      <div>
        <Button variant="icon">
          <Edit />
        </Button>
      </div>
      <div>
        <Button variant="icon">
          <Edit /> Edit
        </Button>
      </div>
      <div>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}
