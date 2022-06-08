import { useTranslation } from 'react-i18next'
import MockChart from 'assets/mock_chart.svg'
import { Chart, Container, Title } from './styled'

const ComingSoon = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Chart src={MockChart} />
      <Title>{t('comingSoon')}</Title>
    </Container>
  )
}

export default ComingSoon
