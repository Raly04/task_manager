import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface AsyncButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: ReactNode
}

export function AsyncButton({
  isLoading = false,
  loadingText = 'Chargement...',
  children,
  disabled,
  className,
  ...props
}: AsyncButtonProps) {
  return (
    <button
      {...props}
      className={className}
      disabled={disabled || isLoading}
      type={props.type ?? 'button'}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="loading loading-spinner loading-sm" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
