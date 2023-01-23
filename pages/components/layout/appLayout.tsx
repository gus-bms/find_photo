import { styled } from '@mui/system';

const Centering = styled('div')`
  display: flex;
  position: relative;
  justify-content: center;
`
const FixedWidth = styled('div')`
  width: 60vw;
  @media (width: 800px)
    width: 90vw;
`

const AppLayout = (props: { children: React.ReactNode }) => {

  return (
    <Centering>
      <FixedWidth>{props.children}</FixedWidth>
    </ Centering>
  )
}

export default AppLayout