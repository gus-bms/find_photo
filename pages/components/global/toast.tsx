import { Dispatch, SetStateAction, useEffect, useState } from "react";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LinearProgress from '@mui/material/LinearProgress';

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
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: '20vw',
      width: '32vh',
      backgroundColor: '#e74c3c',
      color: "white",
      textAlign: 'center',
      display: 'inline-flex',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: 'IBM Plex Sans,sans-serif',
      borderRadius: '6px'
    }}>
      {/* <WarningAmberIcon /> */}
      <p>{text}</p>
      <div style={{
        marginBottom: 15
      }}>
        <LinearProgress color="inherit" variant="determinate" value={progress} />
      </div>
    </div>
  )
}

export default Toast;