import { useEffect, useState } from 'react'
import { AdaptiveWebModal } from 'ui/src'
import { WebModalWithBottomAttachment } from 'ui/src/components/modal/AdaptiveWebModal'
import { ModalProps } from 'uniswap/src/components/modals/ModalProps'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { INTERFACE_NAV_HEIGHT } from 'uniswap/src/theme/heights'
import { isExtension, isInterface } from 'utilities/src/platform'

const ANIMATION_MS = 200

export function Modal({
  children,
  name,
  onClose,
  fullScreen,
  backgroundColor,
  isModalOpen = true,
  alignment = 'center',
  maxWidth,
  maxHeight,
  height,
  padding,
  bottomAttachment,
  gap,
  paddingX,
  paddingY,
  analyticsProperties,
  skipLogImpression,
}: ModalProps): JSX.Element {
  const [fullyClosed, setFullyClosed] = useState(false)

  if (fullyClosed && isModalOpen) {
    setFullyClosed(false)
  }

  // Not the greatest, we are syncing 200 here to 200ms animation
  // TODO(EXT-745): Add Tamagui onFullyClosed callback and replace here
  useEffect(() => {
    if (!isModalOpen) {
      const tm = setTimeout(() => {
        setFullyClosed(true)
      }, ANIMATION_MS)

      return () => {
        clearTimeout(tm)
      }
    }
    return undefined
  }, [isModalOpen])

  const isTopAligned = alignment === 'top'
  const justifyContent = isTopAligned ? 'flex-start' : undefined

  const ModalComponent = bottomAttachment ? WebModalWithBottomAttachment : AdaptiveWebModal

  return (
    <Trace logImpression={skipLogImpression ? false : isModalOpen} modal={name} properties={analyticsProperties}>
      <ModalComponent
        bottomAttachment={bottomAttachment}
        shadowOpacity={isExtension ? 0 : undefined}
        borderWidth={isExtension ? 0 : undefined}
        adaptToSheet={isInterface}
        alignment={alignment}
        backgroundColor={backgroundColor}
        height={fullScreen ? '100%' : undefined}
        isOpen={isModalOpen}
        justifyContent={justifyContent}
        m="$none"
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        gap={gap}
        $sm={{
          p: padding ?? '$spacing12',
          ...(isInterface && {
            '$platform-web': {
              height: height ?? `calc(100dvh - ${INTERFACE_NAV_HEIGHT}px)`,
            },
          }),
        }}
        p={padding ?? '$spacing24'}
        px={paddingX}
        py={paddingY}
        position={isTopAligned ? 'absolute' : undefined}
        top={isTopAligned ? '$spacing16' : undefined}
        onClose={onClose}
      >
        {/*
            To keep this consistent with how the `Modal` works on native mobile, we only mount the children when the modal is open.
            It is critical for the modal to work this way or else it breaks existing assumptions throughout our codebase about when components are mounted / unmounted.
          */}
        {fullyClosed ? null : children}
      </ModalComponent>
    </Trace>
  )
}
