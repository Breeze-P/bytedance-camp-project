import { BrowserRouter as Router } from 'react-router-dom';
import ViewContainer from "./features/view_container";

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <Router>
          <ViewContainer/>
        </Router>
      </div>
    </div>
  );
}

export default App;
