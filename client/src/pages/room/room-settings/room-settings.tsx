import './room-settings.css';
import React from 'react';
import Localize from '@/utilities/localize';
import { Types } from 'syncstream-sharedlib';
import PrimaryInput from '@/components/inputs/primary-input';
import PrimaryButton from '@/components/buttons/primary-button';
import * as api from '../../../api';

interface Props {
  roomID: string;
}

interface State {}

// TODO: localize
export default class RoomSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
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
        // if (res === api.SuccessState.ERROR || res === api.SuccessState.FAIL) {
        //   window.electron.ipcRenderer.invokeFunction('show-message-box', {
        //     title: localize.settingsPage.general.messageBox.errorTitle,
        //     message: localize.settingsPage.general.messageBox.updateError,
        //   });
        // } else {
        //   await Time.delay(100);
        //   api.User.getCurrentUser().then((userData) => {
        //     if (
        //       userData.success === api.SuccessState.FAIL ||
        //       userData.success === api.SuccessState.ERROR
        //     ) {
        //       throw new Error(
        //         'Unable to get the current user data, something has gone wrong server side.',
        //       );
        //     }
        //     if (userData.data === undefined) throw new Error('Unreachable');
        //     SessionState.getInstance().currentUser = userData.data;
        //     this.forceUpdate();
        //   });
        // }
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
      </div>
    );
  }
}
