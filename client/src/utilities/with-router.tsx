// Used for adding router functions to page components

import { useNavigate } from 'react-router-dom';

export const withRouter = (Component: any) => {
  function Wrapper(props: any) {
    const navigate = useNavigate();

    return <Component navigate={navigate} {...props} />;
  }

  return Wrapper;
};
