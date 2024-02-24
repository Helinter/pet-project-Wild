import { Routes, Route} from 'react-router-dom';
import Home from '../Home/Home';
import Search from '../Search/Search';
import Friends from '../Friends/Friends';
import Messages from '../Messages/Messages';
import Profile from '../Profile/Profile';



function Main() {

  return (
    

      <section className="main">

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />

        </Routes>

      </section>


  );
}

export default Main;
