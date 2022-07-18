import Layout from '../components/Layout';
import Calendar from '../components/Calendar';

export default function Schedule({ useDate }) {
    return (
        <Layout className="schedulePage">
            <Calendar useDate={useDate} month />
        </Layout>
    );
}
