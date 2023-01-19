import { Box, Typography } from "@mui/material";

export default function Error404({ text }: { text: string }) {
  const viewHeight = window.innerHeight;
  return (
    <>
      <Box sx={{
        height: `93vh`,
        display: 'table',
        width: '100%'
      }}>
        <Typography variant="h3" sx={{
          display: 'table-cell',
          verticalAlign: 'middle',
          textAlign: 'center'
        }}>{`해당 ${text} 찾을 수 없습니다.`}</Typography>
      </Box>
    </>
  )
}