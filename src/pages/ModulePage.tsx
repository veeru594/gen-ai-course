import { useParams } from "react-router-dom";

export function ModulePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container">
      <h1>Module: {id}</h1>
    </div>
  );
}
