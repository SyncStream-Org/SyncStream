import { NavigateFunction } from 'react-router-dom';
import './room-settings.css';
import React from 'react';
import Localize from '@/utilities/localize';
import { asPage } from '@/utilities/page-wrapper';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  navigate: NavigateFunction;
}

interface State {}

// TODO: localize
class RoomSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // ---- RENDER BLOCK ----
    return <div className="min-h-screen flex" />;
  }
}

// Add wrapper for navigation function
export default asPage(RoomSettings, false);
