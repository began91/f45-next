import Link from 'next/link';
import React from 'react';

interface LinkIfType {
	href: string;
	children: any;
	isLink?: boolean;
}

export default function LinkIf({ href, children, isLink = true }: LinkIfType) {
	if (isLink) {
		//only make it a link if isLink is true
		return <Link href={href}>{children}</Link>;
	}

	return <>{children}</>;
}
