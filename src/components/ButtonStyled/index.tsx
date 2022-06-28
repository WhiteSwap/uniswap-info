import { PropsWithChildren } from 'react'
import { darken, transparentize } from 'polished'
import { Plus, ChevronDown, ChevronUp } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import styled from 'styled-components/macro'
import { StyledIcon } from 'components'
import { RowBetween } from 'components/Row'

const Base = styled(RebassButton)`
  padding: 0.875rem 1.25rem;
  font-size: 0.825rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
  border: 1px solid transparent;
  outline: none;
  border-bottom-right-radius: ${({ open }) => open && '0'};
  border-bottom-left-radius: ${({ open }) => open && '0'};
`

const BaseCustom = styled(RebassButton)`
  padding: 16px 12px;
  font-size: 0.825rem;
  font-weight: 400;
  border-radius: 12px;
  cursor: pointer;
  outline: none;
`

const Dull = styled(Base)`
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: black;
  height: 100%;
  font-weight: 400;
  &:hover,
  :focus {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.25);
  }
  &:focus {
    box-shadow: 0 0 0 1pt rgba(255, 255, 255, 0.25);
  }
  &:active {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.25);
  }
`

export default function ButtonStyled({ children, ...rest }: PropsWithChildren<ButtonProps>) {
  return <Base {...rest}>{children}</Base>
}

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const ButtonLight = styled(Base)<{ color?: string }>`
  background-color: ${({ color, theme }) =>
    color ? transparentize(0.99, color) : transparentize(0.99, theme.primary1)};
  color: ${({ color, theme }) => (color ? darken(0.1, color) : theme.primary1)};
  border: 2px solid ${({ color, theme }) => (color ? color : theme.primary1)};

  min-width: fit-content;
  border-radius: 12px;
  white-space: nowrap;

  a {
    color: ${({ color, theme }) => (color ? darken(0.1, color) : theme.primary1)};
  }

  :hover {
    background-color: ${({ color, theme }) =>
      color ? transparentize(0.8, color) : transparentize(0.8, theme.primary1)};
  }
`

export function ButtonDropdown({ disabled = false, children, open, ...rest }: PropsWithChildren<ButtonProps>) {
  return (
    <ButtonFaded {...rest} disabled={disabled} ope={open}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        {open ? (
          <StyledIcon>
            <ChevronUp size={24} />
          </StyledIcon>
        ) : (
          <StyledIcon>
            <ChevronDown size={24} />
          </StyledIcon>
        )}
      </RowBetween>
    </ButtonFaded>
  )
}

export const ButtonDark = styled(Base)<{ color?: string }>`
  background-color: ${({ color, theme }) => (color ? color : theme.primary1)};
  color: white;
  width: fit-content;
  border-radius: 12px;
  white-space: nowrap;

  :hover {
    background-color: ${({ color, theme }) => (color ? darken(0.1, color) : darken(0.1, theme.primary1))};
  }
`

export const ButtonFaded = styled(Base)`
  background-color: ${({ theme }) => theme.bg2};
  color: (255, 255, 255, 0.5);
  white-space: nowrap;

  :hover {
    opacity: 0.5;
  }
`

export function ButtonPlusDull({ children, ...rest }: PropsWithChildren<ButtonProps>) {
  return (
    <Dull disabled={false} {...rest}>
      <ContentWrapper>
        <Plus size={16} />
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
      </ContentWrapper>
    </Dull>
  )
}

export function ButtonCustom({
  children,
  bgColor,
  color,
  ...rest
}: PropsWithChildren<{ bgColor?: string } & ButtonProps>) {
  return (
    <BaseCustom bg={bgColor} color={color} {...rest}>
      {children}
    </BaseCustom>
  )
}

export const OptionButton = styled.div<{ active?: boolean; disabled?: boolean }>`
  font-weight: 600;
  font-size: 0.75rem;
  width: fit-content;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  margin: 5px;
  border-radius: 0.625rem;
  border: 2px solid ${({ active, theme }) => (active ? theme.blueGrey : transparentize(0.5, theme.text6))};
  background-color: ${({ active, theme }) => active && transparentize(0.9, theme.bg3)};
  color: ${({ active, theme }) => (active ? theme.blueGrey : transparentize(0.5, theme.text6))};

  :hover {
    cursor: ${({ disabled }) => !disabled && 'pointer'};
  }
`
