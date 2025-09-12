export interface TaskData {
  hasNewMessage: boolean;
  newMessageDate?: Date;
  newMessageCompanyName?: string;
  newMessageJobTitle?: string;
  newMessageRoomId?: string;

  hasUnreadMessage: boolean;
  unreadMessageDate?: Date;
  unreadMessageCompanyName?: string;
  unreadMessageJobTitle?: string;
  unreadMessageRoomId?: string;
}
