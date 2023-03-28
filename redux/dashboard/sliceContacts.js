import { createSlice } from "@reduxjs/toolkit";
import {
  fetchContacts,
  deleteContacts,
  addContacts,
  filterContacts,
} from "./operations";

const handlePending = (state) => {
  state.isLoading = true;
};

const handleFulfilled = (state, action) => {
  state.isLoading = false;
  state.error = null;
  state.items = action.payload;
};

const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState: { items: [], isLoading: false, error: null },

  extraReducers: (builder) => {
    builder.addCase(fetchContacts.pending, handlePending);
    builder.addCase(fetchContacts.fulfilled, handleFulfilled);
    builder.addCase(fetchContacts.rejected, handleRejected);

    builder.addCase(addContacts.pending, handlePending);
    builder.addCase(addContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.items.push(action.payload);
    });
    builder.addCase(addContacts.rejected, handleRejected);

    builder.addCase(deleteContacts.pending, handlePending);
    builder.addCase(deleteContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      const index = state.items.findIndex((item) => item.id === action.payload);
      state.items.splice(index, 1);
    });
    builder.addCase(deleteContacts.rejected, handleRejected);

    builder.addCase(filterContacts.pending, handlePending);
    builder.addCase(filterContacts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.items = action.payload;
    });
    builder.addCase(filterContacts.rejected, handleRejected);
  },
});

export const contactsReducer = contactsSlice.reducer;
