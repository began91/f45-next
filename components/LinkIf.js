import Link from 'next/link';

export default function LinkIf({href,children,isLink=true}) {
    
    if (isLink) {//only make it a link if isLink is true
        return <Link href={href}>{children}</Link>
    }

    return <>{children}</>
    
}