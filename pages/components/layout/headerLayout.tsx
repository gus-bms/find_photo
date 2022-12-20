import Header from '../header/header'

export const HeaderLayout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  )
}