import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '@/api/build-client';
import Header from '@/components/header';
import './app.css'

const AppComponent = ({ Component, pageProps, me }) => {
  console.log("_app page", me)
  return (
    <main>
      <Header currentUser={me} />
      <section className="page-layout">
        <Component {...pageProps} />
      </section>
    </main>
  );
};

/**
 * appContext = { AppTree, router, Component, ctx: { req, res } }
 */
AppComponent.getInitialProps = async appContext => {
  const apiClient = buildClient(appContext.ctx);
  const { data } = await apiClient.get('/api/users/me');
  /**
   * `getInitialProps` in custom _app component will wrapper other components and getInitialProps 
   * in other pages just does not work, so we need tio call it manually and pass props to it
   */
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    ...data
  };
};

export default AppComponent;
