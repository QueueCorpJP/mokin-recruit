import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Message } from '@/components/message/MessageList';

export interface MessageState {
  messages: Message[];
  selectedMessageId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setSelectedMessage: (id: string | null) => void;
  markAsRead: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filter states
  statusFilter: string;
  groupFilter: string;
  companyFilter: string;
  keyword: string;
  
  // Filter actions  
  setStatusFilter: (filter: string) => void;
  setGroupFilter: (filter: string) => void;
  setCompanyFilter: (filter: string) => void;
  setKeyword: (keyword: string) => void;
  
  // Computed
  getFilteredMessages: (isCandidatePage?: boolean) => Message[];
  getSelectedMessage: () => Message | undefined;
}

export const useMessageStore = create<MessageState>()(
  subscribeWithSelector((set, get) => ({
    // State
    messages: [],
    selectedMessageId: null,
    isLoading: false,
    error: null,
    
    // Filter state
    statusFilter: 'all',
    groupFilter: 'all', 
    companyFilter: 'all',
    keyword: '',
    
    // Actions
    setMessages: (messages) => set({ messages }),
    
    addMessage: (message) => set(state => ({
      messages: [...state.messages, message]
    })),
    
    updateMessage: (id, updates) => set(state => ({
      messages: state.messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    })),
    
    setSelectedMessage: (id) => set({ selectedMessageId: id }),
    
    markAsRead: (id) => set(state => ({
      messages: state.messages.map(msg =>
        msg.id === id ? { ...msg, isUnread: false } : msg
      )
    })),
    
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    
    // Filter actions
    setStatusFilter: (filter) => set({ statusFilter: filter }),
    setGroupFilter: (filter) => set({ groupFilter: filter }),
    setCompanyFilter: (filter) => set({ companyFilter: filter }),
    setKeyword: (keyword) => set({ keyword }),
    
    // Computed
    getFilteredMessages: (isCandidatePage = false) => {
      const { messages, statusFilter, groupFilter, companyFilter, keyword } = get();
      
      console.log('getFilteredMessages debug:', {
        isCandidatePage,
        messagesCount: messages.length,
        statusFilter,
        groupFilter,
        companyFilter,
        keyword,
        firstMessage: messages[0]
      });
      
      const filtered = messages.filter(message => {
        // Candidate page filtering
        if (isCandidatePage) {
          if (companyFilter !== 'all' && message.companyName !== companyFilter) {
            console.log('Filtered out by companyFilter:', message.companyName, 'vs', companyFilter);
            return false;
          }
          if (keyword && 
            !`${message.companyName} ${message.candidateName} ${message.messagePreview} ${message.jobTitle}`
              .toLowerCase()
              .includes(keyword.toLowerCase())
          ) {
            console.log('Filtered out by keyword:', keyword);
            return false;
          }
          return true;
        }
        
        // Company page filtering
        if (statusFilter !== 'all') {
          if (statusFilter === 'unread' && !message.isUnread) {
            console.log('Filtered out by statusFilter (unread):', message.id, message.isUnread);
            return false;
          }
          if (statusFilter === 'read' && message.isUnread) {
            console.log('Filtered out by statusFilter (read):', message.id, message.isUnread);
            return false;
          }
        }
        
        if (groupFilter !== 'all' && message.groupName !== groupFilter) {
          console.log('Filtered out by groupFilter:', message.groupName, 'vs', groupFilter);
          return false;
        }
        
        if (keyword) {
          const searchText =
            `${message.companyName} ${message.candidateName} ${message.messagePreview} ${message.jobTitle}`
              .toLowerCase();
          if (!searchText.includes(keyword.toLowerCase())) {
            console.log('Filtered out by keyword search:', keyword, 'in', searchText);
            return false;
          }
        }
        
        console.log('Message passed all filters:', message.id);
        return true;
      });
      
      console.log('Filtered result count:', filtered.length);
      return filtered;
    },
    
    getSelectedMessage: () => {
      const { messages, selectedMessageId } = get();
      return messages.find(msg => msg.id === selectedMessageId);
    }
  }))
);