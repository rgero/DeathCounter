import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDeathListByToken } from "@services/apiDeathCounter";
import Loading from "@components/ui/Loading";
import PageNotFound from "@pages/PageNotFound";
import SharedListHeader from "@components/death_list/SharedListHeader";
import SharedListStats from "@components/death_list/SharedListStats";
import SharedEntityTable from "@components/death_list/SharedEntityTable";

const SharedDeathListPage = () => {
  const { token } = useParams<{ token: string }>();

  const { data: deathList, isLoading, error } = useQuery({
    queryKey: ["sharedDeathList", token],
    queryFn: () => {
      return getDeathListByToken(token!);
    },
    enabled: !!token,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (error || !deathList) {
    console.error("Failed to load death list:", error);
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

export default SharedDeathListPage;
