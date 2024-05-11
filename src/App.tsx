// import { useState } from 'react'
import './App.css';
import './index.css';
import React, { useState } from 'react';
function App() {
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [placeHolder, setPlaceHolder] = useState<string>('Breathe In Breathe Out...');
  const [button, setButton] = useState<string>('Submit');
  //const [isClicked,setIsClicked] = useState<boolean>(false);
 // const [isInput,setIsInput] = useState<string>('');
 // const [isOutput, setIsOutput] = useState<string>('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPlaceHolder("Thinking...");
    setButton('Loading');
    const response = await fetch('http://localhost:8000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if(data){
      setPlaceHolder('');
      setAnswer(data.response);
      setButton('Submit');
    }
    console.log('Response from the server:', data);
    
  }

  // Function to update the state with the input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  

  return (
    <div className='bg-gradient-to-r from-black from-10% via-teal-900 via 20% to-gray-950  min-h-screen'>
      <div className='flex justify-center h-1/2'>
        <h1 className='transition ease-in-out delay-75 text-neutral-100  select-none text-7xl  hover:scale-110 hover:-trasnlate-y-1'>Ask a question</h1>
      </div>                                                                        
      <div className='h-1/2 pt-9'>
        <form onSubmit={handleSubmit} className='flex justify-center -space-x-14 '>
          <input required spellCheck autoComplete = 'off' className='bg-black text-teal-800 p-1 rounded-md outline outline-2 outline-teal-500/50 h-12 mr-20 placeholder-teal-800 w-1/3' id="query" type="text" value={query} onChange={handleChange} placeholder='Enter Your Question' />
          <button id="btn" type="submit" className='transition ease-in-out delay-75 duration-100  hover:scale-110 hover:-transalte-y-1 px-3 rounded-lg  outline outline-teal-600 hover:outline-teal-700 outline-offset-2 text-teal-600'>{button}</button>
        </form>
      </div>
      <div className='flex justify-center mt-9 grow '>
        <textarea readOnly={!!answer} className='bg-black text-teal-800  p-1 rounded-md outline outline-teal-700 outline-2 placeholder-teal-800 ppulse' rows={25} cols={50} placeholder={placeHolder} value={answer}></textarea>
      </div>
    </div>
  ); 
};

export default App
