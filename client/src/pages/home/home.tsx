import { useState, useEffect, SyntheticEvent, useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Settings, Plus, UserCheck2Icon } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Localize from '@/utilities/localize';
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
  const [roomPresence, setRoomPresence] = useState<Map<string, string[]>>(
    new Map<string, string[]>(),
  );

  const localize = Localize.getInstance().localize();

  const fetchRooms = useCallback(() => {
    if (SessionState.getInstance().currentUser.admin) {
      api.Admin.getAllRooms().then((res) => {
        if (
          res.success === api.SuccessState.ERROR ||
          res.success === api.SuccessState.FAIL
        ) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: localize.homePage.messageBox.errorTitle,
            message: localize.homePage.messageBox.roomFetchError,
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
            title: localize.homePage.messageBox.errorTitle,
            message: localize.homePage.messageBox.roomFetchError,
          });
        } else {
          if (res.data === undefined) throw Error('Unreachable');

          setRooms(res.data);
        }
      });
    }
  }, [
    localize.homePage.messageBox.errorTitle,
    localize.homePage.messageBox.roomFetchError,
  ]);

  const fetchRoomPresence = useCallback(() => {
    api.User.getRoomPresence().then((res) => {
      if (res.success !== api.SuccessState.SUCCESS) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.homePage.messageBox.errorTitle,
          message: localize.homePage.messageBox.roomPresenceError,
        });
      } else {
        if (res.data === undefined) throw Error('Unreachable');
        const newMap = new Map<string, string[]>();
        res.data.forEach((presence) => {
          newMap.set(presence.roomID, presence.users);
        });
        setRoomPresence(newMap);
      }
    });
  }, [
    localize.homePage.messageBox.errorTitle,
    localize.homePage.messageBox.roomPresenceError,
  ]);

  const addRoom = (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      roomName: { value: string };
    };

    api.Rooms.createRoom(target.roomName.value).then((res) => {
      if (res.success === api.SuccessState.ERROR) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.homePage.messageBox.errorTitle,
          message: localize.homePage.messageBox.roomCreationError1,
        });
      } else if (res.success === api.SuccessState.FAIL) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: localize.homePage.messageBox.errorTitle,
          message: localize.homePage.messageBox.roomCreationError2,
        });
      }
    });
  };

  const onRoomUpdate = useCallback(
    (type: Types.UpdateType, update: Types.RoomData) => {
      setRooms((prevRooms) => {
        switch (type) {
          case 'update':
            return prevRooms.map((room) =>
              room.roomID === update.roomID ? update : room,
            );
          case 'delete':
            return prevRooms.filter((room) => room.roomID !== update.roomID);
          case 'create':
            // check if the room already exists
            return prevRooms.find((room) => room.roomID === update.roomID) !==
              undefined
              ? prevRooms
              : [...prevRooms, update];
          default:
            return prevRooms;
        }
      });
    },
    [],
  );

  const onPresenceUpdate = useCallback(
    (type: Types.UpdateType, update: Types.UserPresenceData) => {
      console.log('onPresenceUpdate', type, update);
      setRoomPresence((prev) => {
        const newMap = new Map(prev);
        if (type === 'create') {
          if (newMap.has(update.roomID)) {
            newMap.set(update.roomID, [
              ...newMap.get(update.roomID)!,
              update.username,
            ]);
          } else {
            newMap.set(update.roomID, [update.username]);
          }
        } else if (type === 'delete') {
          if (newMap.has(update.roomID)) {
            const users = newMap.get(update.roomID)!;
            users.splice(users.indexOf(update.username), 1);
            if (users.length === 0) {
              newMap.delete(update.roomID);
            } else {
              newMap.set(update.roomID, users);
            }
          }
        }
        return newMap;
      });
    },
    [],
  );

  useHomeSse(
    SessionState.getInstance().sessionToken,
    onRoomUpdate,
    onPresenceUpdate,
  );

  useEffect(() => {
    fetchRooms();
    fetchRoomPresence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{localize.homePage.title}</h1>
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 mr-2"
                >
                  <Plus size={16} />
                  {localize.homePage.createRoom.button}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <h4 className="space-y-2 font-medium leading-none">
                    {localize.homePage.createRoom.popupTitle}
                  </h4>
                  <form onSubmit={addRoom} className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="roomName">
                        {localize.homePage.createRoom.inputLabel}
                      </Label>
                      <Input
                        id="roomName"
                        defaultValue=""
                        className="col-span-2 h-8"
                      />
                    </div>
                    <Button type="submit">
                      {localize.homePage.createRoom.submit}
                    </Button>
                  </form>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 mr-2"
              onClick={() => {
                props.navigate('/settings');
              }}
            >
              <Settings size={16} />
              {localize.homePage.settingsButton}
            </Button>
            {SessionState.getInstance().currentUser.admin && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 mr-2"
                onClick={() => {
                  props.navigate('/admin-panel');
                }}
              >
                <UserCheck2Icon size={16} />
                {localize.homePage.adminPanelButton}
              </Button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {SessionState.getInstance().currentUser.username[0]}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-semibold">{`${
                    localize.homePage.avatarTooltip
                  } ${SessionState.getInstance().currentUser.username}`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Grid of Current Rooms */}
        <div
          className={`overflow-y-auto border rounded-md p-4 ${
            invitedRooms.length === 0
              ? 'max-h-[calc(100vh-120px)]'
              : 'max-h-[calc(70vh-120px)]'
          } pr-2`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentRooms.map((room) => (
              <RoomCard
                key={room.roomName}
                roomData={room}
                navigate={props.navigate}
                updateRoomList={fetchRooms}
                users={roomPresence.get(room.roomID!) || []}
              />
            ))}
          </div>
        </div>

        {/* Grid of Invited Rooms */}
        {invitedRooms.length !== 0 && (
          <>
            <h1 className="mt-4 text-xl font-bold">Invites</h1>
            <div
              className={`overflow-y-auto border rounded-md p-4 ${
                invitedRooms.length === 0
                  ? 'max-h-[calc(100vh-120px)]'
                  : 'max-h-[calc(50vh-120px)]'
              } pr-2`}
            >
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default asPage(Home, false);
