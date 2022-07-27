import styles from './Layout.module.css';
import Image from 'next/image';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
// import logos from '../public/workout-logos/workout-logos';
import cn from 'classnames';
import { useSession } from 'next-auth/react';

const name = 'Fit 45-Minute Workout Timer';
export const siteTitle = 'Fit 45-Minute Workout Timer';

function NavBar({ page }) {
    const { data: session, status } = useSession();

    let auth;

    if (status === 'authenticated') {
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
        auth = (
            <Link href="/api/auth/signin" className={styles.navLink}>
                <div className={styles.navItem}>Login</div>
            </Link>
        );
    }

    return (
        <nav className={styles.navList}>
            {['Home', 'Month', 'Week', 'Day', 'Custom'].map((title, i) => (
                <Link
                    href={['/', '/schedule', '/weekly', '/daily', '/custom'][i]}
                    className={styles.navLink}
                    key={i}
                >
                    <div
                        className={cn(styles.navItem, {
                            [styles.currentPage]: page === title,
                        })}
                    >
                        {title}
                    </div>
                </Link>
            ))}
            {auth}
        </nav>
    );
}

export default function Layout({ children, page }) {
    return (
        <>
            <NavBar page={page} />
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
