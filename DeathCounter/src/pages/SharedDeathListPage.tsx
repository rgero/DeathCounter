import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getDeathListByToken } from "@services/apiDeathCounter";
import PageNotFound from "@pages/PageNotFound";
import SharedListHeader from "@components/death_list/SharedListHeader";
import SharedListStats from "@components/death_list/SharedListStats";
import SharedEntityTable from "@components/death_list/SharedEntityTable";

const SharedDeathListContent = ({ token }: { token: string }) => {
  const { data: deathList } = useSuspenseQuery({
    queryKey: ["sharedDeathList", token],
    queryFn: async () => {
      try {
        return await getDeathListByToken(token);
      } catch (error) {
        console.error("Failed to load death list:", error);
        return null;
      }
    },
  });

  if (!deathList) {
    return <PageNotFound />;
  }

  const totalDeaths = deathList.entityList?.reduce((acc, entity) => acc + (entity.deaths || 0), 0) || 0;
  const totalEntities = deathList.entityList?.length || 0;

  return (
    <Container sx={{ pb: 4 }}>
      <SharedListHeader deathList={deathList} />
      
      {deathList.entityList && deathList.entityList.length > 0 && (
        <>
          <SharedListStats totalDeaths={totalDeaths} totalEntities={totalEntities} />
          <SharedEntityTable entities={deathList.entityList} />
        </>
      )}
      
      {(!deathList.entityList || deathList.entityList.length === 0) && (
        <SharedEntityTable entities={[]} />
      )}
    </Container>
  );
};

const SharedDeathListPage = () => {
  const { token } = useParams<{ token: string }>();

  if (!token) {
    return <PageNotFound />;
  }

  return <SharedDeathListContent token={token} />;
};

export default SharedDeathListPage;
