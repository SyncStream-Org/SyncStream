import React from 'react';
import './home.css';

import { NavigateFunction } from 'react-router-dom';
import { Settings, CirclePlus } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import * as api from '../../api';
import RoomCard from './room-card/room-card';
import { asPage } from '../../utilities/page-wrapper';
import SessionState from '../../utilities/session-state';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  navigate: NavigateFunction;
}

interface State {
  rooms: Types.RoomData[];
}

// TODO: localize
class Home extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);

    this.state = {
      rooms: [],
    };

    // Grab all rooms available to user (or all rooms if admin)
    if (SessionState.getInstance().currentUser.admin) {
      api.Admin.getAllRooms().then((res) => {
        if (
          res.success === api.SuccessState.ERROR ||
          res.success === api.SuccessState.FAIL
        ) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message: 'Unable to get room data at this time.',
          });
        } else {
          if (res.data === undefined) throw Error('Unreachable');
          this.setState({ rooms: res.data });
        }
      });
    } else {
      api.User.getRooms().then((res) => {
        if (
          res.success === api.SuccessState.ERROR ||
          res.success === api.SuccessState.FAIL
        ) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message: 'Unable to get room data at this time.',
          });
        } else {
          if (res.data === undefined) throw Error('Unreachable');
          this.setState({ rooms: res.data });
        }
      });
    }
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 p-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Rooms</h1>
            <div className="flex items-center">
              <button
                type="button"
                className="mr-4 p-2 bg-gray-200 rounded-full text-gray-800"
                onClick={() => {
                  this.props.navigate('/settings');
                }}
              >
                <CirclePlus className="max-h-7 " />
              </button>
              <button
                type="button"
                className="mr-4 p-2 bg-gray-200 rounded-full text-gray-800"
                onClick={() => {
                  this.props.navigate('/settings');
                }}
              >
                <Settings className="max-h-7 " />
              </button>
              <img
                src="https://placehold.co/40x40"
                alt="Profile"
                className="rounded-full"
              />
            </div>
          </header>

          {/* Grid of Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {this.state.rooms.map((room) => (
              <RoomCard roomData={room} navigate={this.props.navigate} />
            ))}
            {/* TODO: remove once room managment is finished */}
            <RoomCard
              roomData={{ roomName: 'Test', roomOwner: 'Dev', roomID: '1' }}
              navigate={this.props.navigate}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Home, false);
