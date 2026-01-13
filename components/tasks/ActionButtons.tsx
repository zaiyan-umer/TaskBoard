export function ActionButtons({
  loading,
  onSubmit,
}: {
  loading: boolean
  onSubmit: () => void
}) {
  return (
    <button onClick={onSubmit} disabled={loading}>
      {loading ? "Creating..." : "Create Task"}
    </button>
  )
}
