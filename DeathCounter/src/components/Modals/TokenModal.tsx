import { Box, Grid, IconButton, InputAdornment, OutlinedInput, Typography } from "@mui/material"
import { CopyAll, Visibility, VisibilityOff } from "@mui/icons-material"
import { useEffect, useState } from "react"

import BaseModal from "./BaseModal"
import { encryptAuthToken } from "../../utils/crypt"
import toast from "react-hot-toast"
import { useDeathLists } from "../../context/DeathCounterContext"
import { useModalProvider } from "../../context/ModalContext"

const TokenModal = () => {
  const {tokenModalOpen, toggleTokenModal} = useModalProvider()
  const {activeDeathList, regenerateToken, isLoading} = useDeathLists()
  const [showToken, setShowToken] = useState(false);
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [encryptedAuthToken, setEncryptedAuthToken] = useState("");

  useEffect(() => {
    if (activeDeathList?.token) {
      setEncryptedAuthToken(encryptAuthToken(activeDeathList.token));
    }
  }, [activeDeathList?.token]);

  if (isLoading || !activeDeathList) {
    return null;
  }

  const handleClickShowToken = () => setShowToken((show) => !show);
  const handleClickShowAuthToken = () => setShowAuthToken((show) => !show);

  const handleRegenerateToken = async () => {
    await regenerateToken();
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const copyTokensToClipboard = () => {
    const tokens = {
      gameToken: activeDeathList.token,
      authToken: encryptedAuthToken
    }

    navigator.clipboard.writeText(JSON.stringify(tokens));
    toast.success("Tokens copied to clipboard");
  }

  return (
    <BaseModal
      open={tokenModalOpen}
      handleClose={toggleTokenModal}
      label="token-modal"
    >
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid>
          <Typography variant="h6">{activeDeathList.name} - Token</Typography>
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <Grid>
            <Typography>Game Token</Typography>
            <OutlinedInput
              id="outlined-adornment-token"
              type={showToken ? 'text' : 'password'}
              value={activeDeathList.token}
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
                  </Box>
                </InputAdornment>

              }
              label="Token"
            />
            <Grid>
              <Typography>Websocket Auth Token</Typography>
              <OutlinedInput
                id="outlined-adornment-token"
                type={showAuthToken ? 'text' : 'password'}
                value={encryptedAuthToken}
                endAdornment={
                  <InputAdornment position="end">
                    <Box display="flex" alignItems="center" gap="4px">
                          <IconButton
                            aria-label={
                              showAuthToken ? 'hide the token' : 'display the token'
                            }
                            onClick={handleClickShowAuthToken}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                          >
                            {showAuthToken ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                    </Box>
                  </InputAdornment>

                }
                label="Auth Token"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <IconButton onClick={copyTokensToClipboard}>
            <CopyAll />
            <Typography variant="body2">Copy Tokens</Typography>
          </IconButton>
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
