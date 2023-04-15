import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren, /* useEffect, */ useRef } from 'react';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { AuthProvider } from '../session';

export type TPageProps<PageProps> = {
  pageComponent: React.FC<PageProps>;
  layout?: (props: { children: JSX.Element }) => JSX.Element;
};

export type TPage = {
  (props: any): JSX.Element;
  getWrapper(children: JSX.Element): JSX.Element;
};

const expires = new Date();
const maxAge = 60 * 24 * 60 * 60; // in seconds
expires.setTime(expires.getTime() + maxAge * 1000);

const App: React.FC<PropsWithChildren> = ({ children }) => {
  // const router = useRouter();

  const systemColorScheme = useColorScheme();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: systemColorScheme,
  });
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  // use ref such that it is created once
  const queryClientRef = useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {},
    });
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          primaryColor: 'blue',
          // primaryShade: { light: 4, dark: 6 },
          defaultRadius: 'md',
          defaultGradient: { from: 'blue', to: 'cyan', deg: 45 },
          components: {
            Paper: {
              defaultProps: {
                shadow: 'xs',
              },
            },
            Card: {
              defaultProps: {
                shadow: 'xs',
              },
            },
            Checkbox: {
              defaultProps: {
                size: 'md',
              },
            },
            Button: {
              defaultProps: {
                size: 'md',
              },
            },
            TextInput: {
              defaultProps: {
                size: 'md',
              },
            },
            Textarea: {
              defaultProps: {
                size: 'md',
              },
            },
            Select: {
              defaultProps: {
                size: 'md',
              },
            },
          },
        }}
      >
        <QueryClientProvider client={queryClientRef.current}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

/**
 * Create an wrapper
 * @param props
 * @returns
 */
export const createWrapper = <TProps,>(props: TPageProps<TProps>): TPage => {
  const C = props.pageComponent;
  const Comp = (props: any) => <C {...props} />;

  Comp.getWrapper = (children: JSX.Element) => <App>{props.layout ? props.layout({ children }) : children}</App>;

  return Comp;
};
