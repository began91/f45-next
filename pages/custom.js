import Layout from '../components/Layout';
import { getWorkoutByDate } from '../src/helpers/lists';

export default function custom({ useDate: [date, setDate] }) {
    return <Layout>Hello, Custom!{date.toISOString('dd-mmm-yy')}</Layout>;
}
