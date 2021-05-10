import React from 'react';
import Router from 'next/router';
import useRequest from '@/hooks/use-request';

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  });

  React.useEffect(() => {
    doRequest();
  }, []);

  return <div className="signout-page">Signing you out...</div>;
};
