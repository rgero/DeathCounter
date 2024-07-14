import { Container, Grid, TextField, Typography } from "@mui/material"

import ClearButton from "../Buttons/ClearButton"
import DeleteButton from "../Buttons/DeleteButton"
import ExportButton from "../Buttons/ExportButton"
import ImportButton from "../Buttons/ImportButton"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"

const DeathPageHeader = ({deaths}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterBy, setFilterBy] = useState(searchParams.get('filter') || "")

  const processSearch = (e) => {
    searchParams.set("filter", e.target.value);
    setSearchParams(searchParams);
    setFilterBy(e.target.value);
  }

  return (
    <Container sx={{paddingBottom: 2, paddingX: 2}}>
      <Grid container alignItems="center" justifyContent="space-around">
        <Grid item>
          <Typography>
            Bosses: {deaths.length} | 
            Deaths: {deaths.reduce((total, currentItem) => total + currentItem.deaths, 0)}
          </Typography>
        </Grid>
        <Grid item>
          <TextField size="small" value={filterBy} onChange={processSearch}/>
        </Grid>
        <Grid item>
          <DeleteButton/>
          <ClearButton/>
          <ImportButton/>
          <ExportButton/>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DeathPageHeader
