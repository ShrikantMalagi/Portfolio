import { IBullet } from "../slices/Bullets"

export type RootState = ReturnType<()=>{bullets:IBullet[]}>;