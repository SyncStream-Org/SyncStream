import { useState } from 'react';
import { Mic, MicOff, PhoneOff, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import SessionState from '@/utilities/session-state';

interface User {
  name: string;
  isTalking: boolean;
}

interface VoiceChannelCardProps {
  callActive: boolean;
  channelName: string;
  users: User[];
  onMuteToggle: () => void;
  onLeaveCall: () => void;
}

export function VoiceChannelCard({
  callActive,
  channelName,
  users,
  onMuteToggle,
  onLeaveCall,
}: VoiceChannelCardProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isUsersListOpen, setIsUsersListOpen] = useState(true);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    onMuteToggle();
  };

  const handleLeaveCall = () => {
    onLeaveCall();
  };

  return callActive ? (
    <Card className="fixed bottom-4 right-4 w-48 shadow-lg py-2 gap-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">{channelName}</CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className={isMuted ? 'text-red-500' : 'text-green-500'}
              onClick={handleMuteToggle}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10"
              onClick={handleLeaveCall}
            >
              <PhoneOff size={18} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Collapsible open={isUsersListOpen} onOpenChange={setIsUsersListOpen}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {isUsersListOpen ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      className={`h-6 w-6 ${
                        user.isTalking ? 'ring-2 ring-green-500' : ''
                      }`}
                    >
                      <AvatarFallback>
                        {user.name.substring(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {user.name}{' '}
                      {user.name ===
                        SessionState.getInstance().currentUser.username &&
                        '(You)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  ) : null;
}
