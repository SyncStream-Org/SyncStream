import React from 'react';
import './room-card.css';

import { Types } from 'syncstream-sharedlib';

export default class RoomCard extends React.Component<
  {
    roomData: Types.RoomData;
  },
  {}
> {
  constructor(props: { roomData: Types.RoomData }) {
    super(props);

    this.state = {};
  }

  // TODO: make card open room on click
  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">
          {this.props.roomData.roomName}
        </h3>
        <p className="text-gray-600">Owner: {this.props.roomData.roomOwner}</p>
      </div>
    );
  }
}
