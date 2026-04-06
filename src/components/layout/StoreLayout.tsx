import { Outlet } from 'react-router-dom';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

export default function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  );
}
