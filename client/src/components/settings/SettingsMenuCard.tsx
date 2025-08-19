import React from 'react';
import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SettingsMenuItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

interface SettingsMenuCardProps {
  items: SettingsMenuItem[];
}

export function SettingsMenuCard({ items }: SettingsMenuCardProps) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="divide-y">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {item.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}