import { CreateEventForm } from "./CreateEventForm";

export default function Page() {
  return (
    <div className="container mx-auto flex justify-center">
      <div>
        <h1>create</h1>
        <CreateEventForm />
      </div>
    </div>
  );
}
