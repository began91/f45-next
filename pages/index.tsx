// import Head from 'next/head';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import Layout from 'components/Layout';
import utilStyles from 'styles/utils.module.css';
// import styles from 'styles/Home.module.css';

interface HomeType {
	useDate: [Date, Dispatch<SetStateAction<Date | undefined>>];
}

export default function Home({ useDate }: HomeType) {
	const date = useDate[0];
	return (
		<Layout page="Home" date={date}>
			<h1 className={utilStyles.headingXL}>
				Fit 45-Minute Workout Timer
			</h1>
			<section className={utilStyles.headingMd}>
				<h4>Start your fitness journey here:</h4>
				<ul>
					<li>
						Get a sneak peak at the upcoming F45{' '}
						<Link
							href={`schedule/${date.getFullYear()}/${
								date.getMonth() + 1
							}/${date.getDate()}`}
						>
							<a>class schedule</a>
						</Link>
					</li>
					<li>
						See the workouts&apos;{' '}
						<Link
							href={`weekly/${date.getFullYear()}/${
								date.getMonth() + 1
							}/${date.getDate()}`}
						>
							<a>stations for this week</a>
						</Link>
					</li>
					<li>
						Build your own{' '}
						<Link
							href={`custom/${date.getFullYear()}/${
								date.getMonth() + 1
							}/${date.getDate()}`}
						>
							<a>custom workouts</a>
						</Link>{' '}
						using the F45 format.
					</li>
				</ul>
			</section>
			<section className={utilStyles.headingXSm}>
				This site is not affiliated with{' '}
				<a href="https://f45training.com">F45 Training.</a> All
				presented information is sourced from{' '}
				<a href="https://www.reddit.com/r/f45">reddit.com/r/f45.</a> Any
				reference to content related to the registered trade mark of F45
				is for informational purposes only.
			</section>
		</Layout>
	);
}
