import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import style from '../../../styles/Global.module.css'

interface Iprops {
  text: string
  setToast: Dispatch<SetStateAction<boolean>>;
}

const Toast: React.FunctionComponent<Iprops> = ({ setToast, text }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          setToast(false)
        }
        return oldProgress + 10
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, [setToast]);

  return (
    <div className={style.toast__box}>
      {/* <WarningAmberIcon /> */}
      <p>{text}</p>
      <div className={style.progress__bar}>
        <LinearProgress color="inherit" variant="determinate" value={progress} />
      </div>
    </div>
  )
}

export default Toast;