import React from 'react';
import './room-card.css';

import { Types } from 'syncstream-sharedlib';
import { NavigateFunction } from 'react-router-dom';
import { Check, User, X } from 'lucide-react';
import SessionState from '@/utilities/session-state';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Localize from '@/utilities/localize';
import * as api from '../../../api';

interface Props {
  roomData: Types.RoomData;
  navigate: NavigateFunction;
  updateRoomList: () => void;
  isInvite?: boolean;
  users?: string[];
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
    const localize = Localize.getInstance().localize();

    const handleJoinRoom = (event: React.SyntheticEvent) => {
      if (
        !this.props.isInvite ||
        (this.props.isInvite && SessionState.getInstance().currentUser.admin)
      ) {
        api.User.joinRoomPresence(this.props.roomData.roomID!).then(
          (success: api.SuccessState) => {
            if (
              success === api.SuccessState.ERROR ||
              success === api.SuccessState.FAIL
            ) {
              window.electron.ipcRenderer.invokeFunction('show-message-box', {
                title: localize.homePage.messageBox.errorTitle,
                message: localize.homePage.messageBox.joinRoomError,
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
            title: localize.homePage.messageBox.errorTitle,
            message: localize.homePage.messageBox.roomInviteAcceptError1,
          });
        } else if (res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: localize.homePage.messageBox.errorTitle,
            message: localize.homePage.messageBox.roomInviteAcceptError2,
          });
        } else {
          this.props.updateRoomList();
        }
      });
    };

    const rejectInvite = (event: React.SyntheticEvent) => {
      if (this.props.roomData.roomID === undefined) throw Error('Unreachable');
      api.User.declineInviteToRoom(this.props.roomData.roomID).then((res) => {
        if (res === api.SuccessState.ERROR) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: localize.homePage.messageBox.errorTitle,
            message: localize.homePage.messageBox.roomInviteDeclineError1,
          });
        } else if (res === api.SuccessState.FAIL) {
          window.electron.ipcRenderer.invokeFunction('show-message-box', {
            title: localize.homePage.messageBox.errorTitle,
            message: localize.homePage.messageBox.roomInviteDeclineError2,
          });
        } else {
          this.props.updateRoomList();
        }
      });
    };

    // ---- RENDER BLOCK ----
    return (
      <Card
        key={this.props.roomData.roomID}
        className="overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors relative"
        onClick={handleJoinRoom}
      >
        {!this.props.isInvite && this.props.users!.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <User className="h-5 w-5" />
                    {this.props.users!.length}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-semibold">
                  {localize.homePage.roomCard.userCount}
                </p>
                <ScrollArea className="h-full max-h-[100px]">
                  <ul className="list-disc pl-4">
                    {this.props.users!.map((username) => (
                      <li key={username} className="text-sm">
                        {username}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <CardContent className="p-4 flex flex-col select-none h-full w-full">
          <div className="grow">
            <h2 className="text-xl font-semibold">
              {this.props.roomData.roomName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {`${localize.homePage.roomCard.owner} ${this.props.roomData.roomOwner}`}
            </p>
          </div>
          {this.props.isInvite && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button variant="destructive" size="sm" onClick={rejectInvite}>
                <X className="h-4 w-4" />
              </Button>

              <Button
                variant="default"
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={acceptInvite}
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}
