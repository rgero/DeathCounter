import { Box, Grid, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material"
import { CopyAll, Visibility, VisibilityOff } from "@mui/icons-material"

import BaseModal from "./BaseModal"
import toast from "react-hot-toast"
import { useDeathLists } from "../../context/DeathCounterContext"
import { useModalProvider } from "../../context/ModalContext"
import { useState } from "react"

const TokenModal = () => {
  const {tokenModalOpen, toggleTokenModal} = useModalProvider()
  const {getCurrentlyActiveDeathList, regenerateToken, isLoading} = useDeathLists()
  const [showToken, setShowToken] = useState(false);

  const currentlyActiveDeathList = getCurrentlyActiveDeathList();
  if (isLoading || !currentlyActiveDeathList) {
    return null;
  }

  const handleClickShowToken = () => setShowToken((show) => !show);

  const handleRegenerateToken = async () => {
    await regenerateToken();
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(currentlyActiveDeathList.token as string);
    toast.success("Token copied to clipboard");
  }

  return (
    <BaseModal
      open={tokenModalOpen}
      handleClose={toggleTokenModal}
      label="token-modal"
    >
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid>
          <Typography variant="h6">{currentlyActiveDeathList.name} - Token</Typography>
        </Grid>
        <Grid>
          <OutlinedInput
            id="outlined-adornment-token"
            type={showToken ? 'text' : 'password'}
            value={currentlyActiveDeathList.token}
            endAdornment={
              <InputAdornment position="end">
                <Box display="flex" alignItems="center" gap="4px">
                      <IconButton
                        aria-label={
                          showToken ? 'hide the token' : 'display the token'
                        }
                        onClick={handleClickShowToken}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    <IconButton
                      aria-label="copy token to clipboard"
                      onClick={copyTokenToClipboard}>
                      <CopyAll/>  
                    </IconButton>
                </Box>
              </InputAdornment>

            }
            label="Token"
          />
        </Grid>
        <Grid>
          <IconButton onClick={handleRegenerateToken}>
            <Typography variant="body2">Regenerate Token</Typography>
          </IconButton>     
        </Grid>
        <Grid>
          <IconButton onClick={toggleTokenModal}>
            <Typography variant="body2">Close</Typography>
          </IconButton>
        </Grid>
      </Grid>
    </BaseModal>
  )
}

export default TokenModal
