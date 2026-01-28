import { useColorScheme } from 'react-native';
import { darkColors, lightColors, radius, shadow, spacing, typography } from './tokens';

export type ThemeColors = typeof lightColors;

export type Theme = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadow: {
    soft: typeof shadow.soft;
  };
  isDark: boolean;
};

export function getTheme(scheme?: 'light' | 'dark' | null): Theme {
  const isDark = scheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  return {
    colors,
    spacing,
    radius,
    typography,
    shadow: {
      soft: isDark ? shadow.softDark : shadow.soft,
    },
    isDark,
  };
}

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return getTheme(scheme);
}
