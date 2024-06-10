import "./App.css";
import CollgeForm from "./components/Form";

function App() {
  return (
    <div className="App">
      <h1 id="page-heading">JoSAA Colleges</h1>
      <div>{<CollgeForm />}</div>
    </div>
  );
}

export default App;
