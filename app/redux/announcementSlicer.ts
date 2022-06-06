import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "./store"

export enum AnnouncementStatus {
  UnRead,
  Read,
  Archive,
}

type AnnouncementType = { id: string; status: AnnouncementStatus; masjidId: string }

const initialState: AnnouncementType[] = []

const announcementSlicer = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addOrModifyAnnouncement: (state, action: PayloadAction<AnnouncementType>) => {
      const index = _.findIndex(state, (value) => value.id === action.payload.id)
      if (index >= 0) {
        state[index] = action.payload
      } else {
        state.push(action.payload)
      }
    },
    changeStatusAnnouncement: (
      state,
      action: PayloadAction<{ id: string; status: AnnouncementStatus }>,
    ) => {
      const index = _.findIndex(state, (value) => value.id === action.payload.id)
      if (index >= 0) {
        state[index].status = action.payload.status
      }
    },
    removeAnnouncementByMasjid: (state, action: PayloadAction<string>) => {
      _.remove(state, function (c) {
        return c.masjidId === action.payload
      })
    },
  },
})

export const { addOrModifyAnnouncement, removeAnnouncementByMasjid, changeStatusAnnouncement } =
  announcementSlicer.actions
export const useAnnouncements = (state: RootState) => state.announcement
export default announcementSlicer.reducer
