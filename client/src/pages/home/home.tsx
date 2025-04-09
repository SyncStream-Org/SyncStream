import React from 'react';
import './home.css';

import { NavigateFunction } from 'react-router-dom';
import { Settings, CirclePlus } from 'lucide-react';
import { Types } from 'syncstream-sharedlib';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Localize from '@/utilities/localize';
import SessionState from '@/utilities/session-state';
import { asPage } from '@/utilities/page-wrapper';
import { Button } from '@/components/ui/button';
import * as api from '../../api';
import RoomCard from './room-card/room-card';
import { useHomeSse } from '@/api/routes/useHomeSse';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  navigate: NavigateFunction;
}

interface State {
  currentRooms: Types.RoomData[];
  invitedRooms: Types.RoomData[];
  updateRoomList: () => void;
}

// TODO: localize
class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentRooms: [],
      invitedRooms: [],
      updateRoomList: () => {
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

              this.setState({
                currentRooms: res.data,
                invitedRooms: [],
              });
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

              const current = res.data.filter((roomData) => roomData.isMember);
              const invited = res.data.filter((roomData) => !roomData.isMember);
              this.setState({
                currentRooms: current,
                invitedRooms: invited,
              });
            }
          });
        }
      },
    };

    // Grab all rooms available to user (or all rooms if admin)
    this.state.updateRoomList();
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    // Add room
    const addRoom = (event: React.SyntheticEvent) => {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        roomName: { value: string };
      };

      api.Rooms.createRoom(target.roomName.value).then((res) => {
        if (res.success === api.SuccessState.ERROR) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Unable to create room. Something went wrong with the server.',
          });
        } else if (res.success === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message: 'Unable to create room. Room with name may already exist',
          });
        } else {
          this.state.updateRoomList();
        }
      });
    };

    // ---- RENDER BLOCK ----
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Home</h1>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mr-4 p-2 bg-gray-200 rounded-full text-gray-800"
                  >
                    <CirclePlus className="max-h-7" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <h4 className="space-y-2 font-medium leading-none">
                      Add Room
                    </h4>
                    <form onSubmit={addRoom} className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="roomName">Room Name</Label>
                        <Input
                          id="roomName"
                          defaultValue=""
                          className="col-span-2 h-8"
                        />
                      </div>
                      <Button type="submit">Submit</Button>
                    </form>
                  </div>
                </PopoverContent>
              </Popover>

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

          {/* Grid of Current Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {this.state.currentRooms.map((room) => (
              <RoomCard
                key={room.roomName}
                roomData={room}
                navigate={this.props.navigate}
                updateRoomList={this.state.updateRoomList}
              />
            ))}
          </div>

          {/* Grid of Invited Rooms */}
          {this.state.invitedRooms.length !== 0 && (
            <>
              <h1 className="mt-4 text-3xl font-bold">Invites</h1>
              <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {this.state.invitedRooms.map((room) => (
                  <RoomCard
                    key={room.roomName}
                    roomData={room}
                    navigate={this.props.navigate}
                    updateRoomList={this.state.updateRoomList}
                    isInvite
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

// Add wrapper for navigation function
export default asPage(Home, false);
