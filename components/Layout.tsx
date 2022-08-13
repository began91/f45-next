import styles from './Layout.module.css';
import Image from 'next/image';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import LinkIf from 'components/LinkIf';
import Link from 'next/link';
// import logos from '../public/workout-logos/workout-logos';
import cn from 'classnames';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

const name = 'Fit 45-Minute Workout Timer';
export const siteTitle = 'Fit 45-Minute Workout Timer';

interface NavBarType {
	page: string;
	date: Date;
}

function NavBar({ page, date }: NavBarType) {
	//navbar at top of layout
	if (!date) {
		throw new Error('Date not supplied to NavBar');
	}

	// get session to check whether user is authenticated (affects display of login or profile link)
	const { data: session, status } = useSession();
	let auth;

	if (status === 'authenticated') {
		//link to profile if authenticated
		const { user } = session;
		auth = (
			<Link href="/profile" className={styles.navLink}>
				<div className={styles.navItem}>
					Profile{' '}
					<div
						style={{
							display: 'inline-block',
							position: 'relative',
							width: '20px',
							height: '20px',
						}}
					>
						<Image src={user.image} alt="user" layout="fill" />
					</div>
				</div>
			</Link>
		);
	} else if (page !== 'auth') {
		//link to auth path if not signed in
		auth = (
			<Link href="/api/auth/signin" className={styles.navLink}>
				<div className={styles.navItem}>Login</div>
			</Link>
		);
	}
	//year,month,day to add to daily link
	let datePathString = `/${date.getFullYear()}/${
		date.getMonth() + 1
	}/${date.getDate()}`;

	//links to iterate over
	let href = [
		'/',
		'/schedule' + datePathString,
		'/weekly' + datePathString,
		'/daily' + datePathString,
		'/custom',
	];
	let pageNames = ['Home', 'Month', 'Week', 'Day', 'Custom'];
	return (
		<nav className={styles.navList}>
			{pageNames.map((title, i) => {
				//check if current page for css and to disable link
				const isCurrentPage = page === title;
				return (
					<LinkIf href={href[i]} isLink={!isCurrentPage} key={i}>
						<div
							className={cn(styles.navItem, {
								[styles.currentPage]: isCurrentPage,
							})}
						>
							{title}
						</div>
					</LinkIf>
				);
			})}
			{auth}
		</nav>
	);
}

interface LayoutType {
	children: ReactNode;
	page: string;
	date: Date;
}

export default function Layout({ children, page, date }: LayoutType) {
	return (
		<>
			<NavBar page={page} date={date} />
			<div className={styles.container}>
				<Head>
					<link rel="icon" href="/favicon.ico" />
					<meta
						name="description"
						content="Learn how your next F45 workout will be timed"
					/>
					<meta
						property="og:image"
						content={`https://og-image.vercel.app/${encodeURI(
							siteTitle
						)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
					/>
					<meta name="og:title" content={siteTitle} />
					<meta name="twitter:card" content="summary_large_image" />
					<title>{siteTitle}</title>
				</Head>
				<header className={styles.header}>
					{page === 'Home' ? (
						<>
							{/* <Image
                                priority
                                src={logos.defaultLogo}
                                className={utilStyles.borderCircle}
                                height={144}
                                width={144}
                                alt={name}
                            /> */}
						</>
					) : (
						<>
							{/* <Link href="/">
                                <a>
                                    <Image
                                        priority
                                        src={logos.defaultLogo}
                                        className={utilStyles.borderCircle}
                                        height={108}
                                        width={108}
                                        alt={name}
                                    />
                                </a>
                            </Link> */}
							<h2 className={utilStyles.headingLg}>
								<Link href="/">
									<a className={utilStyles.colorInherit}>
										{name}
									</a>
								</Link>
							</h2>
						</>
					)}
				</header>
				<main>{children}</main>
				{!(page === 'Home') && (
					<div className={styles.backToHome}>
						<Link href="/">
							<a>&lt; Back to Home</a>
						</Link>
					</div>
				)}
			</div>
		</>
	);
}
