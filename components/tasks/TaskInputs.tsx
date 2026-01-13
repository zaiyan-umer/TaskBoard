export function TaskInputs({ formData, update }: any) {
  return (
    <>
      <input
        placeholder="Title"
        value={formData.title}
        onChange={(e) => update("title", e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => update("description", e.target.value)}
      />

      <select
        value={formData.priority}
        onChange={(e) => update("priority", e.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </>
  )
}
