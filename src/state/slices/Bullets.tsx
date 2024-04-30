import { createSlice } from "@reduxjs/toolkit";
import { Euler, Vector3 } from "three";

export interface IBullet {
  id: string;
  position: Vector3;
  angle: Euler;
}

export const Bullets = createSlice({
  name: "bullets",
  initialState: [] as IBullet[],
  reducers: {
    addBullet: function (state, action){
        const newBullet = action.payload;
      return [...state , newBullet];
    },
  },
});

export const {addBullet} = Bullets.actions;

export default Bullets.reducer;
