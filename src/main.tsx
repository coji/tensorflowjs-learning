import React from 'react'
import ReactDOM from 'react-dom/client'
import { IndexPage, loader as indexLoader } from '@/pages'
import '@/globals.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Root } from './root'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		children: [
			{
				path: '/',
				element: <IndexPage />,
				loader: indexLoader,
			},
		],
	},
])

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
