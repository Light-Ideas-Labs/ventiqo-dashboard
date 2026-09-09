import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = false,
  bgColor = "bg-gray-100",
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  bgColor?: string; 
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className={`h-[calc(100dvh-50px)] ${bgColor}`}>
          <div className="h-full  p-4 md:px-8">{children}</div>
        </ScrollArea>
      ) : (
        <div className={`h-full p-4 md:px-8 ${bgColor}`}>{children}</div>
      )}
    </>
  );
}