import Layout from '../components/Layout';
import Calendar from '../components/Calendar';

export default function Schedule({ useDate }) {
    return (
        <Layout className="schedulePage" date={useDate[0]} page="Month">               
            <Calendar useDate={useDate} month />
        </Layout>
    );
}
