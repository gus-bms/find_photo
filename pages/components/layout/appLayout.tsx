import { styled } from '@mui/system';

const Centering = styled('div')`
  display: flex;
  justify-content: center;
`
const FixedWidth = styled('div')`
  width: 800px;
  @media (max-width: 800px)
    width: 100%;
`

const AppLayout = (props: { children: React.ReactNode }) => {

  return (
    <Centering>
      <FixedWidth>{props.children}</FixedWidth>
    </ Centering>
  )
}

export default AppLayout