import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '@/api/build-client';
import Header from '@/components/header';

const AppComponent = ({ Component, pageProps, me }) => {
  console.log("_app page", )
  return (
    <div>
      <Header currentUser={me} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  const apiClient = buildClient(appContext.ctx);
  const { data } = await apiClient.get('/api/users/me');
  
  /**
   * TODO: needs explanation
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
