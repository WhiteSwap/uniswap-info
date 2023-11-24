import React, { useState } from 'react'
import { Tooltip } from 'components/QuestionHelper'
import { TextWrapper } from './styled'

interface IFormattedName {
  text: string
  maxCharacters: number
  fontSize?: string | number
  link?: boolean
  margin?: boolean
  adjustSize?: boolean
  style?: React.CSSProperties
}

const FormattedName = ({
  text,
  maxCharacters,
  margin = false,
  adjustSize = false,
  link = false,
  style,
  ...rest
}: IFormattedName) => {
  const [showHover, setShowHover] = useState(false)

  if (!text) {
    return null
  }

  if (text.length > maxCharacters) {
    return (
      <Tooltip text={text} show={showHover}>
        <TextWrapper
          onMouseEnter={() => setShowHover(true)}
          onMouseLeave={() => setShowHover(false)}
          margin={margin}
          adjustSize={adjustSize}
          link={link}
          fontSize={rest.fontSize}
          style={style}
          {...rest}
        >
          {' ' + text.slice(0, maxCharacters - 1) + '...'}
        </TextWrapper>
      </Tooltip>
    )
  }

  return (
    <TextWrapper margin={margin} adjustSize={adjustSize} link={link} fontSize={rest.fontSize} {...rest}>
      {text}
    </TextWrapper>
  )
}

export default FormattedName
