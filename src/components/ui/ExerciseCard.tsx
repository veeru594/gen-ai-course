import type { Exercise } from "../../data/types";
import "./ExerciseCard.css";

interface ExerciseCardProps {
  exercise: Exercise;
  done: boolean;
  onToggle: (id: string) => void;
}

export function ExerciseCard({ exercise, done, onToggle }: ExerciseCardProps) {
  return (
    <li className={`exercise${done ? " is-done" : ""}`}>
      <label className="exercise-label">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(exercise.id)}
        />
        <span
          className={`exercise-level exercise-level-${exercise.level.toLowerCase()}`}
        >
          {exercise.level}
        </span>
        <span className="exercise-text">{exercise.text}</span>
      </label>
    </li>
  );
}
