const Home = ({ currentUser }) => {
  console.log("Home currentUser", currentUser)
  return currentUser ? (
    <h1 className="text">You are signed in</h1>
  ) : (
    <h1 className="text">You are NOT signed in</h1>
  );
};

Home.getInitialProps = async (context, apiClient, currentUser) => { 
  return {};
};

export default Home;
