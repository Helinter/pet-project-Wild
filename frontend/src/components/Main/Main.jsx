import { Outlet } from 'react-router-dom';


function Main() {
  return (
    <main className="page">
      <Outlet />
    </main>
  );
}

export default Main;
