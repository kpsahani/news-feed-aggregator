import { createSlice } from '@reduxjs/toolkit';

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    author: null,
    category: null,
    source: null,
    personalizedTags: [],
    personalFeed: []
  },
  reducers: {
    setTags: (state, action) => {
        state.author = action.payload.author;
        state.category = action.payload.category;
        state.source = action.payload.source;
    },
    setPersonalizedTags: (state, action) =>{
        state.personalizedTags = action.payload
    },
    setPersonalFeed: (state, action) =>{
        state.personalFeed = action.payload
    },
    setPersonalizedTagsClient:(state, action) =>{
        const currentTags = [...state.personalizedTags]
        console.log("currentTags", currentTags);
        const chip = action.payload
        if (currentTags.includes(chip)) {
            state.personalizedTags = currentTags.filter((prevChip) => prevChip !== chip);
          } else {
            state.personalizedTags = [...currentTags, chip];
          }
    }
  },
});

export const { setTags, setPersonalizedTags, setPersonalizedTagsClient, setPersonalFeed } = feedSlice.actions;
export const author = (state) => state.feed.author;
export const category = (state) => state.feed.category;
export const source = (state) => state.feed.source;
export const getPersonalizedTags = (state) => state.feed.personalizedTags;
export const personalFeedList = (state) => state.feed.personalFeed;



export default feedSlice.reducer;
