import { Grid, IconButton, Popover, TextField, Tooltip } from "@mui/material";

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function SearchButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterBy, setFilterBy] = useState(searchParams.get('filter') || "")

  const processSearch = (e) => {
    searchParams.set("filter", e.target.value);
    setSearchParams(searchParams);
    setFilterBy(e.target.value);
  }

  const clearParams = () => {
    searchParams.set("filter", "");
    setSearchParams(searchParams);
    setFilterBy("");
  }

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip title="Search">
        <IconButton 
          aria-describedby={id} 
          variant="contained" 
          onClick={handleButtonClick}
        >
          <SearchIcon/>
        </IconButton>
      </Tooltip>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Grid container alignItems="center" sx={{padding: 2}}>
          <Grid item>
            <TextField
              autoFocus
              label="Search"
              variant="outlined"
              value={filterBy}
              onChange={processSearch}
            />
          </Grid>
          <Grid>
            <IconButton onClick={clearParams}>
              <ClearIcon/>
            </IconButton>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}

export default SearchButton;
