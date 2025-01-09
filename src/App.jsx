import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SingleCoin from './components/SingleCoin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <SingleCoin cryptoId={"bitcoin"} />
    <Router>
      <Routes>
        
        <Route path="/crypto/:cryptoId" element={<CryptoDetailWrapper />} />
      </Routes>
    </Router>
    </>
  )
}

const CryptoDetailWrapper = () => {
  const { cryptoId } = useParams();
  return <SingleCoin cryptoId={cryptoId} />;
};

export default App
