import { createSlice } from "@reduxjs/toolkit";

export type Vec3 = [number, number, number];

export interface IBullet {
  id: string;
  position: Vec3;
  direction: Vec3;
  rotation: Vec3;
}

export const Bullets = createSlice({
  name: "bullets",
  initialState: [] as IBullet[],
  reducers: {
    addBullet: function (state, action){
        const newBullet = action.payload;
      return [...state , newBullet];
    },
    removeBullet: function (state, action) {
      const bulletId = action.payload;
      return state.filter((bullet) => bullet.id !== bulletId);
    },
  },
});

export const {addBullet, removeBullet} = Bullets.actions;

export default Bullets.reducer;
