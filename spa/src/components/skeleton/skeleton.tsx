import classNames from 'classnames'

type TSkeletonProps = HTMLDivElement & {
  variant?: 'square' | 'circle' | 'text'
}

export function Skeleton({
  className,
  variant
}: TSkeletonProps) {
  const classes = classNames(
    'animate-pulse bg-slate-100 rounded-md w-sm h-sm',
    {
      'rounded-full': variant === 'circle',
      'h-4': variant === 'text'
    },
    className
  )
  return (
    <div className={classes}></div>
  )
}
