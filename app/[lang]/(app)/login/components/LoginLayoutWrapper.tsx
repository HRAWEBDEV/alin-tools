'use client';
import { ReactNode } from 'react';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function LoginLayoutWrapper({
 children,
}: {
 children: ReactNode;
}) {
 return <AuroraBackground>{children}</AuroraBackground>;
}
