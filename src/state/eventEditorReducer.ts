import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the initial state
interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Venue {
  id: string;
  name: string;
  location: string;
}

interface EventEditorState {
  isTicketModalOpen: boolean;
  isVenueModalOpen: boolean;
  selectedTicket: Ticket | null;
  selectedVenue: Venue | null;
}

// Initial state for the event editor
const initialState: EventEditorState = {
  isTicketModalOpen: false,
  isVenueModalOpen: false,
  selectedTicket: null,
  selectedVenue: null,
};

export const eventEditorSlice = createSlice({
  name: "eventEditor",
  initialState,
  reducers: {
    // Ticket Modal Handlers
    openTicketModal: (state, action: PayloadAction<Ticket | null>) => {
      state.isTicketModalOpen = true;
      state.selectedTicket = action.payload; // Set selected ticket (if editing)
    },
    closeTicketModal: (state) => {
      state.isTicketModalOpen = false;
      state.selectedTicket = null;
    },

    // Venue Modal Handlers
    openVenueModal: (state, action: PayloadAction<Venue | null>) => {
      state.isVenueModalOpen = true;
      state.selectedVenue = action.payload; // Set selected venue (if editing)
    },
    closeVenueModal: (state) => {
      state.isVenueModalOpen = false;
      state.selectedVenue = null;
    },
  },
});

export const {
  openTicketModal,
  closeTicketModal,
  openVenueModal,
  closeVenueModal,
} = eventEditorSlice.actions;

export default eventEditorSlice.reducer;
