interface ErrorMessageProps {
  path?: PropertyKey[]
  message: string
}

export function ErrorMessage({ path, message }: ErrorMessageProps) {
  return (
    <p>
      {path?.join(".")}: {message}
    </p>
  )
}
