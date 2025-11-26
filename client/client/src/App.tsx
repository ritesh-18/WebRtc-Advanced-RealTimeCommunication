import { Routes, Route } from "react-router-dom";
import Sender from "./components/Sender";
import Reciever from "./components/Reciever";
const App = () => {
  return (
    <Routes>
      <Route path="/sender" element=<Sender /> />
      <Route path="/reciever" element=<Reciever /> />

      <Route path="/*" element={<div>Page not found</div>} />
      <Route path="/test" element={<div>Test Page</div>} />
    </Routes>
  );
};

export default App;
