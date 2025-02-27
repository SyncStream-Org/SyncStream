import React from 'react';
import './room-card.css';

import { Types } from 'syncstream-sharedlib';

interface Props {
  roomData: Types.RoomData;
}

interface State {}

export default class RoomCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  // TODO: make card open room on click
  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">
          {this.props.roomData.roomName}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Owner: {this.props.roomData.roomOwner}
        </p>
      </div>
    );
  }
}
