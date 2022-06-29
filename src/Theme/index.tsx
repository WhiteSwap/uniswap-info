import { Text, TextProps } from 'rebass'
import styled, { createGlobalStyle, DefaultTheme } from 'styled-components/macro'

const lightTheme = {
  panelColor: 'rgba(255, 255, 255, 0)',
  backgroundColor: '#F7F8FA',
  uniswapPink: 'black',
  concreteGray: '#FAFAFA',
  inputBackground: '#FAFAFA',
  shadowColor: '#2F80ED',
  mercuryGray: '#E1E1E1',
  text1: '#202327',
  text2: '#565A69',
  text3: '#888D9B',
  text4: '#C3C5CB',
  text5: '#EDEEF2',
  text6: '#45484D',
  // special case text types
  white: '#FFFFFF',
  // backgrounds / greys
  bg1: '#FAFAFA',
  bg2: '#F7F8FA',
  bg3: '#EDEEF2',
  bg4: '#CED0D9',
  bg5: '#888D9B',
  bg6: '#FFFFFF',
  bg7: '#F2F3F5',
  bg8: '#FFFFFF',
  //specialty colors
  modalBG: 'rgba(0,0,0,0.3)',
  advancedBG: 'rgba(255,255,255,0.4)',
  onlyLight: 'transparent',
  divider: 'rgba(43, 43, 43, 0.035)',
  //primary colors
  primary1: '#C9A02F',
  primary2: '#e0b856',
  primary3: '#e2c277',
  primary4: '#eed385',
  primary5: '#f3e2af',
  // color text
  primaryText1: '#C9A02F',
  // secondary colors
  secondary1: '#C9A02F',
  secondary2: '#f5d786',
  secondary3: '#f8e5b1',
  shadow1: '#2F80ED',
  // other
  red1: '#C73846',
  green1: '#54B45D',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  link: '#2172E5',
  blueGrey: '#6681A7',
  blue: '#2E69BB',
  lightText1: '#FAFAFA',
  background: `radial-gradient(50% 50% at 50% 50%, #C9A02F30 0%, #fff 0%)`
}

const darkTheme = {
  panelColor: 'rgba(255, 255, 255, 0)',
  backgroundColor: '#212429',
  uniswapPink: '#C9A02F',
  concreteGray: '#292C2F',
  inputBackground: '#1F1F1F',
  shadowColor: '#000',
  mercuryGray: '#333333',
  text1: '#FAFAFA',
  text2: '#C3C5CB',
  text3: '#6C7284',
  text4: '#565A69',
  text5: '#2C2F36',
  text6: 'rgb(165, 172, 183)',
  // special case text types
  white: '#FFFFFF',
  // backgrounds / greys
  bg1: '#212429',
  bg2: '#2C2F36',
  bg3: '#40444F',
  bg4: '#565A69',
  bg5: '#565A69',
  bg6: '#000',
  bg7: '#1f1f25',
  bg8: '#1C1C22',
  //specialty colors
  modalBG: 'rgba(0,0,0,0.425)',
  advancedBG: 'rgba(0,0,0,0.1)',
  onlyLight: '#22242a',
  divider: 'rgba(43, 43, 43, 0.435)',
  //primary colors
  primary1: '#C9A02F',
  primary2: '#3680E7',
  primary3: '#4D8FEA',
  primary4: '#376bad70',
  primary5: '#153d6f70',
  // color text
  primaryText1: '#6da8ff',
  // secondary colors
  secondary1: '#2172E5',
  secondary2: '#17000b26',
  secondary3: '#17000b26',
  shadow1: '#000',
  // other
  red1: '#C73846',
  green1: '#54B45D',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  link: '#2172E5',
  blueGrey: '#6681A7',
  blue: '#2E69BB',
  lightText1: '#FAFAFA',
  background: 'black'
}

export const globalTheme = (darkMode: boolean): DefaultTheme => {
  if (darkMode) {
    return darkTheme
  }
  return lightTheme
}

const TextWrapper = styled(Text)`
  color: ${({ color, theme }) => theme[color as keyof DefaultTheme]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={14} color={'text1'} {...props} />
  },

  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} color={'text1'} {...props} />
  },

  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} color={'text1'} {...props} />
  },

  header(props: TextProps) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },

  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} fontSize={28} {...props} />
  },

  light(props: TextProps) {
    return <TextWrapper fontWeight={400} color={'text3'} fontSize={14} {...props} />
  }
}

export const DashboardWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.bg8};
  padding: 2rem;
  border-radius: 1rem;

  @media screen and (max-width: 440px) {
    padding: 1rem;
  }
`

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer'
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const GlobalStyle = createGlobalStyle`
  html { font-family: 'Inter', sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: 'Inter var', sans-serif; }
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    background-color: ${({ theme }) => theme.bg6};
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }

.three-line-legend {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 0.5rem;
	font-size: 0.75rem;
	color: #20262E;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 0.5rem;
	font-size: 0.75rem;
	color: white;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;


  & > * {
    width: 100% !important;
  }
}


  html {
    font-size: 1rem;
    font-variant: none;
    color: 'black';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    height: 100%;
  }
`
