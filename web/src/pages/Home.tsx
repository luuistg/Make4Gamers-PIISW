
import PublicLanding from "../features/landing/components/PublicLanding";
import Dashboard from "../features/landing/components/Dashboard";
import { useAuthStatus } from "../features/auth/hooks/useAuthStatus";
import Spinner from "../shared/layout/Spinner";


function Home() {

  const { loading: authLoading, isAuthenticated } = useAuthStatus();

  if (authLoading) return <Spinner />; // Evita mostrar la landing pública un milisegundo

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <PublicLanding />}
    </>
  );
}

export default Home
