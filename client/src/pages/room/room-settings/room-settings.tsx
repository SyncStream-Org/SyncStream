import './room-settings.css';
import React from 'react';
import { Types } from 'syncstream-sharedlib';
import Localize from '@/utilities/localize';
import PrimaryInput from '@/components/inputs/primary-input';
import PrimaryButton from '@/components/buttons/primary-button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getLocalInputDevice,
  setLocalInputDevice,
} from '@/api/routes/useWebRTCAudio';
import SessionState from '@/utilities/session-state';
import * as api from '../../../api';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { RoomDelete } from './room-delete';
import { RoomLeave } from './room-leave';
import { UserManagementSection } from '@/components/user-management/userManagement';

interface Props {
  room: Types.RoomData;
  usersInRoom: Types.RoomsUserData[];
  usersNotInRoom: Types.UserData[];
}

interface State {
  currentUserToModify: string;
  audioInputList: MediaDeviceInfo[];
  currentAudioInput: string | undefined;
  openDelete: boolean;
}

// TODO: localize
export default class RoomSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUserToModify: '',
      audioInputList: [],
      currentAudioInput: undefined,
      openDelete: false,
    };

    // Grab audio devices (and label of current audio device)
    navigator.mediaDevices.enumerateDevices().then((res) => {
      // Get local device label
      const localDevice = getLocalInputDevice();
      let newLabel: string | undefined;

      if (localDevice !== undefined) {
        newLabel = localDevice.getTracks()[0].label;
      }

      this.setState({
        audioInputList: res.filter((device) => device.kind === 'audioinput'),
        currentAudioInput: newLabel,
      });
    });
  }

  render() {
    // Grab localize engine
    const localize = Localize.getInstance().localize();

    const updateRoom = (event: React.SyntheticEvent) => {
      event.preventDefault();
      const target = event.target as typeof event.target & {
        roomName: { value: string };
        newOwner: { value: string };
      };

      // Build update object
      const updateObj: Types.RoomUpdateData = {};
      if (target.roomName.value !== '')
        updateObj.newRoomName = target.roomName.value;
      if (target.newOwner.value !== '')
        updateObj.newOwnerID = target.newOwner.value;

      api.Rooms.updateRoom(this.props.room.roomID!, updateObj).then(
        async (res) => {
          if (res !== api.SuccessState.SUCCESS) {
            window.electron.ipcRenderer.invokeFunction('show-message-box', {
              title: 'Error',
              message:
                'Something went wrong with the server and we could not update the room.',
            });
          }
        },
      );
    };

    const handleUserSelectChange = (value: string) => {
      this.setState({ currentUserToModify: value });
    };

    const handleAudioInputSelect = (value: string) => {
      const deviceInfo = this.state.audioInputList.filter(
        (info) => info.label === value,
      )[0];

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            deviceId: deviceInfo.deviceId,
          },
        })
        .then((stream) => {
          this.setState({ currentAudioInput: deviceInfo.label });
          setLocalInputDevice(stream);
        });

      // Save the selection in cache
      SessionState.getInstance().audioDeviceID = deviceInfo.deviceId;
    };
    
    const setOpenDelete = (open: boolean) => {
      this.setState({ openDelete: open });
    }

    const isRoomOwner =
      this.props.room.roomOwner! ===
      SessionState.getInstance().currentUser.username;
    // ---- RENDER BLOCK ----
    return (
      <div className="p-6 overflow-y-auto">
        {isRoomOwner && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Update Room
            </h2>
            <form onSubmit={updateRoom}>
              <PrimaryInput
                labelClassName="mt-1"
                label="New Room Name"
                id="roomName"
                type="text"
              />
              <PrimaryInput
                labelClassName="mt-1"
                label="New Room Owner"
                id="newOwner"
                type="text"
              />
              <PrimaryButton className="mt-3" text="Submit" type="submit" />
            </form>
            <UserManagementSection
              usersInRoom={this.props.usersInRoom}
              usersNotInRoom={this.props.usersNotInRoom}
              room={this.props.room}
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6">
              Delete Room
            </h2>
            <Dialog open={this.state.openDelete} onOpenChange={setOpenDelete}>
              <DialogTrigger asChild>
                <PrimaryButton
                  className="mt-3"
                  text="Delete Room"
                  type="button"
                />
              </DialogTrigger>
              <RoomDelete
                room={this.props.room}
                setOpen={setOpenDelete}
              />
            </Dialog>
          </>
        )}
        {!isRoomOwner && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6">
              Leave Room
            </h2>
            <Dialog open={this.state.openDelete} onOpenChange={setOpenDelete}>
              <DialogTrigger asChild>
                <PrimaryButton
                  className="mt-3"
                  text="Leave Room"
                  type="button"
                />
              </DialogTrigger>
              <RoomLeave
                room={this.props.room}
                setOpen={setOpenDelete}
              />
            </Dialog>
          </>
        )}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-6">
          Audio Input Device
        </h2>
        <Select onValueChange={handleAudioInputSelect}>
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={
                this.state.currentAudioInput === undefined
                  ? 'Audio Input'
                  : this.state.currentAudioInput
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Inputs</SelectLabel>
              {this.state.audioInputList.map((device) => (
                <SelectItem key={device.label} value={device.label}>
                  {device.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
}
