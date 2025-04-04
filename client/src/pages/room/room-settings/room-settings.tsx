import './room-settings.css';
import React from 'react';
import Localize from '@/utilities/localize';
import { Types } from 'syncstream-sharedlib';
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
import * as api from '../../../api';

interface Props {
  roomID: string;
}

interface State {
  allUsers: string[];
  usersInRoom: string[];
  currentUserToModify: string;
}

// TODO: localize
export default class RoomSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      allUsers: [],
      usersInRoom: [],
      currentUserToModify: '',
    };

    api.User.getAllUsers().then(async (res) => {
      if (
        res.success === api.SuccessState.ERROR ||
        res.success === api.SuccessState.FAIL
      ) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message:
            'Something went wrong with the server and we could not grab username data.',
        });
      } else {
        if (res === undefined || res.data === undefined)
          throw Error('Unreachable');
        this.setState({ allUsers: res.data.map((data) => data.username) });
      }
    });

    api.Rooms.listMembers(this.props.roomID).then(async (res) => {
      if (
        res.success === api.SuccessState.ERROR ||
        res.success === api.SuccessState.FAIL
      ) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message:
            'Something went wrong with the server and we could not grab room member data.',
        });
      } else {
        if (res === undefined || res.data === undefined)
          throw Error('Unreachable');
        this.setState({ usersInRoom: res.data.map((data) => data.username) });
      }
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

      api.Rooms.updateRoom(this.props.roomID, updateObj).then(async (res) => {
        if (res === api.SuccessState.ERROR || res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Something went wrong with the server and we could not update the room.',
          });
        }
      });
    };

    const handleSelectChange = (value: string) => {
      this.setState({ currentUserToModify: value });
    };

    const handleInvite = () => {
      if (this.state.usersInRoom.includes(this.state.currentUserToModify)) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message: 'Can not invite a user that is already in the room.',
        });
        return;
      }

      api.Rooms.inviteUser(this.props.roomID, {
        username: this.state.currentUserToModify,
      }).then(async (res) => {
        if (res === api.SuccessState.ERROR || res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Something went wrong with the server and we could not invite the user.',
          });
        }
      });
    };

    const handleBan = () => {
      if (
        this.state.allUsers
          .filter((val) => !this.state.usersInRoom.includes(val))
          .includes(this.state.currentUserToModify)
      ) {
        window.electron.ipcRenderer.invokeFunction('show-message-box', {
          title: 'Error',
          message: 'Can not ban a user that is not in the room.',
        });
        return;
      }

      api.Rooms.removeUser(
        this.props.roomID,
        this.state.currentUserToModify,
      ).then(async (res) => {
        if (res === api.SuccessState.ERROR || res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: 'Error',
            message:
              'Something went wrong with the server and we could not invite the user.',
          });
        }
      });
    };

    // ---- RENDER BLOCK ----
    return (
      <div className="p-6">
        <h2 className="text-xl mt-3 text-gray-800 dark:text-gray-100">
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

        <h2 className="text-xl mt-3 text-gray-800 dark:text-gray-100">
          Invite or Ban User
        </h2>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="User to Modify" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Users</SelectLabel>
              {this.state.allUsers.map((username) => (
                <SelectItem value={username}>{username}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-row">
          <PrimaryButton
            className="mt-3"
            text="Invite"
            type="button"
            onClick={handleInvite}
          />
          <PrimaryButton
            className="mt-3 ml-1"
            text="Ban"
            type="button"
            onClick={handleBan}
          />
        </div>
      </div>
    );
  }
}
