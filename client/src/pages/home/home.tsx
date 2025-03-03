import React from 'react';
import './home.css';

import { NavigateFunction } from 'react-router-dom';
import { Settings } from 'lucide-react';
import RoomCard from '../../components/room-card/room-card';
import { asPage } from '../../utilities/page-wrapper';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  navigate: NavigateFunction;
}

interface State {}

// TODO: localize
class Home extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  constructor(props: Props) {
    super(props);
  }

  render() {
    // ---- RENDER BLOCK ----
    return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <div className="w-64 dark:bg-gray-800 shadow-lg p-6">
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
            <h1 className="text-3xl font-bold">Rooms</h1>
            <div className="flex items-center">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
export default asPage(Home);
