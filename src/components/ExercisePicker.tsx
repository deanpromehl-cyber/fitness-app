import { useEffect, useId, useState } from 'react'
import { exerciseOptions, exerciseNames } from '../utils/exercises'

type ExercisePickerProps = {
  value: string
  onChange: (exerciseId: string) => void
}

function ExercisePicker({ value, onChange }: ExercisePickerProps) {
  const listId = useId()
  const [query, setQuery] = useState(exerciseNames[value] ?? '')

  useEffect(() => {
    setQuery(exerciseNames[value] ?? '')
  }, [value])

  return (
    <>
      <input
        className="exercise-select"
        type="search"
        list={listId}
        placeholder="Übung suchen oder auswählen"
        value={query}
        onChange={(event) => {
          const nextQuery = event.target.value
          setQuery(nextQuery)
          const match = exerciseOptions.find((option) => option.name.toLowerCase() === nextQuery.trim().toLowerCase())
          if (match) onChange(match.id)
          if (!nextQuery) onChange('')
        }}
      />
      <datalist id={listId}>
        {exerciseOptions.map((option) => (
          <option key={option.id} value={option.name} />
        ))}
      </datalist>
    </>
  )
}

export default ExercisePicker
