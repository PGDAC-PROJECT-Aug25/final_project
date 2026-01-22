import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import ThemeProvider from "./providers/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    
  );
}

export default App;
