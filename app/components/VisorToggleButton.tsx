import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import React from 'react'
import { Toggle } from '~/components/ui/toggle'
import { tfvis } from '~/services/tfvis'

export const VisorToggleButton = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleClickToggleVisor = () => tfvis.visor().toggle()

  React.useEffect(() => {
    let observer: MutationObserver
    tfvis.visor().close()
    const visorEl = tfvis.visor().el.querySelector('.visor')
    if (visorEl) {
      observer = new MutationObserver(() =>
        setIsOpen(visorEl.getAttribute('data-isopen') === 'true'),
      )
      observer.observe(visorEl, { attributes: true })
    }
    return () => observer.disconnect()
  }, [setIsOpen])

  const Arrow = isOpen ? ArrowRightFromLine : ArrowLeftFromLine
  return (
    <Toggle variant="outline" pressed={isOpen} onClick={handleClickToggleVisor}>
      <Arrow className="mr-2 size-4" />
      {isOpen ? 'Close' : 'Open'}
    </Toggle>
  )
}
