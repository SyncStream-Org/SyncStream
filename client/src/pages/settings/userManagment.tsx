import React from 'react';
import './settings.css';

import Localize from '../../utilities/localize';

interface Props {}

interface State {}

export default class UserManagementSettings extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // ---- RENDER BLOCK ----
    return (
      <p className="text-gray-600 dark:text-gray-300">
        User Management settings content goes here...
      </p>
    );
  }
}
