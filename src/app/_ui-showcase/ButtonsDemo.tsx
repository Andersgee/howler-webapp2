import { IconCheck } from "#src/icons/Check";
import { IconTrash } from "#src/icons/Trash";
import { IconEdit } from "#src/icons/Edit";
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
          <IconTrash /> Danger
        </Button>
      </div>
      <div>
        <Button variant="positive">
          <IconCheck /> Positive
        </Button>
        <div>hello after button</div>
      </div>
      <div>
        <Button variant="icon">
          <IconEdit />
        </Button>
      </div>
      <div>
        <Button variant="icon">
          <IconEdit /> Edit
        </Button>
      </div>
      <div>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}
