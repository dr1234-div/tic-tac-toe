import "./App.less";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <div>

      </div>
      <div className="AppRight">
        <div>
          <button onClick={() => navigate('/gobang')}>跳转</button>
          <button onClick={() => navigate('/wellchess')}>跳转</button>
        </div>
        <div>
          悔棋
        </div>
      </div>
    </div>
  );
}

export default App;
