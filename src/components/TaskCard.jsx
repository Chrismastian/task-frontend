const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS = { todo: 'To do', in_progress: 'In progress', done: 'Done' }

export default function TaskCard({ task, onUpdate, onDelete }) {
  const done = task.status === 'done'

  function toggleDone() {
    onUpdate(task.id, { status: done ? 'todo' : 'done' })
  }

  function cycleStatus() {
    const order = ['todo', 'in_progress', 'done']
    const next = order[(order.indexOf(task.status) + 1) % order.length]
    onUpdate(task.id, { status: next })
  }

  return (
    <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <input type="checkbox" checked={done} onChange={toggleDone}
        className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</h3>
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>{task.priority}</span>
        </div>
        {task.description && <p className="mt-1 text-sm text-gray-600">{task.description}</p>}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
          <button onClick={cycleStatus} className="rounded bg-gray-100 px-2 py-0.5 hover:bg-gray-200">
            {STATUS_LABELS[task.status]}
          </button>
          {task.due_date && <span>Due {task.due_date}</span>}
        </div>
      </div>
      <button onClick={() => onDelete(task.id)} className="text-sm text-gray-400 hover:text-red-600">Delete</button>
    </div>
  )
}
