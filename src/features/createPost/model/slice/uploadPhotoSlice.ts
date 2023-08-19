import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UploadPhotoSchema } from '../types/uploadPhotoSchema'

const uploadPhotoSlice = createSlice({
  name: 'uploadPhoto',
  initialState: {
    step: 1,
    width: 500,
    height: 500,
    scale: 1,
    crop: undefined,
    imagesAvatar: [] as string[],
    filter: 'none',
    description: '',
  } as UploadPhotoSchema,
  reducers: {
    setImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload
    },
    setImages: (state, action: PayloadAction<string | string[]>) => {
      if (typeof action.payload === 'string') {
        state.imagesAvatar.push(action.payload)
      } else {
        state.imagesAvatar = [...state.imagesAvatar, ...action.payload]
      }
    },
    setCloseModal: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload
    },
    setDescriptionPost: (state, action: PayloadAction<string>) => {
      state.description = action.payload
    },
    setClearImagesAvatar: state => {
      state.imagesAvatar.length = 0
    },
    deleteAvatar: (state, action: PayloadAction<string>) => {
      const curIndex = state.imagesAvatar.findIndex(el => el === action.payload)

      if (curIndex !== -1) {
        state.imagesAvatar.splice(curIndex, 1)
      }
    },

    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    },
    setWidth: (state, action: PayloadAction<number>) => {
      state.width = action.payload
    },
    setHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload
    },
    setCrop: (state, action: PayloadAction<number | undefined>) => {
      state.crop = action.payload
    },
  },
})

export const { reducer: uploadPhotoReducer } = uploadPhotoSlice
export const {
  setImage,
  setCloseModal,
  setStep,
  setImages,
  setClearImagesAvatar,
  deleteAvatar,
  setDescriptionPost,
  setFilter,
  setHeight,
  setWidth,
  setScale,
  setCrop,
} = uploadPhotoSlice.actions
