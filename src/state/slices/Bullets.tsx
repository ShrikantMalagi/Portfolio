import { createSlice } from "@reduxjs/toolkit";
import { Vector3 } from "three";

export interface IBullet{
    id: string,
    position: Vector3,
    angle: Vector3,
}

export const Bullets = createSlice({
    name: "bullets",
    initialState:[] as IBullet[],
    reducers:{

    },
});

export default Bullets.reducer;