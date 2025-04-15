import { useState, useEffect, SyntheticEvent, useCallback } from 'react';
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
import SessionState from '@/utilities/session-state';
import { asPage } from '@/utilities/page-wrapper';
import { Button } from '@/components/ui/button';
import { useHomeSse } from '../../api/routes/useHomeSse';
import * as api from '../../api';
import RoomCard from './room-card/room-card';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  toggleDarkMode: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  doneLoading: () => void;
  navigate: NavigateFunction;
}

function Home(props: Props) {
  const [rooms, setRooms] = useState<Types.RoomData[]>([]);
  const currentRooms = rooms.filter((room) => room.isMember);
  const invitedRooms = rooms.filter((room) => !room.isMember);

  const fetchRooms = useCallback(() => {
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
          setRooms(res.data.map((room) => ({ isMember: true, ...room })));
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

          setRooms(res.data);
        }
      });
    }
  }, []);

  const addRoom = (event: SyntheticEvent) => {
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
      }
    });
  };

  const onRoomUpdate = useCallback(
    (type: Types.UpdateType, update: Types.RoomData) => {
      console.log('Room update:', type, update);
      setRooms((prevRooms) => {
        switch (type) {
          case 'update':
            return prevRooms.map((room) =>
              room.roomID === update.roomID ? update : room,
            );
          case 'delete':
            return prevRooms.filter((room) => room.roomID !== update.roomID);
          case 'create':
            return [...prevRooms, update];
          default:
            return prevRooms;
        }
      });
    },
    [],
  );

  useHomeSse(SessionState.getInstance().sessionToken, onRoomUpdate);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                props.navigate('/settings');
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
          {currentRooms.map((room) => (
            <RoomCard
              key={room.roomName}
              roomData={room}
              navigate={props.navigate}
              updateRoomList={fetchRooms}
            />
          ))}
        </div>

        {/* Grid of Invited Rooms */}
        {invitedRooms.length !== 0 && (
          <>
            <h1 className="mt-4 text-3xl font-bold">Invites</h1>
            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invitedRooms.map((room) => (
                <RoomCard
                  key={room.roomName}
                  roomData={room}
                  navigate={props.navigate}
                  updateRoomList={fetchRooms}
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
export default asPage(Home, false);
