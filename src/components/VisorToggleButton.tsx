import { tfvis } from '@/services/tfvis'
import { Toggle } from '@/components/ui/toggle'
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import React from 'react'

export const VisorToggleButton = () => {
	const [isOpen, setIsOpen] = React.useState(false)
	const handleClickToggleVisor = () => {
		tfvis.visor().toggle()
	}

	React.useEffect(() => {
		let observer: MutationObserver
		const visorEl = tfvis.visor().el.querySelector('.visor')
		if (visorEl) {
			observer = new MutationObserver(() => {
				setIsOpen(visorEl.getAttribute('data-isopen') === 'true')
			})
			observer.observe(visorEl, { attributes: true })
		}
		return () => {
			observer.disconnect()
		}
	}, [setIsOpen])

	return (
		<Toggle variant="outline" pressed={isOpen} onClick={handleClickToggleVisor}>
			{isOpen ? (
				<>
					<ArrowRightFromLine className="mr-2 h-4 w-4" />
					Close
				</>
			) : (
				<>
					<ArrowLeftFromLine className="mr-2 h-4 w-4" />
					Open
				</>
			)}
		</Toggle>
	)
}
