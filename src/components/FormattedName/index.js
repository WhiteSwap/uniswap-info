import { transparentize } from 'polished'
import { useState } from 'react'
import styled from 'styled-components/macro'
import { Tooltip } from 'components/QuestionHelper'
import PropTypes from 'prop-types'

const TextWrapper = styled.div`
  position: relative;
  margin-left: ${({ margin }) => margin && '4px'};
  color: ${({ theme, link }) => (link ? theme.blueGrey : transparentize(0.5, theme.text6))};
  font-size: ${({ fontSize }) => fontSize ?? 'inherit'};

  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: 600px) {
    font-size: ${({ adjustSize }) => adjustSize && '10px'};
  }
`

const FormattedName = ({ text, maxCharacters, margin = false, adjustSize = false, link = false, ...rest }) => {
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

FormattedName.propTypes = {
  text: PropTypes.string,
  maxCharacters: PropTypes.number,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  link: PropTypes.any,
  margin: PropTypes.bool,
  adjustSize: PropTypes.bool
}

export default FormattedName
