import { ChakraProvider } from "@chakra-ui/react";
import Main from "./main";

import { Route } from "react-router-dom";

function App() {
  return (
    
    <ChakraProvider>
      <Route path="/">
        <Route path="/" element={<Main />} />
      </Route>
    </ChakraProvider>
  );
}
export default App;
