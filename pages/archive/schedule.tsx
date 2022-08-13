import Layout from '../components/Layout';
import NewCalendar from 'components/NewCalendar';
import useSwr from 'swr';

export default function Schedule({ useDate }) {
	return (
		<Layout className="schedulePage" date={useDate[0]} page="Month">
			<NewCalendar useDate={useDate} month />
		</Layout>
	);
}
