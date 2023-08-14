import { IconAlertCircle, IconAlertTriangle, IconCircleCheck } from '@tabler/icons-react/'

type TAlertProps = {
  severity?: 'info' | 'success' | 'warning' | 'error'
  children?: React.ReactNode
}

export function Alert({
  severity = 'info',
  children
}: TAlertProps): JSX.Element {
    const bgColor = {
      'info': 'bg-blue-100',
      'success': 'bg-green-100',
      'warning': 'bg-yellow-100',
      'error': 'bg-red-100'
    }[severity]

    // const Icon = {
    //   'info': IconAlertCircle,
    //   'success': IconCircleCheck,
    //   'warning': IconAlertTriangle,
    //   'error': IconAlertCircle
    // }[severity]

    const iconColor = {
      'info': 'text-blue-500',
      'success': 'text-green-500',
      'warning': 'text-yellow-500',
      'error': 'text-red-500'
    }[severity]

    return (
      <div className={`p-3 rounded-md ${bgColor} flex gap-3`}>
        {/* <Icon className={iconColor} /> */}
        <div>
          {children}
        </div>
      </div>
    )
}
