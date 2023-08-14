import './loader.css'

type TLoaderProps = {
  size?: number
}

export function Loader({ size = 20 }: TLoaderProps): JSX.Element {
  const style: React.CSSProperties = {}
  if (size !== 0) {
    style.width = `${size}px`
    style.height = `${size}px`
    style.borderWidth = `${size / 6}px`
  }
  return <div className="loader" style={style} />
}
