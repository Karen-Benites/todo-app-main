export default function normalizeTaskData(raw) {
  if (typeof raw === "string") {
    const timestamp = Date.now()
    return {
      id: `task-${timestamp}`,
      text: raw,
      isCompleted: false,
      creationDate: new Date(timestamp),
    }
  }

  return {
    id: raw.id || `task-${Date.now()}`,
    text: raw.text,
    isCompleted: raw.isCompleted || false,
    creationDate: raw.creationDate
      ? new Date(raw.creationDate)
      : new Date(Date.now()),
  }
}
