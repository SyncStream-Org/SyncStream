import React from 'react';
import './room-card.css';

import { Types } from 'syncstream-sharedlib';
import { NavigateFunction } from 'react-router-dom';
import * as api from '../../../api';
import { SuccessState } from '@/api';

interface Props {
  roomData: Types.RoomData;
  navigate: NavigateFunction;
}

interface State {}

export default class RoomCard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  // TODO: Make card display if you are part of a room officially or not if the user is admin
  render() {
    const handleJoinRoom = (event: React.SyntheticEvent) => {
      api.User.joinRoomPresence(this.props.roomData.roomID!).then(
        (success: SuccessState) => {
          if (
            success === api.SuccessState.ERROR ||
            success === api.SuccessState.FAIL
          ) {
            window.electron.ipcRenderer.invokeFunction('show-message-box', {
              title: 'Error',
              message: 'Unable to join room at this time.',
            });
          } else {
            this.props.navigate(`/room/${this.props.roomData.roomID}`);
          }
        },
      );
    };
    // ---- RENDER BLOCK ----
    return (
      <div
        className="dark:bg-gray-800 p-6 rounded-lg shadow-md"
        onClick={handleJoinRoom}
      >
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
