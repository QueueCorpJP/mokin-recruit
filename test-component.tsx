export default function TestComponent() {
  const isDesktop = true;

  return (
    <>
      <form>
        {isDesktop && (
          <main className='flex flex-col'>
            <div>Test content</div>
          </main>
        )}
      </form>
    </>
  );
}
