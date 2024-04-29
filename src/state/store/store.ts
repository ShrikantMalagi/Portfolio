import { configureStore } from '@reduxjs/toolkit'
import bulletsReducer from '../slices/Bullets';

export default configureStore({
  reducer: {
    bullets: bulletsReducer,
  }
})