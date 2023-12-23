import { Link } from '@remix-run/react'

export default function IndexPage() {
	return (
		<div className="text-center">
			<h1>Models</h1>
			<ul>
				<li>
					<Link to="/model/mpg">MPG</Link>
				</li>
			</ul>
		</div>
	)
}
