import React from 'react';
import './room-card.css';

import { Types } from 'syncstream-sharedlib';
import { NavigateFunction } from 'react-router-dom';
import SessionState from '@/utilities/session-state';
import { Check, X } from 'lucide-react';
import * as api from '../../../api';

interface Props {
  roomData: Types.RoomData;
  navigate: NavigateFunction;
  isInvite?: boolean;
}

interface State {}

export default class RoomCard extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    isInvite: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    const handleJoinRoom = (event: React.SyntheticEvent) => {
      if (
        !this.props.isInvite ||
        (this.props.isInvite &&
          SessionState.getInstance().currentUser.admin)
      ) {
        api.User.joinRoomPresence(this.props.roomData.roomID!).then(
          (success: api.SuccessState) => {
            if (
              success === api.SuccessState.ERROR ||
              success === api.SuccessState.FAIL
            ) {
              window.electron.ipcRenderer.invokeFunction('show-message-box', {
                title: 'Error',
                message: 'Unable to join room at this time.',
              });
            } else {
              this.props.navigate(`/room`, {
                state: { room: this.props.roomData },
              });
            }
          },
        );
      }
    };
    const acceptInvite = (event: React.SyntheticEvent) => {
      if (this.props.roomData.roomID === undefined) throw Error('Unreachable');
      api.User.acceptInviteToRoom(this.props.roomData.roomID).then((res) => {
        if (res === api.SuccessState.ERROR) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Unable to accept invite to room. Something went wrong with the server.',
          });
        } else if (res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Unable to accept invite to room. Room with that name may not exist or you may not be invited to that room.',
          });
        }
      });
    };

    const rejectInvite = (event: React.SyntheticEvent) => {
      if (this.props.roomData.roomID === undefined) throw Error('Unreachable');
      api.User.declineInviteToRoom(this.props.roomData.roomID).then((res) => {
        if (res === api.SuccessState.ERROR) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Unable to decline invite to room. Something went wrong with the server.',
          });
        } else if (res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Unable to decline invite to room. Room with that name may not exist or you may not be invited to that room.',
          });
        }
      });
    };

    // ---- RENDER BLOCK ----
    return (
      <div
        className="dark:bg-gray-800 p-6 rounded-lg shadow-md"
        onClick={handleJoinRoom}
      >
        <div className="flex flex-row">
          <div className="grow">
            <h3 className="text-xl font-bold mb-2">
              {this.props.roomData.roomName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Owner: {this.props.roomData.roomOwner}
            </p>
          </div>
          {this.props.isInvite && (
            <>
              <button
                type="button"
                className="my-auto mr-2 p-2 bg-gray-200 rounded-full text-gray-800"
                onClick={acceptInvite}
              >
                <Check className="max-h-7 " />
              </button>
              <button
                type="button"
                className="my-auto mr-2 p-2 bg-gray-200 rounded-full text-gray-800"
                onClick={rejectInvite}
              >
                <X className="max-h-7 " />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}
