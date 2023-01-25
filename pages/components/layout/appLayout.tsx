import { styled } from '@mui/system';

const Centering = styled('div')`
  display: flex;
  position: relative;
  justify-content: center;
`
const FixedWidth = styled('div')`
  @media (min-width: 0px) {
    width:90vw;
  }
  @media (min-width: 1000px) {
    width: 80vw;
  }
  @media (min-width: 1200px){
    width: 60vw;
  }
    
`

const AppLayout = (props: { children: React.ReactNode }) => {

  return (
    <Centering>
      <FixedWidth>{props.children}</FixedWidth>
    </ Centering>
  )
}

export default AppLayout