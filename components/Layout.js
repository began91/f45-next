import styles from './Layout.module.css';
import Image from 'next/image';
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import logos from '../public/workout-logos/workout-logos';

const name = 'Fit 45-Minute Workout Timer';
export const siteTitle = 'Fit 45-Minute Workout Timer';

export default function Layout({ children, home }) {
    return (
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
                {home ? (
                    <>
                        <Image
                            priority
                            src={logos.defaultLogo}
                            className={utilStyles.borderCircle}
                            height={144}
                            width={144}
                            alt={name}
                        />
                    </>
                ) : (
                    <>
                        <div className={styles.homeCaret}>
                            <Link href="/">
                                <a>&lt; Home</a>
                            </Link>
                        </div>
                        <Link href="/">
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
                        </Link>
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
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>&lt; Back to Home</a>
                    </Link>
                </div>
            )}
        </div>
    );
}
