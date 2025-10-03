import { Grid, IconButton, alpha } from "@mui/material"

import { Add } from "@mui/icons-material"
import GameSelector from "../ui/GameSelector"
import UserAvatar from "./UserAvatar"
import { grey } from "@mui/material/colors"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useModalProvider } from "../../context/modal/ModalContext"

const HeaderOptionsPanel = () => {
  const {toggleCreateNewModal} = useModalProvider();
  const isMobile = useIsMobile();

  return (

    <Grid container alignItems="center" justifyContent="center" spacing={1} sx={{backgroundColor: alpha(grey[900], 0.9), borderRadius: "8px", padding: "0.25rem 0.5rem"}}>
      {!isMobile && (
        <>
          <Grid>
            <GameSelector/>
          </Grid>
          <Grid>
            <IconButton onClick={toggleCreateNewModal} size="small" sx={{color: "white"}}>
              <Add/>
            </IconButton>
          </Grid>
        </>
      )}
      <Grid>
        <UserAvatar />
      </Grid>
    </Grid>
  )
}

export default HeaderOptionsPanel
