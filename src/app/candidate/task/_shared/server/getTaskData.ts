'use server';

import { getRooms } from '@/lib/rooms';
import { getCachedCandidateUser } from '@/lib/auth/server';
import type { TaskData } from '@/app/candidate/task/_shared/types';

export async function getCandidateTaskData(): Promise<TaskData> {
  const user = await getCachedCandidateUser();
  if (!user) {
    return { hasNewMessage: false, hasUnreadMessage: false };
  }

  const candidateId = user.id;
  try {
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter(
      (room: any) => room.unreadCount && room.unreadCount > 0
    );

    const taskData: TaskData = {
      hasNewMessage: false,
      hasUnreadMessage: false,
    };

    if (unreadRooms.length > 0) {
      const firstUnreadRoom = unreadRooms[0];
      if (!firstUnreadRoom) {
        return taskData;
      }
      const messageTime = firstUnreadRoom.lastMessageTime
        ? new Date(firstUnreadRoom.lastMessageTime)
        : new Date();
      const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
      const isWithin72Hours =
        Date.now() - messageTime.getTime() < seventyTwoHoursInMs;

      if (isWithin72Hours) {
        taskData.hasNewMessage = true;
        taskData.newMessageDate = messageTime;
        taskData.newMessageCompanyName = firstUnreadRoom.companyName;
        taskData.newMessageJobTitle = firstUnreadRoom.jobTitle;
        taskData.newMessageRoomId = firstUnreadRoom.id;
      } else {
        taskData.hasUnreadMessage = true;
        taskData.unreadMessageDate = messageTime;
        taskData.unreadMessageCompanyName = firstUnreadRoom.companyName;
        taskData.unreadMessageJobTitle = firstUnreadRoom.jobTitle;
        taskData.unreadMessageRoomId = firstUnreadRoom.id;
      }
    }

    return taskData;
  } catch (error) {
    console.error('Failed to fetch task data:', error);
    return { hasNewMessage: false, hasUnreadMessage: false };
  }
}
