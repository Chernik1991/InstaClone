import { useRef, useState } from 'react'

import AvatarEditor from 'react-avatar-editor'
import { useSelector } from 'react-redux'

import { DeleteImageModal } from './DeleteImageModal/DeleteImageModal'
import { Filters } from './Filters/Filters'
import { PhotoEditingHeader } from './PhotoEditingHeader/PhotoEditingHeader'
import { PopoversCrop } from './popovers/crop/PopoversCrop'
import { Publication } from './Publication/Publication'

import { createFilteredFile } from 'features/createPost/lib/createFilteredFile'
import { getDescription } from 'features/createPost/model/selectors/getDescription/getDescription'
import { getFilter } from 'features/createPost/model/selectors/getFilter/getFilter'
import { getImage } from 'features/createPost/model/selectors/getImage/getImage'
import { getIsOpenModal } from 'features/createPost/model/selectors/getIsOpenModal/getIsOpenModal'
import { getStep } from 'features/createPost/model/selectors/getStep/getStep'
import { setStep } from 'features/createPost/model/slice/uploadPhotoSlice'
import { STEP } from 'features/createPost/model/types/const'
import { useAddPostMutation, useUploadMutation } from 'features/createPost/service/uploadPost'
import cls from 'features/createPost/ui/steps/EditImage/EditImage.module.scss'
import { useAppDispatch } from 'shared/hooks/useAppDispatch'
import { useAppSelector } from 'shared/hooks/useAppSelector'
import { useStretchImage } from 'shared/hooks/useStretchImage'
import { classNames } from 'shared/lib/classNames/classNames'
import { LoaderContent } from 'shared/ui/LoaderContent/LoaderContent'

export const EditImage = () => {
  const dispatch = useAppDispatch()
  const [upload] = useUploadMutation()
  const [addPost] = useAddPostMutation()
  const [isLoading, setIsLoading] = useState(false)
  const isOpen = useSelector(getIsOpenModal)

  const parentRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<AvatarEditor>(null)
  const image = useAppSelector(getImage)
  const step = useAppSelector(getStep)
  const height = useAppSelector(state => state.uploadPhoto.height)
  const width = useAppSelector(state => state.uploadPhoto.width)
  const scale = useAppSelector(state => state.uploadPhoto.scale)
  const crop = useAppSelector(state => state.uploadPhoto.crop)
  const filter = useAppSelector(getFilter)
  const description = useAppSelector(getDescription)

  useStretchImage(parentRef)

  const onPublishPost = async () => {
    if (editorRef.current) {
      const file = await createFilteredFile(editorRef, filter)

      const formData = new FormData()

      formData.append('file', file)

      setIsLoading(true)
      upload(formData)
        .unwrap()
        .then((res: any) =>
          addPost({ description, childrenMetadata: [{ uploadId: res.images[0].uploadId }] })
        )
        .then((res: any) => {
          dispatch(setStep(STEP.PUBLICATION_COMPLETED))
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }

  const modsSidebarR = {
    [cls.open]: step === STEP.FILTERS || step === STEP.PUBLICATION,
  }

  return (
    <div className={cls.PhotoEditing}>
      {isLoading && <LoaderContent isText={true} className={cls.loaderContent} />}
      {isOpen && <DeleteImageModal />}

      <PhotoEditingHeader onPublishPost={onPublishPost} />

      <div className={cls.wrapper} ref={parentRef}>
        <div className={cls.avatarContainer}>
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={width}
            height={height}
            scale={scale}
            border={crop ? 1 : 0}
            style={{
              objectFit: 'cover',
              filter: filter,
            }}
          />
        </div>

        {step === STEP.CROP && <PopoversCrop parentRef={parentRef} />}
      </div>

      <div className={classNames(cls.sidebarR, modsSidebarR, [])}>
        {step === STEP.FILTERS && <Filters />}
        {step === STEP.PUBLICATION && <Publication />}
      </div>
    </div>
  )
}
