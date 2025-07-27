import * as Checkbox from '@radix-ui/react-checkbox'
import { useProcessStore } from '../stores/useProcessStore'
import { CheckIcon } from '@radix-ui/react-icons'

export const ProcessList = () => {
  const { processes, toggleDone } = useProcessStore()

  return (
    <div className="space-y-2">
      {processes.map((process) => (
        <div key={process.id} className="flex items-center gap-2">
          <Checkbox.Root
            className="w-5 h-5 bg-white rounded border border-gray-300 flex items-center justify-center"
            checked={process.done}
            onCheckedChange={() => toggleDone(process.id)}
          >
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span className={process.done ? 'line-through text-gray-400' : ''}>
            {process.title}
          </span>
        </div>
      ))}
    </div>
  )
}
