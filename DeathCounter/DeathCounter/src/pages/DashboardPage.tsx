import { Container } from "@mui/material"
import DeathDescription from '@components/death_list/DeathDescription';
import DeathListTable from '@components/death_list/DeathListTable';
import DeathlistHeader from '@components/death_list/DeathlistHeader';
import EntityForm from '@components/death_list/EntityForm';
import Loading from '@components/ui/Loading';
import NoDeathListFound from '@components/death_list/NoDeathListFound';
import { useDeathLists } from '@context/deathCounter/DeathCounterContext';

const DashboardPage = () => {
  const {deathLists, isLoading} = useDeathLists();
  if (isLoading) {
    return <Loading/>
  }

  const selectedDeathList = deathLists.find((deathList) => {
    return deathList.currentlyActive;
  });

  return (
    <Container>
      {selectedDeathList ? (
        <>
          <DeathlistHeader/>
          <DeathDescription/>
          <DeathListTable/>
          <EntityForm/>
        </>
      ) : (
        <NoDeathListFound/>
      )}
    </Container>
  )
}

export default DashboardPage
