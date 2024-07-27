// Type Imports
import type { ChildrenType, Direction } from "@core/types";

// Context Imports
import { NextAuthProvider } from "@/contexts/nextAuthProvider";
import { VerticalNavProvider } from "@menu/contexts/verticalNavContext";
import { SettingsProvider } from "@core/contexts/settingsContext";
import ThemeProvider from "@components/theme";
import ReduxProvider from "@/redux-store/ReduxProvider";

// Styled Component Imports
import AppReactToastify from "@/libs/styles/AppReactToastify";

// Util Imports
import {
  getMode,
  getSettingsFromCookie,
  getSystemMode,
} from "@core/utils/serverHelpers";

type Props = ChildrenType;

const Providers = (props: Props) => {
  // Props
  const { children } = props;

  // Vars
  const mode = getMode();
  const settingsCookie = getSettingsFromCookie();
  const systemMode = getSystemMode();

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
          <ThemeProvider systemMode={systemMode}>
            <ReduxProvider>{children}</ReduxProvider>
            <AppReactToastify hideProgressBar />
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </NextAuthProvider>
  );
};

export default Providers;
