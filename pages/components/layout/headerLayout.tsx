import Header from '../header/header'

const HeaderLayout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  )
}

export default HeaderLayout