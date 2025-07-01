import React from 'react';
import { Button } from './button';
import { Link, Star, Plus, Menu } from 'lucide-react';

export function ButtonShowcase() {
  return (
    <div className='p-8 space-y-8 bg-gray-50 min-h-screen'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Button Component Catalog
        </h1>
        <p className='text-gray-600 mb-8'>
          Figmaデザインシステムに基づくボタンコンポーネントのカタログです
        </p>

        {/* Green Button System */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Green System
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Gradient (32px)
              </h3>
              <Button variant='green-gradient' size='figma-default'>
                Green Gradient
              </Button>
              <Button variant='green-gradient' size='figma-default' disabled>
                Disabled
              </Button>
            </div>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Square (10px)
              </h3>
              <Button variant='green-square' size='figma-square'>
                Green Square
              </Button>
              <Button variant='green-square' size='figma-square' disabled>
                Disabled
              </Button>
            </div>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Outline (32px)
              </h3>
              <Button variant='green-outline' size='figma-outline'>
                Green Outline
              </Button>
              <Button variant='green-outline' size='figma-outline' disabled>
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Blue Button System */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Blue System
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Gradient (32px)
              </h3>
              <Button variant='blue-gradient' size='figma-blue'>
                Blue Gradient
              </Button>
              <Button variant='blue-gradient' size='figma-blue' disabled>
                Disabled
              </Button>
            </div>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Outline (32px)
              </h3>
              <Button variant='blue-outline' size='figma-blue-outline'>
                Blue Outline
              </Button>
              <Button variant='blue-outline' size='figma-blue-outline' disabled>
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Yellow Button System */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Yellow System (with Icons)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Gradient (10px)
              </h3>
              <div className='flex flex-wrap justify-center gap-2'>
                <Button variant='yellow-gradient' size='figma-yellow'>
                  <Link />
                  Link
                </Button>
                <Button variant='yellow-gradient' size='figma-yellow'>
                  <Star />
                  Star
                </Button>
                <Button variant='yellow-gradient' size='figma-yellow'>
                  <Plus />
                  Plus
                </Button>
              </div>
              <Button variant='yellow-gradient' size='figma-yellow' disabled>
                <Menu />
                Disabled
              </Button>
            </div>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Outline (10px)
              </h3>
              <div className='flex flex-wrap justify-center gap-2'>
                <Button variant='yellow-outline' size='figma-yellow-outline'>
                  <Link />
                  Link
                </Button>
                <Button variant='yellow-outline' size='figma-yellow-outline'>
                  <Star />
                  Star
                </Button>
                <Button variant='yellow-outline' size='figma-yellow-outline'>
                  <Plus />
                  Plus
                </Button>
              </div>
              <Button
                variant='yellow-outline'
                size='figma-yellow-outline'
                disabled
              >
                <Menu />
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* White Button System */}
        <section className='bg-gray-800 p-6 rounded-lg shadow-sm mb-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            White System (Vertical Layout)
          </h2>
          <div className='text-center space-y-4'>
            <h3 className='text-sm font-medium text-gray-300'>
              Outline Square (10px) - Vertical Icon Layout
            </h3>
            <div className='flex flex-wrap justify-center gap-4'>
              <Button variant='white-outline-square' size='figma-white-square'>
                <Link />
                Link
              </Button>
              <Button variant='white-outline-square' size='figma-white-square'>
                <Star />
                Star
              </Button>
              <Button variant='white-outline-square' size='figma-white-square'>
                <Plus />
                Plus
              </Button>
              <Button variant='white-outline-square' size='figma-white-square'>
                <Menu />
                Menu
              </Button>
            </div>
            <Button
              variant='white-outline-square'
              size='figma-white-square'
              disabled
            >
              <Link />
              Disabled
            </Button>
          </div>
        </section>

        {/* Small Button System */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Small System (リスト内緑)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Small Green (32px)
              </h3>
              <Button variant='small-green' size='figma-small'>
                テキスト
              </Button>
              <Button variant='small-green' size='figma-small' disabled>
                Disabled
              </Button>
            </div>
            <div className='text-center space-y-3'>
              <h3 className='text-sm font-medium text-gray-600'>
                Small Outline (32px)
              </h3>
              <Button variant='small-green-outline' size='figma-small-outline'>
                テキスト
              </Button>
              <Button
                variant='small-green-outline'
                size='figma-small-outline'
                disabled
              >
                Disabled
              </Button>
            </div>
          </div>
        </section>

        {/* Standard Buttons */}
        <section className='bg-white p-6 rounded-lg shadow-sm mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Standard System
          </h2>
          <div className='flex flex-wrap justify-center gap-3'>
            <Button variant='default'>Default</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link</Button>
            <Button variant='destructive'>Destructive</Button>
          </div>
        </section>

        {/* Size Variations */}
        <section className='bg-white p-6 rounded-lg shadow-sm'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Size Variations
          </h2>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Button size='sm'>Small</Button>
            <Button size='default'>Default</Button>
            <Button size='lg'>Large</Button>
            <Button size='icon'>
              <Star />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
