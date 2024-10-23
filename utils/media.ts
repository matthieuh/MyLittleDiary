type getSizeKeepsAspectRatioProps = {
  width: number, height: number, maxHeight?: number, maxWidth?: number
}

export const getSizeKeepsAspectRatio = (props: getSizeKeepsAspectRatioProps) => {
  const { width, height, maxHeight, maxWidth } = props
  if (maxHeight) {
    const ratio = height / width
    return {
      h: maxHeight,
      w: maxHeight / ratio
    }
  }
  if (maxWidth) {
    const ratio = width / height
    return {
      h: maxWidth / ratio,
      w: maxWidth
    }
  }

  if (maxHeight && maxWidth) {
    const ratio = width / height
    if (ratio > 1) {
      return {
        h: maxHeight,
        w: maxHeight / ratio
      }
    }
    return {
      h: maxWidth / ratio,
      w: maxWidth
    }
  }
}