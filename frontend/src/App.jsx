import { Route, Routes } from "react-router"
import AuthProvider from "./providers/AuthProvider"
import ThemeProvider from "./providers/ThemeProvider"
import Login from "./components/Login"
import Home from "./components/home"

function App() {
  return <div>
    <AuthProvider>
        <ThemeProvider>
          <Routes>  
          <Route index element=<Home/> />
          <Route path="/login" element=<Login/> />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
  </div>
}

export default App
