export function DueDatePicker({ value, onChange }: any) {
  return (
    <input
      type="date"
      value={value.toISOString().split("T")[0]}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  )
}
