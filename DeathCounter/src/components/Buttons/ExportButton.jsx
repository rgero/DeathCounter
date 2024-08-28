import { IconButton, Tooltip } from "@mui/material";

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDeathTracker } from "../../context/DeathTrackerContext";

const ExportButton = () => {
  const { gameName, deathList } = useDeathTracker();

  const createExportObject = () => {
    const sortedList = deathList.sort((a, b) => a.id - b.id);
    return { gameName, deathList: sortedList };
  };

  const createBlob = (data) => {
    const jsonString = JSON.stringify(data);
    return new Blob([jsonString], { type: 'application/json' });
  };

  const createDownloadLink = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const processDownload = () => {
    const exportObject = createExportObject();
    const blob = createBlob(exportObject);
    const fileName = gameName ? `${gameName}.json` : 'Deaths.json';
    createDownloadLink(blob, fileName);
  };

  return (
    <Tooltip title="Download data">
      <IconButton onClick={processDownload}>
        <FileDownloadIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ExportButton;