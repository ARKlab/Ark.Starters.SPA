import Main from "./main";

import { Route } from "react-router-dom";

function App() {
  return (
    <Route path="/">
      <Route path="/" element={<Main />} />
    </Route>
  );
}
export default App;
