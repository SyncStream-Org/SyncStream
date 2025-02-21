// Used for adding router functions to page components

import { useNavigate } from 'react-router-dom';

export const withRouter = (Component: any) => {
  function Wrapper(props: any) {
    const navigate = useNavigate();

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Component navigate={navigate} {...props} />;
  }

  return Wrapper;
};
