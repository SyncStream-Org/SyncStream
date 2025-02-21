import React from 'react';
import './home.css';

import SessionState from '../../utilities/session-state';
import RoomCard from '../../components/room-card/room-card';

export default class Home extends React.Component<
  {},
  {
    sessionSaved: boolean;
  }
> {
  handleUnload: (event: BeforeUnloadEvent) => void;

  constructor(props: {}) {
    super(props);

    this.state = {
      sessionSaved: false,
    };

    this.handleUnload = (event: BeforeUnloadEvent) => {
      // If session is not saved, save and call app quit again
      if (!this.state.sessionSaved) {
        event.preventDefault();

        // Handle saving and then quite
        SessionState.getInstance()
          .saveCache()
          .then(() => {
            this.setState({ sessionSaved: true });
            window.electron.ipcRenderer.sendMessage('app-quit');
          });
      }
    };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.handleUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Online Users</h2>
          <ul>
            <li className="flex items-center mb-4">
              <img
                src="https://placehold.co/40x40"
                alt="User"
                className="rounded-full"
              />
              <span className="ml-3">User 1</span>
            </li>
            <li className="flex items-center mb-4">
              <img
                src="https://placehold.co/40x40"
                alt="User"
                className="rounded-full"
              />
              <span className="ml-3">User 2</span>
            </li>
            <li className="flex items-center mb-4">
              <img
                src="https://placehold.co/40x40"
                alt="User"
                className="rounded-full"
              />
              <span className="ml-3">User 3</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Room Collaboration</h1>
            <div className="flex items-center">
              <button
                type="button"
                className="mr-4 p-2 bg-gray-200 rounded-full"
              >
                <img src="https://placehold.co/24x24" alt="Settings" />
              </button>
              <img
                src="https://placehold.co/40x40"
                alt="Profile"
                className="rounded-full"
              />
            </div>
          </header>

          {/* Grid of Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RoomCard roomData={{ roomName: 'Test', roomOwner: 'Dev' }} />
          </div>
        </div>
      </div>
    );
  }
}
