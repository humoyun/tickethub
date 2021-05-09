import buildClient from '@/api/build-client';

const Home = ({ currentUser }) => {
  console.log("Home currentUser", currentUser)
  return currentUser ? (
    <h1 className="text">You are signed in</h1>
  ) : (
    <h1 className="text">You are NOT signed in</h1>
  );
};

Home.getInitialProps = async context => {
  console.log('HOME PAGE!');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/me');
  console.log('data', data)

  return {
    currentUser: data.me
  };
};

export default Home;
