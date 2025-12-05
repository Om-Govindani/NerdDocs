import Navbar from "./components/Navbar"


function App() {

  return (
    <div className="bg-slate-950 w-full h-screen flex-col">
      
        <Navbar />
        <div className="flex flex-1 w-full gap-x-1">
          <div className="w-1/5 h-full"></div>
          <div className="w-4/5 h-full overflow-y-auto"></div>
        </div>
    </div>
  )
}

export default App
