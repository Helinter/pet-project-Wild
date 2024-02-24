import Main from '../Main/Main';
import Bar from '../Bar/Bar';

import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <section className="App">

        <Bar />
        <Main />

      </section>
    </Router>
  );
}

export default App;
