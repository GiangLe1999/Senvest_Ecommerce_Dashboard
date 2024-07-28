// Component Imports
import Providers from "@components/Providers";
import BlankLayout from "@layouts/BlankLayout";
import NotFound from "@views/NotFound";

// Config Imports

// Util Imports
import { getServerMode, getSystemMode } from "@core/utils/serverHelpers";

const NotFoundPage = () => {
  const mode = getServerMode();
  const systemMode = getSystemMode();

  return (
    <Providers>
      <BlankLayout systemMode={systemMode}>
        <NotFound mode={mode} />
      </BlankLayout>
    </Providers>
  );
};

export default NotFoundPage;
