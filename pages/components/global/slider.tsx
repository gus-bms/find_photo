import { Box, IconButton } from "@mui/material";
import style from "styled-jsx/style";

export default function Slider() {
  <>
    {/* <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
        <Box ref={trackRef} sx={{
          transform: `translateX(-${(current * 2.55) * 10}%)`,
          display: 'inline-flex',
          width: '100%',
          height: '100%',
          transition: 'transform 0.2s ease-in-out'
        }}>
          {previewImg ?
            previewImg.map((item, idx) => (
              <Box key={idx} sx={{
                width: '25%',
                height: '100%',
                flexShrink: 0,
                display: 'flex',
                marginRight: '10px',
                transition: 'all 0.1s linear',
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  backgroundPosition: 'center bottom',
                  backgroundSize: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}>
                  {previewImg ? (
                    <>
                      {item.isRepresent ? (
                        <Box sx={{
                          position: 'fixed',
                          bottom: 0,
                          marginLeft: '11.5%'
                        }}><CheckCircleIcon color='success' fontSize="small" /></Box>
                      ) : null}
                      <img ref={elem => (imgRef.current[idx] = elem)} alt={item.name} src={item.url} style={{
                        paddingLeft: '1.5px', width: '100%', height: '100%'
                      }} onClick={(e: React.MouseEvent<HTMLImageElement>) => handleImgClick(e)} />
                    </>) : null
                  }
                </Box>
              </Box>
            ))
            : null}
        </Box>
        <Box>
          <IconButton
            ref={prevRef}
            sx={{
              display: 'none'
            }}
            className={style.button__grp}
            type="button"
            onClick={() => handleCarouselClick('prev')}
          >
            <NavigateBeforeIcon
              sx={{
                color: 'white',
                background: 'rgb(75 75 75 / 55%)',
                borderRadius: '20px'
              }}
              fontSize='large' />
          </IconButton>
          <IconButton
            ref={nextRef}
            className={style.button__grp}
            type="button"
            sx={{
              left: "89.5%"
            }}
            onClick={() => handleCarouselClick('next')}
          >
            <NavigateNextIcon
              sx={{
                color: 'white',
                background: 'rgb(75 75 75 / 55%)',
                borderRadius: '20px'
              }}
              fontSize='large' />
          </IconButton>
        </Box>
      </Box>
    </Box> */}
  </>
}