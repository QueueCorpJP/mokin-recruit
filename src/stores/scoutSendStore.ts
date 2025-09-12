import { create } from 'zustand';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';

export interface ScoutDraft {
  group: string;
  recruitmentTarget: string;
  scoutSenderName: string;
  candidateId: string;
  scoutTemplate: string;
  title: string;
  message: string;
}

type DraftMap = Record<string, ScoutDraft>;

export interface ScoutSendState {
  drafts: DraftMap;
  setDraft: (candidateId: string, partial: Partial<ScoutDraft>) => void;
  getDraft: (candidateId: string) => ScoutDraft | undefined;
  resetDraft: (candidateId: string) => void;
}

const createEmptyDraft = (candidateId: string): ScoutDraft => ({
  group: '',
  recruitmentTarget: '',
  scoutSenderName: '',
  candidateId,
  scoutTemplate: '',
  title: '',
  message: '',
});

export const useScoutSendStore = create<ScoutSendState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        drafts: {},
        setDraft: (candidateId, partial) =>
          set((state) => ({
            drafts: {
              ...state.drafts,
              [candidateId]: {
                ...(state.drafts[candidateId] ?? createEmptyDraft(candidateId)),
                ...partial,
              },
            },
          })),
        getDraft: (candidateId) => get().drafts[candidateId],
        resetDraft: (candidateId) =>
          set((state) => {
            const next = { ...state.drafts };
            delete next[candidateId];
            return { drafts: next };
          }),
      }),
      {
        name: 'scout-send-drafts',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ drafts: state.drafts }),
      }
    )
  )
);


