import { useState } from 'react'
import { StyledIcon } from 'components'
import { AutoColumn } from 'components/Column'
import { RowBetween, Row } from 'components/Row'
import { TYPE } from 'Theme'
import { Wrapper, Dropdown, ArrowStyled } from './styled'

const DropdownSelect = ({ options, active, setActive, color }) => {
  const [showDropdown, toggleDropdown] = useState(false)

  return (
    <Wrapper open={showDropdown} color={color}>
      <RowBetween onClick={() => toggleDropdown(!showDropdown)} justify="center">
        <TYPE.main>{active}</TYPE.main>
        <StyledIcon>
          <ArrowStyled />
        </StyledIcon>
      </RowBetween>
      {showDropdown && (
        <Dropdown>
          <AutoColumn gap="1.25rem">
            {Object.keys(options).map((key, index) => {
              let option = options[key]
              return (
                option !== active && (
                  <Row
                    onClick={() => {
                      toggleDropdown(!showDropdown)
                      setActive(option)
                    }}
                    key={index}
                  >
                    <TYPE.body fontSize={14}>{option}</TYPE.body>
                  </Row>
                )
              )
            })}
          </AutoColumn>
        </Dropdown>
      )}
    </Wrapper>
  )
}

export default DropdownSelect
