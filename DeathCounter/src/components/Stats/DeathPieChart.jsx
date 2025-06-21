import { Box, Typography } from "@mui/material";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useEffect, useState } from "react";

import { useDeathTracker } from "../../context/DeathTrackerContext";

const DeathPieChart = () => {
  const dimension = 350;
  const { deathList } = useDeathTracker();

  const [filteredItems, setFilteredItems] = useState([]);
  const [colors, setColors] = useState([]);
  const [showNames, setShowNames] = useState(true);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const filtered = deathList.filter(item => item.deaths !== 0).filter(item => item.name !== "Generic Deaths");
    setFilteredItems(filtered);
    setColors(filtered.map(() => getRandomColor()));
  }, [deathList]);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={colors[index]}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {showNames ? filteredItems[index].name : filteredItems[index].deaths}
      </text>
    );
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingBottom={10}>
      <PieChart width={dimension * 2} height={dimension}>
        <Tooltip/>
        <Pie
          dataKey="deaths"
          data={filteredItems}
          cx="50%"
          cy="50%"
          outerRadius={125}
          fill="#ac3232"
          label={renderLabel}
          labelLine={false}
          onClick={() => setShowNames(!showNames)}
        >
          {filteredItems.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
      </PieChart>
      <Typography variant="subtitle2">Click to toggle names</Typography>
    </Box>
  );
};

export default DeathPieChart;