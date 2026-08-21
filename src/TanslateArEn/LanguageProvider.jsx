import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getTheme } from "./theme";

const rtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const ltrCache = createCache({
  key: "muiltr",
});

export default function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  const theme = useMemo(
    () => getTheme(i18n.language),
    [i18n.language]
  );

  const cache =
    i18n.language === "ar"
      ? rtlCache
      : ltrCache;

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}