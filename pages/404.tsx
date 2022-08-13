import Layout from 'components/Layout';
import Link from 'next/link';

export default function Daily404() {
	const date = new Date();
	return (
		<Layout page="Daily" date={date}>
			<h1>Error: 404</h1>
			<h2>No workout for selected date.</h2>
			<Link
				href={`schedule/${date.getFullYear()}/${
					date.getMonth() + 1
				}/${date.getDate()}`}
			>
				<a>Return to the Calendar</a>
			</Link>
		</Layout>
	);
}
